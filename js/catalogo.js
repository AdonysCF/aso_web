/* =========================================================
   COLORES EN EL VIENTO
   CATÁLOGO DE OBRAS
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const catalogGrid =
        document.getElementById("catalogGrid");

    const searchInput =
        document.getElementById("searchInput");

    const exhibitionFilter =
        document.getElementById("exhibitionFilter");

    const artistFilter =
        document.getElementById("artistFilter");

    const techniqueFilter =
        document.getElementById("techniqueFilter");

    const yearFilter =
        document.getElementById("yearFilter");

    const resetFilters =
        document.getElementById("resetFilters");

    const emptyResetButton =
        document.getElementById("emptyResetButton");

    const resultCount =
        document.getElementById("resultCount");

    const resultLabel =
        document.getElementById("resultLabel");

    const catalogEmpty =
        document.getElementById("catalogEmpty");


    /* =====================================================
       DATOS
    ===================================================== */

    let obras = [];
    let artistas = [];
    let exposiciones = [];


    /* =====================================================
       CARGAR JSON
    ===================================================== */

    async function loadData() {

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


            initializeCatalog();

        }

        catch (error) {

            console.error(
                "Error cargando catálogo:",
                error
            );


            catalogGrid.innerHTML = `
                <div class="catalog-error">

                    <h2>
                        No se pudo cargar el catálogo.
                    </h2>

                    <p>
                        Comprueba los archivos JSON
                        y utiliza Live Server.
                    </p>

                </div>
            `;

        }

    }


    /* =====================================================
       INICIAR CATÁLOGO
    ===================================================== */

    function initializeCatalog() {

        populateFilters();

        readURLFilters();

        applyFilters();

    }


    /* =====================================================
       CREAR FILTROS
    ===================================================== */

    function populateFilters() {

        /* Exposiciones */

        exposiciones.forEach(expo => {

            const option =
                document.createElement("option");

            option.value = expo.id;

            option.textContent =
                expo.nombre;

            exhibitionFilter.appendChild(option);

        });


        /* Artistas */

        artistas
            .sort(
                (a, b) =>
                    a.nombre.localeCompare(b.nombre)
            )
            .forEach(artista => {

                const option =
                    document.createElement("option");

                option.value =
                    artista.id;

                option.textContent =
                    artista.nombre;

                artistFilter.appendChild(option);

            });


        /* Técnicas */

        const techniques = [

            ...new Set(
                obras.map(
                    obra => obra.tecnica
                )
            )

        ].sort();


        techniques.forEach(tecnica => {

            const option =
                document.createElement("option");

            option.value =
                tecnica;

            option.textContent =
                tecnica;

            techniqueFilter.appendChild(option);

        });


        /* Años */

        const years = [

            ...new Set(
                obras.map(
                    obra => obra.anio
                )
            )

        ].sort(
            (a, b) => b - a
        );


        years.forEach(year => {

            const option =
                document.createElement("option");

            option.value =
                year;

            option.textContent =
                year;

            yearFilter.appendChild(option);

        });

    }


    /* =====================================================
       OBTENER NOMBRE ARTISTA
    ===================================================== */

    function getArtistName(id) {

        const artist =
            artistas.find(
                artista =>
                    artista.id === id
            );


        return artist
            ? artist.nombre
            : "Artista";

    }


    /* =====================================================
       NORMALIZAR TEXTO
    ===================================================== */

    function normalizeText(text = "") {

        return text
            .toString()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .toLowerCase();

    }


    /* =====================================================
       FILTRAR
    ===================================================== */

    function applyFilters() {

        const search =
            normalizeText(
                searchInput.value.trim()
            );


        const exhibition =
            exhibitionFilter.value;


        const artist =
            artistFilter.value;


        const technique =
            techniqueFilter.value;


        const year =
            yearFilter.value;


        const filteredWorks =
            obras.filter(obra => {

                const artistName =
                    getArtistName(
                        obra.artista
                    );


                const searchableText =
                    normalizeText(
                        `
                        ${obra.titulo}
                        ${artistName}
                        ${obra.tecnica}
                        ${obra.anio}
                        `
                    );


                const matchesSearch =
                    !search ||
                    searchableText.includes(
                        search
                    );


                const matchesExhibition =
                    !exhibition ||
                    (
                        Array.isArray(
                            obra.exposiciones
                        ) &&
                        obra.exposiciones.includes(
                            exhibition
                        )
                    );


                const matchesArtist =
                    !artist ||
                    obra.artista === artist;


                const matchesTechnique =
                    !technique ||
                    obra.tecnica === technique;


                const matchesYear =
                    !year ||
                    obra.anio.toString() === year;


                return (
                    matchesSearch &&
                    matchesExhibition &&
                    matchesArtist &&
                    matchesTechnique &&
                    matchesYear
                );

            });


        renderWorks(filteredWorks);

        updateURL();

    }


    /* =====================================================
       MOSTRAR OBRAS
    ===================================================== */

    function renderWorks(filteredWorks) {

        catalogGrid.innerHTML = "";


        resultCount.textContent =
            filteredWorks.length;


        resultLabel.textContent =
            filteredWorks.length === 1
                ? "obra"
                : "obras";


        if (filteredWorks.length === 0) {

            catalogGrid.hidden = true;

            catalogEmpty.hidden = false;

            return;

        }


        catalogGrid.hidden = false;

        catalogEmpty.hidden = true;


        filteredWorks.forEach(
            (obra, index) => {

                const artistName =
                    getArtistName(
                        obra.artista
                    );


                const article =
                    document.createElement(
                        "article"
                    );


                article.className =
                    "catalog-card";


                article.innerHTML = `

                    <a
                        href="obra.html?id=${obra.id}"
                        class="catalog-card__image"
                        aria-label="Ver ${obra.titulo}"
                    >

                        <img
                            src="${obra.imagen}"
                            alt="${obra.titulo}"
                            loading="lazy"
                        >

                        <span
                            class="catalog-card__index"
                        >
                            ${String(index + 1)
                                .padStart(2, "0")}
                        </span>

                        <span
                            class="catalog-card__action"
                        >
                            Ver obra ↗
                        </span>

                    </a>


                    <div
                        class="catalog-card__content"
                    >

                        <div
                            class="catalog-card__heading"
                        >

                            <h2>
                                ${obra.titulo}
                            </h2>

                            <span>
                                ${obra.anio}
                            </span>

                        </div>


                        <a
                            href="artista.html?id=${obra.artista}"
                            class="catalog-card__artist"
                        >
                            ${artistName}
                        </a>


                        <div
                            class="catalog-card__meta"
                        >

                            <span>
                                ${obra.tecnica}
                            </span>

                            <span>
                                ${obra.dimensiones}
                            </span>

                        </div>

                    </div>

                `;


                catalogGrid.appendChild(
                    article
                );

            }
        );

    }


    /* =====================================================
       LIMPIAR FILTROS
    ===================================================== */

    function clearFilters() {

        searchInput.value = "";

        exhibitionFilter.value = "";

        artistFilter.value = "";

        techniqueFilter.value = "";

        yearFilter.value = "";

        applyFilters();

    }


    /* =====================================================
       FILTROS DESDE URL
       
       Ejemplo:
       obras.html?exposicion=expo-001
    ===================================================== */

    function readURLFilters() {

        const params =
            new URLSearchParams(
                window.location.search
            );


        const exhibition =
            params.get("exposicion");


        const artist =
            params.get("artista");


        const technique =
            params.get("tecnica");


        const year =
            params.get("anio");


        const search =
            params.get("buscar");


        if (exhibition) {

            exhibitionFilter.value =
                exhibition;

        }


        if (artist) {

            artistFilter.value =
                artist;

        }


        if (technique) {

            techniqueFilter.value =
                technique;

        }


        if (year) {

            yearFilter.value =
                year;

        }


        if (search) {

            searchInput.value =
                search;

        }

    }


    /* =====================================================
       ACTUALIZAR URL
    ===================================================== */

    function updateURL() {

        const params =
            new URLSearchParams();


        if (exhibitionFilter.value) {

            params.set(
                "exposicion",
                exhibitionFilter.value
            );

        }


        if (artistFilter.value) {

            params.set(
                "artista",
                artistFilter.value
            );

        }


        if (techniqueFilter.value) {

            params.set(
                "tecnica",
                techniqueFilter.value
            );

        }


        if (yearFilter.value) {

            params.set(
                "anio",
                yearFilter.value
            );

        }


        if (searchInput.value.trim()) {

            params.set(
                "buscar",
                searchInput.value.trim()
            );

        }


        const query =
            params.toString();


        const newURL =
            query
                ? `${window.location.pathname}?${query}`
                : window.location.pathname;


        window.history.replaceState(
            {},
            "",
            newURL
        );

    }


    /* =====================================================
       EVENTOS
    ===================================================== */

    searchInput.addEventListener(
        "input",
        applyFilters
    );


    exhibitionFilter.addEventListener(
        "change",
        applyFilters
    );


    artistFilter.addEventListener(
        "change",
        applyFilters
    );


    techniqueFilter.addEventListener(
        "change",
        applyFilters
    );


    yearFilter.addEventListener(
        "change",
        applyFilters
    );


    resetFilters.addEventListener(
        "click",
        clearFilters
    );


    emptyResetButton.addEventListener(
        "click",
        clearFilters
    );


    /* =====================================================
       CARGAR
    ===================================================== */

    loadData();

});