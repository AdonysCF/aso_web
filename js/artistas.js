/* =========================================================
   COLORES EN EL VIENTO
   DIRECTORIO DE ARTISTAS Y COLABORADORES
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    const grid =
        document.getElementById("artistsGrid");

    const searchInput =
        document.getElementById("artistSearch");

    const tabs =
        document.querySelectorAll(".artists-tab");

    const count =
        document.getElementById("artistCount");

    const countLabel =
        document.getElementById("artistCountLabel");

    const empty =
        document.getElementById("artistsEmpty");

    const resetButton =
        document.getElementById("resetArtists");


    let artistas = [];
    let obras = [];

    let currentFilter = "todos";


    /* =====================================================
       NORMALIZAR TEXTO
    ===================================================== */

    function normalizeText(text = "") {

        return text
            .toString()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

    }


    /* =====================================================
       CARGAR DATOS
    ===================================================== */

    async function loadData() {

        try {

            const [
                artistsResponse,
                worksResponse
            ] = await Promise.all([

                fetch("data/artistas.json"),
                fetch("data/obras.json")

            ]);


            if (
                !artistsResponse.ok ||
                !worksResponse.ok
            ) {

                throw new Error(
                    "No se pudieron cargar los datos."
                );

            }


            artistas =
                await artistsResponse.json();

            obras =
                await worksResponse.json();


            applyFilters();

        }

        catch (error) {

            console.error(
                "Error cargando artistas:",
                error
            );


            grid.innerHTML = `
                <div class="artists-load-error">

                    <h2>
                        No se pudo cargar el directorio.
                    </h2>

                    <p>
                        Comprueba artistas.json y obras.json.
                    </p>

                </div>
            `;

        }

    }


    /* =====================================================
       CONTAR OBRAS
    ===================================================== */

    function getArtistWorks(artistId) {

        return obras.filter(
            obra =>
                obra.artista === artistId
        );

    }


    /* =====================================================
       FILTRAR
    ===================================================== */

    function applyFilters() {

        const search =
            normalizeText(
                searchInput.value.trim()
            );


        const filtered =
            artistas.filter(person => {

                const matchesType =
                    currentFilter === "todos" ||
                    person.tipo === currentFilter;


                const matchesSearch =
                    !search ||
                    normalizeText(person.nombre)
                        .includes(search);


                return (
                    matchesType &&
                    matchesSearch
                );

            });


        renderArtists(filtered);

    }


    /* =====================================================
       MOSTRAR PERSONAS
    ===================================================== */

    function renderArtists(people) {

        grid.innerHTML = "";


        count.textContent =
            people.length;


        countLabel.textContent =
            people.length === 1
                ? "persona"
                : "personas";


        if (people.length === 0) {

            grid.hidden = true;
            empty.hidden = false;

            return;

        }


        grid.hidden = false;
        empty.hidden = true;


        people.forEach((person, index) => {

            const artistWorks =
                getArtistWorks(person.id);


            const workCount =
                artistWorks.length;


            const typeLabel =
                person.tipo === "colaborador"
                    ? "Colaborador"
                    : "Artista";


            const article =
                document.createElement("article");


            article.className =
                "artist-card";


            article.innerHTML = `

                <a
                    href="artista.html?id=${person.id}"
                    class="artist-card__image"
                    aria-label="Ver perfil de ${person.nombre}"
                >

                    <img
                        src="${person.foto}"
                        alt="${person.nombre}"
                        loading="lazy"
                    >

                    <span class="artist-card__number">
                        ${String(index + 1).padStart(2, "0")}
                    </span>

                    <span class="artist-card__view">
                        Ver perfil ↗
                    </span>

                </a>


                <div class="artist-card__content">

                    <div class="artist-card__top">

                        <span class="artist-card__type">
                            ${typeLabel}
                        </span>

                        <span class="artist-card__works">
                            ${workCount}
                            ${workCount === 1 ? "obra" : "obras"}
                        </span>

                    </div>


                    <h2>

                        <a href="artista.html?id=${person.id}">
                            ${person.nombre}
                        </a>

                    </h2>

                </div>

            `;


            const image =
                article.querySelector("img");


            image.addEventListener(
                "error",
                () => {

                    image.style.display = "none";

                    article
                        .querySelector(".artist-card__image")
                        .classList.add(
                            "artist-card__image--empty"
                        );

                },
                { once: true }
            );


            grid.appendChild(article);

        });

    }


    /* =====================================================
       CAMBIAR FILTRO
    ===================================================== */

    tabs.forEach(tab => {

        tab.addEventListener("click", () => {

            tabs.forEach(item =>
                item.classList.remove("active")
            );


            tab.classList.add("active");


            currentFilter =
                tab.dataset.filter;


            applyFilters();

        });

    });


    /* =====================================================
       BUSCADOR
    ===================================================== */

    searchInput.addEventListener(
        "input",
        applyFilters
    );


    /* =====================================================
       REINICIAR
    ===================================================== */

    resetButton.addEventListener("click", () => {

        searchInput.value = "";

        currentFilter = "todos";


        tabs.forEach(tab => {

            tab.classList.toggle(
                "active",
                tab.dataset.filter === "todos"
            );

        });


        applyFilters();

    });


    /* =====================================================
       INICIAR
    ===================================================== */

    loadData();

});