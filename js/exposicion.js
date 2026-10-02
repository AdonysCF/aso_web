/* =========================================================
   COLORES EN EL VIENTO
   FICHA INDIVIDUAL DE EXPOSICIÓN
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    const loading =
        document.getElementById("exhibitionLoading");

    const error =
        document.getElementById("exhibitionError");

    const detail =
        document.getElementById("exhibitionDetail");


    const background =
        document.getElementById("exhibitionBackground");

    const status =
        document.getElementById("exhibitionStatus");

    const name =
        document.getElementById("exhibitionName");

    const date =
        document.getElementById("exhibitionDate");

    const place =
        document.getElementById("exhibitionPlace");

    const city =
        document.getElementById("exhibitionCity");

    const description =
        document.getElementById("exhibitionDescription");


    const artistsCount =
        document.getElementById("exhibitionArtistsCount");

    const artistsGrid =
        document.getElementById("exhibitionArtistsGrid");


    const worksCount =
        document.getElementById("exhibitionWorksCount");

    const worksGrid =
        document.getElementById("exhibitionWorksGrid");


    const gallerySection =
        document.getElementById("exhibitionGallerySection");

    const galleryGrid =
        document.getElementById("exhibitionGalleryGrid");

    const galleryPending =
        document.getElementById("exhibitionGalleryPending");


    const catalogButton =
        document.getElementById("viewExhibitionCatalog");


    /* =====================================================
       ID DESDE URL
    ===================================================== */

    const params =
        new URLSearchParams(
            window.location.search
        );

    const exhibitionId =
        params.get("id");


    if (!exhibitionId) {

        showError();

        return;

    }


    let exposiciones = [];
    let artistas = [];
    let obras = [];


    /* =====================================================
       CARGAR DATOS
    ===================================================== */

    try {

        const [
            exhibitionsResponse,
            artistsResponse,
            worksResponse
        ] = await Promise.all([

            fetch("data/exposiciones.json"),
            fetch("data/artistas.json"),
            fetch("data/obras.json")

        ]);


        if (
            !exhibitionsResponse.ok ||
            !artistsResponse.ok ||
            !worksResponse.ok
        ) {

            throw new Error(
                "No se pudieron cargar los datos."
            );

        }


        exposiciones =
            await exhibitionsResponse.json();

        artistas =
            await artistsResponse.json();

        obras =
            await worksResponse.json();


        const exhibition =
            exposiciones.find(
                item =>
                    item.id === exhibitionId ||
                    item.slug === exhibitionId
            );


        if (!exhibition) {

            showError();

            return;

        }


        renderExhibition(exhibition);

    }

    catch (err) {

        console.error(
            "Error cargando exposición:",
            err
        );


        showError();

    }


    /* =====================================================
       RENDER GENERAL
    ===================================================== */

    function renderExhibition(exhibition) {

        document.title =
            `${exhibition.nombre} | Colores en el viento`;


        name.textContent =
            exhibition.nombre;


        status.textContent =
            getStatusLabel(
                exhibition.estado
            );


        status.className =
            `exhibition-detail-status exhibition-detail-status--${exhibition.estado}`;


        date.textContent =
            formatDate(exhibition.fecha);


        place.textContent =
            exhibition.lugar ||
            "Por confirmar";


        city.textContent =
            exhibition.ciudad ||
            "Por confirmar";


        description.textContent =
            exhibition.descripcion?.trim()
                ? exhibition.descripcion
                : "Una muestra que reúne distintas miradas y expresiones artísticas de nuestra comunidad.";


        /* Portada */

        if (exhibition.portada) {

            background.style.backgroundImage =
                `url("${exhibition.portada}")`;

        }


        /* Catálogo filtrado */

        catalogButton.href =
            `obras.html?exposicion=${encodeURIComponent(exhibition.id)}`;


        renderArtists(exhibition);

        renderWorks(exhibition);

        renderGallery(exhibition);


        loading.hidden = true;
        error.hidden = true;
        detail.hidden = false;

    }


    /* =====================================================
       ARTISTAS
    ===================================================== */

    function renderArtists(exhibition) {

        const ids =
            Array.isArray(exhibition.artistas)
                ? exhibition.artistas
                : [];


        const participants =
            ids
                .map(id =>
                    artistas.find(
                        artist =>
                            artist.id === id
                    )
                )
                .filter(Boolean);


        artistsCount.textContent =
            String(participants.length)
                .padStart(2, "0");


        artistsGrid.innerHTML = "";


        participants.forEach(
            (artist, index) => {

                const article =
                    document.createElement("article");


                article.className =
                    "exhibition-artist-card";


                article.innerHTML = `

                    <a
                        href="artista.html?id=${artist.id}"
                        class="exhibition-artist-card__image"
                    >

                        <img
                            src="${artist.foto}"
                            alt="${artist.nombre}"
                            loading="lazy"
                        >

                        <span>
                            ${String(index + 1).padStart(2, "0")}
                        </span>

                    </a>


                    <div>

                        <span>
                            ${
                                artist.tipo === "colaborador"
                                    ? "Colaborador"
                                    : "Artista"
                            }
                        </span>

                        <h3>

                            <a
                                href="artista.html?id=${artist.id}"
                            >
                                ${artist.nombre}
                            </a>

                        </h3>

                    </div>

                `;


                const image =
                    article.querySelector("img");


                image.addEventListener(
                    "error",
                    () => {

                        image.style.display =
                            "none";

                        article
                            .querySelector(
                                ".exhibition-artist-card__image"
                            )
                            .classList.add(
                                "exhibition-artist-card__image--empty"
                            );

                    },
                    { once: true }
                );


                artistsGrid.appendChild(
                    article
                );

            }
        );

    }


    /* =====================================================
       OBRAS
    ===================================================== */

    function renderWorks(exhibition) {

        const ids =
            Array.isArray(exhibition.obras)
                ? exhibition.obras
                : [];


        const exhibitionWorks =
            ids
                .map(id =>
                    obras.find(
                        work =>
                            work.id === id
                    )
                )
                .filter(Boolean);


        worksCount.textContent =
            String(exhibitionWorks.length)
                .padStart(2, "0");


        worksGrid.innerHTML = "";


        exhibitionWorks.forEach(
            (work, index) => {

                const artist =
                    artistas.find(
                        item =>
                            item.id === work.artista
                    );


                const article =
                    document.createElement("article");


                article.className =
                    "exhibition-work-card";


                article.innerHTML = `

                    <a
                        href="obra.html?id=${work.id}"
                        class="exhibition-work-card__image"
                    >

                        <img
                            src="${work.imagen}"
                            alt="${work.titulo}"
                            loading="lazy"
                        >

                        <span class="exhibition-work-card__number">
                            ${String(index + 1).padStart(2, "0")}
                        </span>

                        <span class="exhibition-work-card__view">
                            Ver obra ↗
                        </span>

                    </a>


                    <div class="exhibition-work-card__info">

                        <div>

                            <h3>

                                <a
                                    href="obra.html?id=${work.id}"
                                >
                                    ${work.titulo}
                                </a>

                            </h3>


                            <span>
                                ${
                                    artist
                                        ? artist.nombre
                                        : "Artista"
                                }
                            </span>

                        </div>


                        <span>
                            ${work.anio || ""}
                        </span>

                    </div>

                `;


                worksGrid.appendChild(
                    article
                );

            }
        );

    }


    /* =====================================================
       GALERÍA
    ===================================================== */

    function renderGallery(exhibition) {

        const gallery =
            Array.isArray(exhibition.galeria)
                ? exhibition.galeria
                : [];


        galleryGrid.innerHTML = "";


        if (gallery.length === 0) {

            galleryGrid.hidden = true;

            galleryPending.hidden = false;

            return;

        }


        galleryGrid.hidden = false;

        galleryPending.hidden = true;


        gallery.forEach(
            (imagePath, index) => {

                const figure =
                    document.createElement("figure");


                figure.className =
                    "exhibition-gallery__item";


                figure.innerHTML = `

                    <img
                        src="${imagePath}"
                        alt="Galería de ${exhibition.nombre} — fotografía ${index + 1}"
                        loading="lazy"
                    >

                    <figcaption>
                        ${String(index + 1).padStart(2, "0")}
                    </figcaption>

                `;


                galleryGrid.appendChild(
                    figure
                );

            }
        );

    }


    /* =====================================================
       FECHA
    ===================================================== */

    function formatDate(dateString) {

        if (!dateString) {

            return "Por confirmar";

        }


        const parts =
            dateString.split("-");


        if (parts.length !== 3) {

            return dateString;

        }


        const parsed =
            new Date(
                Number(parts[0]),
                Number(parts[1]) - 1,
                Number(parts[2])
            );


        return new Intl.DateTimeFormat(
            "es-PE",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        ).format(parsed);

    }


    /* =====================================================
       ESTADO
    ===================================================== */

    function getStatusLabel(value) {

        const labels = {

            proxima:
                "Próxima exposición",

            actual:
                "En curso",

            realizada:
                "Exposición realizada"

        };


        return labels[value] || value;

    }


    /* =====================================================
       ERROR
    ===================================================== */

    function showError() {

        if (loading) {

            loading.hidden = true;

        }


        if (detail) {

            detail.hidden = true;

        }


        if (error) {

            error.hidden = false;

        }


        document.title =
            "Exposición no encontrada | Colores en el viento";

    }

});