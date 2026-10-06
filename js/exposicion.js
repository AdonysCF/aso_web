document.addEventListener("DOMContentLoaded", async () => {

    /* =====================================================
       ELEMENTOS GENERALES
    ===================================================== */

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


    /* PARTICIPANTES */

    const artistsCount =
        document.getElementById("exhibitionArtistsCount");

    const artistsGrid =
        document.getElementById("exhibitionArtistsGrid");


    /* INVITADOS */

    const guestsSection =
        document.getElementById("exhibitionGuestsSection");

    const guestsCount =
        document.getElementById("exhibitionGuestsCount");

    const guestsGrid =
        document.getElementById("exhibitionGuestsGrid");


    /* OBRAS */

    const worksCount =
        document.getElementById("exhibitionWorksCount");

    const worksGrid =
        document.getElementById("exhibitionWorksGrid");


    /* GALERÍA */

    const galleryGrid =
        document.getElementById("exhibitionGalleryGrid");

    const galleryPending =
        document.getElementById("exhibitionGalleryPending");


    /* CATÁLOGO */

    const catalogButton =
        document.getElementById("viewExhibitionCatalog");


    /* MODAL OBRA INVITADA */

    const guestWorkModal =
        document.getElementById("guestWorkModal");

    const guestWorkModalBackdrop =
        document.getElementById("guestWorkModalBackdrop");

    const guestWorkModalClose =
        document.getElementById("guestWorkModalClose");

    const guestWorkImage =
        document.getElementById("guestWorkImage");

    const guestWorkTitle =
        document.getElementById("guestWorkTitle");

    const guestWorkArtist =
        document.getElementById("guestWorkArtist");

    const guestWorkTechnique =
        document.getElementById("guestWorkTechnique");

    const guestWorkSupport =
        document.getElementById("guestWorkSupport");

    const guestWorkDimensions =
        document.getElementById("guestWorkDimensions");

    const guestWorkYear =
        document.getElementById("guestWorkYear");

    const guestWorkDescription =
        document.getElementById("guestWorkDescription");

    const guestWorkInterpretations =
        document.getElementById("guestWorkInterpretations");


    /* =====================================================
       ID EXPOSICIÓN
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


    /* =====================================================
       DATOS
    ===================================================== */

    let exposiciones = [];
    let artistas = [];
    let obras = [];
    let invitados = [];
    let obrasInvitadas = [];


    /* =====================================================
       CARGAR JSON
    ===================================================== */

    try {

        const [
            exhibitionsResponse,
            artistsResponse,
            worksResponse,
            guestsResponse,
            guestWorksResponse
        ] = await Promise.all([

            fetch("data/exposiciones.json"),

            fetch("data/artistas.json"),

            fetch("data/obras.json"),

            fetch("data/invitados.json"),

            fetch("data/obras-invitadas.json")

        ]);


        if (
            !exhibitionsResponse.ok ||
            !artistsResponse.ok ||
            !worksResponse.ok ||
            !guestsResponse.ok ||
            !guestWorksResponse.ok
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

        invitados =
            await guestsResponse.json();

        obrasInvitadas =
            await guestWorksResponse.json();


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


        renderExhibition(
            exhibition
        );

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

    function renderExhibition(
        exhibition
    ) {

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
            formatDate(
                exhibition.fecha
            );


        place.textContent =
            exhibition.lugar ||
            "Por confirmar";


        city.textContent =
            exhibition.ciudad ||
            "Por confirmar";


        description.textContent =
            exhibition.descripcion?.trim()
                ? exhibition.descripcion
                : "Información de la exposición próximamente.";


        if (exhibition.portada) {

            background.style.backgroundImage =
                `url("${exhibition.portada}")`;

        }


        /* Catálogo oficial */

        catalogButton.href =
            `obras.html?exposicion=${encodeURIComponent(exhibition.id)}`;


        renderParticipants(
            exhibition
        );


        renderGuests(
            exhibition
        );


        renderWorks(
            exhibition
        );


        renderGallery(
            exhibition
        );


        loading.hidden = true;

        error.hidden = true;

        detail.hidden = false;

    }


    /* =====================================================
       02 / PARTICIPANTES
    ===================================================== */

    function renderParticipants(
        exhibition
    ) {

        const ids =
            Array.isArray(
                exhibition.artistas
            )
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
            String(
                participants.length
            ).padStart(
                2,
                "0"
            );


        artistsGrid.innerHTML =
            "";


        participants.forEach(
            (artist, index) => {

                const article =
                    document.createElement(
                        "article"
                    );


                article.className =
                    "exhibition-artist-card";


                const typeLabel =
                    artist.tipo === "equipo"
                        ? "Equipo multidisciplinario"
                        : "Artista";


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
                            ${typeLabel}
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
                    article.querySelector(
                        "img"
                    );


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
                    {
                        once: true
                    }
                );


                artistsGrid.appendChild(
                    article
                );

            }
        );

    }


    /* =====================================================
       03 / INVITADOS
    ===================================================== */

    function renderGuests(
        exhibition
    ) {

        const ids =
            Array.isArray(
                exhibition.invitados
            )
                ? exhibition.invitados
                : [];


        const exhibitionGuests =
            ids
                .map(id =>

                    invitados.find(
                        guest =>
                            guest.id === id
                    )

                )
                .filter(Boolean);


        if (
            exhibitionGuests.length === 0
        ) {

            guestsSection.hidden =
                true;

            return;

        }


        guestsSection.hidden =
            false;


        guestsCount.textContent =
            String(
                exhibitionGuests.length
            ).padStart(
                2,
                "0"
            );


        guestsGrid.innerHTML =
            "";


        exhibitionGuests.forEach(
            (guest, index) => {

                const guestWorks =
                    obrasInvitadas.filter(
                        work =>

                            work.artista ===
                                guest.id &&

                            Array.isArray(
                                work.exposiciones
                            ) &&

                            work.exposiciones.includes(
                                exhibition.id
                            )
                    );


                const biography =
                    guest.biografia?.trim()
                        ? guest.biografia
                        : "Biografía próximamente.";


                const workLabel =
                    guestWorks.length === 1
                        ? "1 obra"
                        : `${guestWorks.length} obras`;


                const article =
                    document.createElement(
                        "article"
                    );


                article.className =
                    "exhibition-guest-card";


                article.innerHTML = `

                    <button
                        type="button"
                        class="exhibition-guest-card__image"
                        aria-expanded="false"
                        aria-controls="guestBio-${guest.id}"
                    >

                        <img
                            src="${guest.foto}"
                            alt="${guest.nombre}"
                            loading="lazy"
                        >

                        <span class="exhibition-guest-card__number">
                            ${String(index + 1).padStart(2, "0")}
                        </span>

                        <span class="exhibition-guest-card__action">
                            Ver perfil +
                        </span>

                    </button>


                    <div class="exhibition-guest-card__heading">

                        <div>

                            <span>
                                Artista invitada
                            </span>

                            <h3>
                                ${guest.nombre}
                            </h3>

                        </div>

                        <span>
                            ${workLabel}
                        </span>

                    </div>


                    <div
                        class="exhibition-guest-card__bio"
                        id="guestBio-${guest.id}"
                        hidden
                    >

                        <p>
                            ${biography}
                        </p>

                    </div>

                `;


                const imageButton =
                    article.querySelector(
                        ".exhibition-guest-card__image"
                    );


                const bio =
                    article.querySelector(
                        ".exhibition-guest-card__bio"
                    );


                const action =
                    article.querySelector(
                        ".exhibition-guest-card__action"
                    );


                const image =
                    article.querySelector(
                        "img"
                    );


                imageButton.addEventListener(
                    "click",
                    () => {

                        const isOpen =
                            imageButton.getAttribute(
                                "aria-expanded"
                            ) === "true";


                        imageButton.setAttribute(
                            "aria-expanded",
                            String(!isOpen)
                        );


                        bio.hidden =
                            isOpen;


                        article.classList.toggle(
                            "is-open",
                            !isOpen
                        );


                        action.textContent =
                            !isOpen
                                ? "Cerrar −"
                                : "Ver perfil +";

                    }
                );


                image.addEventListener(
                    "error",
                    () => {

                        image.style.display =
                            "none";


                        imageButton.classList.add(
                            "exhibition-guest-card__image--empty"
                        );

                    },
                    {
                        once: true
                    }
                );


                guestsGrid.appendChild(
                    article
                );

            }
        );

    }


    /* =====================================================
       04 / OBRAS EXPUESTAS
    ===================================================== */

    function renderWorks(
        exhibition
    ) {

        const officialIds =
            Array.isArray(
                exhibition.obras
            )
                ? exhibition.obras
                : [];


        const invitedIds =
            Array.isArray(
                exhibition.obras_invitadas
            )
                ? exhibition.obras_invitadas
                : [];


        const officialWorks =
            officialIds
                .map(id =>

                    obras.find(
                        work =>
                            work.id === id
                    )

                )
                .filter(Boolean);


        const invitedWorks =
            invitedIds
                .map(id =>

                    obrasInvitadas.find(
                        work =>
                            work.id === id
                    )

                )
                .filter(Boolean);


        const totalWorks =
            officialWorks.length +
            invitedWorks.length;


        worksCount.textContent =
            String(
                totalWorks
            ).padStart(
                2,
                "0"
            );


        worksGrid.innerHTML =
            "";


        /* =================================================
           OBRAS DE LA ASOCIACIÓN
        ================================================= */

        officialWorks.forEach(
            (work, index) => {

                const artist =
                    artistas.find(
                        item =>
                            item.id === work.artista
                    );


                const article =
                    document.createElement(
                        "article"
                    );


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


        /* =================================================
           OBRAS INVITADAS
        ================================================= */

        invitedWorks.forEach(
            (work, invitedIndex) => {

                const guest =
                    invitados.find(
                        item =>
                            item.id === work.artista
                    );


                const displayIndex =
                    officialWorks.length +
                    invitedIndex +
                    1;


                const article =
                    document.createElement(
                        "article"
                    );


                article.className =
                    "exhibition-work-card exhibition-work-card--guest";


                article.innerHTML = `

                    <button
                        type="button"
                        class="exhibition-work-card__image exhibition-work-card__image--button"
                        data-guest-work="${work.id}"
                        aria-label="Ver ficha de ${work.titulo}"
                    >

                        <img
                            src="${work.imagen}"
                            alt="${work.titulo}"
                            loading="lazy"
                        >

                        <span class="exhibition-work-card__number">
                            ${String(displayIndex).padStart(2, "0")}
                        </span>

                        <span class="exhibition-work-card__guest-badge">
                            Obra invitada
                        </span>

                        <span class="exhibition-work-card__view">
                            Ver ficha ↗
                        </span>

                    </button>


                    <div class="exhibition-work-card__info">

                        <div>

                            <h3>

                                <button
                                    type="button"
                                    class="exhibition-work-card__title-button"
                                    data-guest-work="${work.id}"
                                >
                                    ${work.titulo}
                                </button>

                            </h3>

                            <span>
                                ${
                                    guest
                                        ? guest.nombre
                                        : "Artista invitada"
                                }
                            </span>

                        </div>

                        <span>
                            ${work.anio || ""}
                        </span>

                    </div>

                `;


                article
                    .querySelectorAll(
                        "[data-guest-work]"
                    )
                    .forEach(
                        button => {

                            button.addEventListener(
                                "click",
                                () => {

                                    openGuestWork(
                                        button.dataset.guestWork
                                    );

                                }
                            );

                        }
                    );


                worksGrid.appendChild(
                    article
                );

            }
        );

    }


    /* =====================================================
       MODAL OBRA INVITADA
    ===================================================== */

    function openGuestWork(
        workId
    ) {

        const work =
            obrasInvitadas.find(
                item =>
                    item.id === workId
            );


        if (!work) {
            return;
        }


        const guest =
            invitados.find(
                item =>
                    item.id === work.artista
            );


        guestWorkTitle.textContent =
            work.titulo ||
            "Obra invitada";


        guestWorkArtist.textContent =
            guest?.nombre ||
            "Artista invitada";


        guestWorkImage.src =
            work.imagen || "";


        guestWorkImage.alt =
            work.titulo ||
            "Obra invitada";


        guestWorkTechnique.textContent =
            work.tecnica || "—";


        guestWorkSupport.textContent =
            work.soporte || "—";


        guestWorkDimensions.textContent =
            work.dimensiones || "—";


        guestWorkYear.textContent =
            work.anio || "—";


        guestWorkDescription.textContent =
            work.descripcion ||
            "Descripción próximamente.";


        renderGuestInterpretations(
            work.interpretaciones
        );


        guestWorkModal.hidden =
            false;


        guestWorkModal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "guest-work-modal-open"
        );


        requestAnimationFrame(
            () => {

                guestWorkModal.classList.add(
                    "is-open"
                );


                guestWorkModalClose.focus();

            }
        );

    }


    function closeGuestWork() {

        if (
            guestWorkModal.hidden
        ) {

            return;

        }


        guestWorkModal.classList.remove(
            "is-open"
        );


        guestWorkModal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "guest-work-modal-open"
        );


        window.setTimeout(
            () => {

                guestWorkModal.hidden =
                    true;

            },
            250
        );

    }


    guestWorkModalClose.addEventListener(
        "click",
        closeGuestWork
    );


    guestWorkModalBackdrop.addEventListener(
        "click",
        closeGuestWork
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                !guestWorkModal.hidden
            ) {

                closeGuestWork();

            }

        }
    );


    /* =====================================================
       INTERPRETACIONES OBRA INVITADA
    ===================================================== */

    function renderGuestInterpretations(
        interpretations
    ) {

        guestWorkInterpretations.innerHTML =
            "";


        if (
            !Array.isArray(
                interpretations
            ) ||
            interpretations.length === 0
        ) {

            guestWorkInterpretations.innerHTML = `

                <p class="artwork-no-interpretations">
                    Interpretaciones próximamente.
                </p>

            `;

            return;

        }


        interpretations.forEach(
            (interpretation, index) => {

                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "interpretation-card";


                card.dataset.type =
                    interpretation.tipo ||
                    "ciencia";


                const panelId =
                    `guestInterpretation-${index}`;


                card.innerHTML = `

                    <button
                        type="button"
                        class="interpretation-card__toggle"
                        aria-expanded="false"
                        aria-controls="${panelId}"
                    >

                        <span class="interpretation-card__number">
                            ${String(index + 1).padStart(2, "0")}
                        </span>

                        <span class="interpretation-card__title">
                            ${interpretation.titulo}
                        </span>

                        <span
                            class="interpretation-card__icon"
                            aria-hidden="true"
                        >
                            +
                        </span>

                    </button>


                    <div
                        class="interpretation-card__content"
                        id="${panelId}"
                    >

                        <div class="interpretation-card__content-inner">

                            <p>
                                ${interpretation.texto}
                            </p>

                        </div>

                    </div>

                `;


                const toggle =
                    card.querySelector(
                        ".interpretation-card__toggle"
                    );


                toggle.addEventListener(
                    "click",
                    () => {

                        const currentlyOpen =
                            card.classList.contains(
                                "is-open"
                            );


                        guestWorkInterpretations
                            .querySelectorAll(
                                ".interpretation-card.is-open"
                            )
                            .forEach(
                                openCard => {

                                    openCard.classList.remove(
                                        "is-open"
                                    );


                                    openCard
                                        .querySelector(
                                            ".interpretation-card__toggle"
                                        )
                                        .setAttribute(
                                            "aria-expanded",
                                            "false"
                                        );

                                }
                            );


                        if (!currentlyOpen) {

                            card.classList.add(
                                "is-open"
                            );


                            toggle.setAttribute(
                                "aria-expanded",
                                "true"
                            );

                        }

                    }
                );


                guestWorkInterpretations.appendChild(
                    card
                );

            }
        );

    }


    /* =====================================================
       05 / MEMORIA VISUAL
    ===================================================== */

    function renderGallery(
        exhibition
    ) {

        const gallery =
            Array.isArray(
                exhibition.galeria
            )
                ? exhibition.galeria
                : [];


        galleryGrid.innerHTML =
            "";


        if (
            gallery.length === 0
        ) {

            galleryGrid.hidden =
                true;


            galleryPending.hidden =
                false;


            return;

        }


        galleryGrid.hidden =
            false;


        galleryPending.hidden =
            true;


        gallery.forEach(
            (imagePath, index) => {

                const figure =
                    document.createElement(
                        "figure"
                    );


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

    function formatDate(
        dateString
    ) {

        if (!dateString) {

            return "Por confirmar";

        }


        const parts =
            dateString.split("-");


        if (
            parts.length !== 3
        ) {

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
        ).format(
            parsed
        );

    }


    /* =====================================================
       ESTADO
    ===================================================== */

    function getStatusLabel(
        value
    ) {

        const labels = {

            proxima:
                "Próxima exposición",

            actual:
                "En curso",

            realizada:
                "Exposición realizada"

        };


        return (
            labels[value] ||
            value
        );

    }


    /* =====================================================
       ERROR
    ===================================================== */

    function showError() {

        if (loading) {

            loading.hidden =
                true;

        }


        if (detail) {

            detail.hidden =
                true;

        }


        if (error) {

            error.hidden =
                false;

        }


        document.title =
            "Exposición no encontrada | Colores en el viento";

    }

});