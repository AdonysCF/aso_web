/* =========================================================
   COLORES EN EL VIENTO
   FICHA INDIVIDUAL DE OBRA
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const loading =
        document.getElementById("artworkLoading");

    const error =
        document.getElementById("artworkError");

    const page =
        document.getElementById("artworkPage");


    const artworkImage =
        document.getElementById("artworkImage");

    const artworkId =
        document.getElementById("artworkId");

    const artworkTitle =
        document.getElementById("artworkTitle");

    const artworkArtist =
        document.getElementById("artworkArtist");

    const artworkDescription =
        document.getElementById("artworkDescription");


    const technicalArtist =
        document.getElementById("technicalArtist");

    const technicalTechnique =
        document.getElementById("technicalTechnique");

    const technicalSupport =
        document.getElementById("technicalSupport");

    const technicalDimensions =
        document.getElementById("technicalDimensions");

    const technicalYear =
        document.getElementById("technicalYear");

    const technicalCode =
        document.getElementById("technicalCode");


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
       OBTENER ID DESDE URL
    ===================================================== */

    const params =
        new URLSearchParams(
            window.location.search
        );

    const artworkCode =
        params.get("id");


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

        const [
            obrasResponse,
            artistasResponse,
            exposicionesResponse
        ] = await Promise.all([

            fetch("data/obras.json"),

            fetch("data/artistas.json"),

            fetch("data/exposiciones.json")

        ]);


        if (
            !obrasResponse.ok ||
            !artistasResponse.ok ||
            !exposicionesResponse.ok
        ) {

            throw new Error(
                "No se pudieron cargar los datos."
            );

        }


        obras =
            await obrasResponse.json();

        artistas =
            await artistasResponse.json();

        exposiciones =
            await exposicionesResponse.json();


        const artwork =
            obras.find(
                obra =>
                    obra.id === artworkCode
            );


        if (!artwork) {

            showError();

            return;

        }


        renderArtwork(artwork);

    }

    catch (fetchError) {

        console.error(
            "Error cargando obra:",
            fetchError
        );

        showError();

    }


    /* =====================================================
       MOSTRAR OBRA
    ===================================================== */

    function renderArtwork(artwork) {

        const artist =
            artistas.find(
                item =>
                    item.id === artwork.artista
            );


        const artistName =
            artist
                ? artist.nombre
                : "Artista";


        /* Página */

        document.title =
            `${artwork.titulo} | Colores en el viento`;


        /* Imagen */

        artworkImage.src =
            artwork.imagen;

        artworkImage.alt =
            artwork.titulo;


        /* Código */

        artworkId.textContent =
            artwork.id.toUpperCase();


        /* Título */

        artworkTitle.textContent =
            artwork.titulo;


        /* Artista */

        artworkArtist.textContent =
            artistName;

        artworkArtist.href =
            `artista.html?id=${artwork.artista}`;


        /* Descripción */

        artworkDescription.textContent =
            artwork.descripcion ||
            "Información de la obra próximamente.";


        /* Datos técnicos */

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


        /* Navegación */

        renderNavigation(artwork);


        /* Mostrar */

        loading.hidden = true;

        error.hidden = true;

        page.hidden = false;


        window.scrollTo({
            top: 0,
            behavior: "instant"
        });

    }


    /* =====================================================
       EXPOSICIONES DE LA OBRA
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


        const artworkExhibitionData =
            artwork.exposiciones
                .map(exhibitionId => {

                    return exposiciones.find(
                        expo =>
                            expo.id === exhibitionId
                    );

                })
                .filter(Boolean);


        if (
            artworkExhibitionData.length === 0
        ) {

            artworkExhibitions.innerHTML = `
                <p class="artwork-no-exhibition">
                    Información de exposición
                    próximamente.
                </p>
            `;

            return;

        }


        artworkExhibitionData.forEach(
            exhibition => {

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

                    <span
                        class="artwork-exhibition__arrow"
                    >
                        ↗
                    </span>

                `;


                artworkExhibitions.appendChild(
                    link
                );

            }
        );

    }


    /* =====================================================
       ANTERIOR / SIGUIENTE
    ===================================================== */

    function renderNavigation(artwork) {

        const currentIndex =
            obras.findIndex(
                item =>
                    item.id === artwork.id
            );


        /*
         * Navegación circular:
         *
         * Primera obra:
         * anterior = última
         *
         * Última obra:
         * siguiente = primera
         */

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


        if (previous) {

            previousArtwork.href =
                `obra.html?id=${previous.id}`;

            previousArtworkTitle.textContent =
                previous.titulo;

        }


        if (next) {

            nextArtwork.href =
                `obra.html?id=${next.id}`;

            nextArtworkTitle.textContent =
                next.titulo;

        }

    }


    /* =====================================================
       ERROR
    ===================================================== */

    function showError() {

        loading.hidden = true;

        page.hidden = true;

        error.hidden = false;

        document.title =
            "Obra no encontrada | Colores en el viento";

    }

});