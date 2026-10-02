document.addEventListener("DOMContentLoaded", async () => {

    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const loading = document.getElementById("artworkLoading");
    const error = document.getElementById("artworkError");
    const page = document.getElementById("artworkPage");

    const artworkImage = document.getElementById("artworkImage");
    const artworkId = document.getElementById("artworkId");
    const artworkTitle = document.getElementById("artworkTitle");
    const artworkArtist = document.getElementById("artworkArtist");
    const artworkDescription = document.getElementById("artworkDescription");

    const technicalArtist = document.getElementById("technicalArtist");
    const technicalTechnique = document.getElementById("technicalTechnique");
    const technicalSupport = document.getElementById("technicalSupport");
    const technicalDimensions = document.getElementById("technicalDimensions");
    const technicalYear = document.getElementById("technicalYear");
    const technicalCode = document.getElementById("technicalCode");

    const artworkExhibitions =
        document.getElementById("artworkExhibitions");

    const previousArtwork =
        document.getElementById("previousArtwork");

    const previousArtworkTitle =
        document.getElementById("previousArtworkTitle");

    const nextArtwork =
        document.getElementById("nextArtwork");

    const nextArtworkTitle =
        document.getElementById("nextArtworkTitle");


    /* =====================================================
       LEER ID DE LA URL
    ===================================================== */

    const params = new URLSearchParams(window.location.search);

    const artworkCode = params.get("id");


    if (!artworkCode) {
        showError();
        return;
    }


    /* =====================================================
       DATOS
    ===================================================== */

    let obras = [];
    let artistas = [];
    let exposiciones = [];


    /* =====================================================
       CARGAR JSON
    ===================================================== */

    try {

        const responses = await Promise.all([
            fetch("data/obras.json"),
            fetch("data/artistas.json"),
            fetch("data/exposiciones.json")
        ]);


        if (responses.some(response => !response.ok)) {

            throw new Error(
                "No se pudieron cargar los archivos JSON."
            );

        }


        obras = await responses[0].json();
        artistas = await responses[1].json();
        exposiciones = await responses[2].json();


        console.log("Obras cargadas:", obras);
        console.log("Artistas cargados:", artistas);
        console.log("Exposiciones cargadas:", exposiciones);


        const artwork = obras.find(
            obra => obra.id === artworkCode
        );


        if (!artwork) {

            console.error(
                "No existe la obra:",
                artworkCode
            );

            showError();

            return;

        }


        renderArtwork(artwork);

    }

    catch (err) {

        console.error(
            "Error cargando la ficha de obra:",
            err
        );

        showError();

    }


    /* =====================================================
       MOSTRAR OBRA
    ===================================================== */

    function renderArtwork(artwork) {

        const artist = artistas.find(
            artista => artista.id === artwork.artista
        );


        const artistName =
            artist?.nombre || "Artista";


        /* Título navegador */

        document.title =
            `${artwork.titulo} | Colores en el viento`;


        /* Imagen */

        artworkImage.src = artwork.imagen;

        artworkImage.alt = artwork.titulo;


        /* Información */

        artworkId.textContent =
            artwork.id.toUpperCase();

        artworkTitle.textContent =
            artwork.titulo;

        artworkArtist.textContent =
            artistName;

        artworkArtist.href =
            `artista.html?id=${artwork.artista}`;


        artworkDescription.textContent =
            artwork.descripcion ||
            "Información de la obra próximamente.";


        /* =================================================
           FICHA TÉCNICA
        ================================================= */

        technicalArtist.textContent =
            artistName;

        technicalTechnique.textContent =
            artwork.tecnica || "—";

        technicalSupport.textContent =
            artwork.soporte || "—";

        technicalDimensions.textContent =
            artwork.dimensiones || "—";

        technicalYear.textContent =
            artwork.anio || "—";

        technicalCode.textContent =
            artwork.id.toUpperCase();


        /* Exposiciones */

        renderExhibitions(artwork);


        /* Anterior / siguiente */

        renderNavigation(artwork);


        /* =================================================
           MOSTRAR PÁGINA
        ================================================= */

        loading.hidden = true;

        error.hidden = true;

        page.hidden = false;

    }


    /* =====================================================
       EXPOSICIONES
    ===================================================== */

    function renderExhibitions(artwork) {

        artworkExhibitions.innerHTML = "";


        if (
            !Array.isArray(artwork.exposiciones) ||
            artwork.exposiciones.length === 0
        ) {

            artworkExhibitions.innerHTML = `
                <p class="artwork-no-exhibition">
                    Esta obra todavía no tiene
                    exposiciones registradas.
                </p>
            `;

            return;

        }


        const exhibitionData =
            artwork.exposiciones
                .map(id => {

                    return exposiciones.find(
                        expo => expo.id === id
                    );

                })
                .filter(Boolean);


        if (exhibitionData.length === 0) {

            artworkExhibitions.innerHTML = `
                <p class="artwork-no-exhibition">
                    Información de exposición
                    próximamente.
                </p>
            `;

            return;

        }


        exhibitionData.forEach(exhibition => {

            const link =
                document.createElement("a");


            link.className =
                "artwork-exhibition";


            link.href =
                `exposicion.html?id=${exhibition.id}`;


            link.innerHTML = `

                <div>

                    <span>
                        ${exhibition.anio || ""}
                    </span>

                    <strong>
                        ${exhibition.nombre}
                    </strong>

                    <small>

                        ${exhibition.ciudad || ""}

                        ${
                            exhibition.lugar
                                ? " · " + exhibition.lugar
                                : ""
                        }

                    </small>

                </div>


                <span class="artwork-exhibition__arrow">
                    ↗
                </span>

            `;


            artworkExhibitions.appendChild(link);

        });

    }


    /* =====================================================
       ANTERIOR / SIGUIENTE
    ===================================================== */

    function renderNavigation(artwork) {

        if (obras.length <= 1) {

            previousArtwork.style.visibility =
                "hidden";

            nextArtwork.style.visibility =
                "hidden";

            return;

        }


        const currentIndex =
            obras.findIndex(
                obra => obra.id === artwork.id
            );


        const previousIndex =
            currentIndex === 0
                ? obras.length - 1
                : currentIndex - 1;


        const nextIndex =
            currentIndex === obras.length - 1
                ? 0
                : currentIndex + 1;


        const previous =
            obras[previousIndex];

        const next =
            obras[nextIndex];


        /* Anterior */

        previousArtwork.href =
            `obra.html?id=${previous.id}`;

        previousArtworkTitle.textContent =
            previous.titulo;


        /* Siguiente */

        nextArtwork.href =
            `obra.html?id=${next.id}`;

        nextArtworkTitle.textContent =
            next.titulo;

    }


    /* =====================================================
       ERROR
    ===================================================== */

    function showError() {

        if (loading) {
            loading.hidden = true;
        }


        if (page) {
            page.hidden = true;
        }


        if (error) {
            error.hidden = false;
        }


        document.title =
            "Obra no encontrada | Colores en el viento";

    }

});