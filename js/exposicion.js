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


    /* =====================================================
       PARTICIPANTES
    ===================================================== */

    const artistsCount =
        document.getElementById("exhibitionArtistsCount");

    const artistsGrid =
        document.getElementById("exhibitionArtistsGrid");


    /* =====================================================
       INVITADOS
    ===================================================== */

    const guestsSection =
        document.getElementById("exhibitionGuestsSection");

    const guestsCount =
        document.getElementById("exhibitionGuestsCount");

    const guestsGrid =
        document.getElementById("exhibitionGuestsGrid");


    /* =====================================================
       OBRAS
    ===================================================== */

    const worksCount =
        document.getElementById("exhibitionWorksCount");

    const worksGrid =
        document.getElementById("exhibitionWorksGrid");


    /* =====================================================
       GALERÍA
    ===================================================== */

    const galleryGrid =
        document.getElementById("exhibitionGalleryGrid");

    const galleryPending =
        document.getElementById("exhibitionGalleryPending");


    /* =====================================================
       CATÁLOGO
    ===================================================== */

    const catalogButton =
        document.getElementById("viewExhibitionCatalog");


    /* =====================================================
       MODAL DE OBRA
    ===================================================== */

    const workModal =
        document.getElementById("guestWorkModal");

    const workModalBackdrop =
        document.getElementById("guestWorkModalBackdrop");

    const workModalClose =
        document.getElementById("guestWorkModalClose");

    const workImage =
        document.getElementById("guestWorkImage");

    const workTitle =
        document.getElementById("guestWorkTitle");

    const workArtist =
        document.getElementById("guestWorkArtist");

    const workTechnique =
        document.getElementById("guestWorkTechnique");

    const workSupport =
        document.getElementById("guestWorkSupport");

    const workDimensions =
        document.getElementById("guestWorkDimensions");

    const workYear =
        document.getElementById("guestWorkYear");

    const workDescription =
        document.getElementById("guestWorkDescription");

    const workInterpretations =
        document.getElementById("guestWorkInterpretations");


    /*
       Reutilizamos el modal que originalmente
       se creó para las obras invitadas.
    */


    const workModalEyebrow =
        workModal.querySelector(
            ".guest-work-modal__content > .eyebrow"
        );


    /* =====================================================
       PARÁMETROS DE LA URL
    ===================================================== */

    const initialParams =
        new URLSearchParams(
            window.location.search
        );


    const exhibitionId =
        initialParams.get("id");


    const initialArtworkId =
        initialParams.get("obra");


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

    let currentExhibition = null;


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


        currentExhibition =
            exposiciones.find(
                item =>
                    item.id === exhibitionId ||
                    item.slug === exhibitionId
            );


        if (!currentExhibition) {

            showError();

            return;

        }


        renderExhibition(
            currentExhibition
        );


        /*
           Si la URL viene de un QR:

           exposicion.html?id=expo-001&obra=cev-000

           abre directamente la obra.
        */

        if (initialArtworkId) {

            requestAnimationFrame(
                () => {

                    openExhibitionWork(
                        currentExhibition,
                        initialArtworkId,
                        false
                    );

                }
            );

        }

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


        /*
           Este botón continúa mostrando
           solamente las obras oficiales
           del catálogo.
        */

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


        loading.hidden =
            true;


        error.hidden =
            true;


        detail.hidden =
            false;

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
                .map(
                    id =>

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
            .map(
                id =>

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

                <div
                    class="exhibition-guest-card__image"
                >

                    <img
                        src="${guest.foto}"
                        alt="${guest.nombre}"
                        loading="lazy"
                    >

                    <span class="exhibition-guest-card__number">

                        ${String(index + 1).padStart(2, "0")}

                    </span>

                </div>


                <div class="exhibition-guest-card__heading">

                    <div>

                        <span>
                            Artista invitado/a
                        </span>

                        <h3>
                            ${guest.nombre}
                        </h3>

                    </div>


                    <span>
                        ${workLabel}
                    </span>

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
                            ".exhibition-guest-card__image"
                        )
                        .classList.add(
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
                .map(
                    id =>

                        obras.find(
                            work =>
                                work.id === id
                        )
                )
                .filter(Boolean);


        const invitedWorks =
            invitedIds
                .map(
                    id =>

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


                const artworkUrl =
                    buildArtworkUrl(
                        exhibition.id,
                        work.id
                    );


                const article =
                    document.createElement(
                        "article"
                    );


                article.className =
                    "exhibition-work-card";


                article.innerHTML = `

                    <a
                        href="${artworkUrl}"
                        class="exhibition-work-card__image"
                        data-exhibition-work="${work.id}"
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
                                    href="${artworkUrl}"
                                    data-exhibition-work="${work.id}"
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


                addArtworkLinkEvents(
                    article,
                    exhibition
                );


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


                const artworkUrl =
                    buildArtworkUrl(
                        exhibition.id,
                        work.id
                    );


                const article =
                    document.createElement(
                        "article"
                    );


                article.className =
                    "exhibition-work-card exhibition-work-card--guest";


                article.innerHTML = `

                    <a
                        href="${artworkUrl}"
                        class="exhibition-work-card__image exhibition-work-card__image--button"
                        data-exhibition-work="${work.id}"
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


                        <span class="exhibition-work-card__view">
                            Ver ficha ↗
                        </span>

                    </a>


                    <div class="exhibition-work-card__info">

                        <div>

                            <h3>

                                <a
                                    href="${artworkUrl}"
                                    class="exhibition-work-card__title-button"
                                    data-exhibition-work="${work.id}"
                                >
                                    ${work.titulo}
                                </a>

                            </h3>


                            <span>
                                ${
                                    guest
                                        ? guest.nombre
                                        : "Artista invitada/o"
                                }
                            </span>

                        </div>


                        <span>
                            ${work.anio || ""}
                        </span>

                    </div>

                `;


                addArtworkLinkEvents(
                    article,
                    exhibition
                );


                worksGrid.appendChild(
                    article
                );

            }
        );

    }


    /* =====================================================
       EVENTOS DE LAS OBRAS
    ===================================================== */

    function addArtworkLinkEvents(
        article,
        exhibition
    ) {

        article
            .querySelectorAll(
                "[data-exhibition-work]"
            )
            .forEach(
                link => {

                    link.addEventListener(
                        "click",
                        event => {

                            event.preventDefault();


                            const workId =
                                link.dataset.exhibitionWork;


                            const newUrl =
                                buildArtworkUrl(
                                    exhibition.id,
                                    workId
                                );


                            window.history.pushState(
                                {},
                                "",
                                newUrl
                            );


                            openExhibitionWork(
                                exhibition,
                                workId,
                                false
                            );

                        }
                    );

                }
            );

    }


    /* =====================================================
       CONSTRUIR URL DE QR / EXPOSICIÓN
    ===================================================== */

    function buildArtworkUrl(
        exhibitionId,
        workId
    ) {

        return (
            `exposicion.html?id=${encodeURIComponent(exhibitionId)}` +
            `&obra=${encodeURIComponent(workId)}`
        );

    }


    /* =====================================================
       ABRIR OBRA DE LA EXPOSICIÓN
    ===================================================== */

    function openExhibitionWork(
        exhibition,
        workId,
        updateUrl = true
    ) {

        /*
           Primero verificamos si la obra pertenece
           realmente a esta exposición.
        */

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


        const isOfficial =
            officialIds.includes(
                workId
            );


        const isInvited =
            invitedIds.includes(
                workId
            );


        /*
           Si alguien intenta escribir manualmente una
           obra que no pertenece a esta exposición,
           no se abre.
        */

        if (
            !isOfficial &&
            !isInvited
        ) {

            console.warn(
                "La obra solicitada no pertenece a esta exposición:",
                workId
            );

            return;

        }


        let work = null;

        let author = null;


        /* =================================================
           OBRA OFICIAL
        ================================================= */

            if (isOfficial) {

        work =
            obras.find(
                item =>
                    item.id === workId
            );


        if (!work) {

            return;

        }


        author =
            artistas.find(
                item =>
                    item.id === work.artista
            );


        workModalEyebrow.hidden =
            true;

    }


        /* =================================================
           OBRA INVITADA
        ================================================= */

        if (isInvited) {

            work =
                obrasInvitadas.find(
                    item =>
                        item.id === workId
                );


            if (!work) {

                return;

            }


            author =
                invitados.find(
                    item =>
                        item.id === work.artista
                );


            workModalEyebrow.hidden =
                false;


            workModalEyebrow.textContent =
                "Artista invitado/a";

        }


        /* =================================================
           ACTUALIZAR URL
        ================================================= */

        if (updateUrl) {

            const newUrl =
                buildArtworkUrl(
                    exhibition.id,
                    work.id
                );


            window.history.pushState(
                {},
                "",
                newUrl
            );

        }


        /* =================================================
           INFORMACIÓN DE LA OBRA
        ================================================= */

        workTitle.textContent =
            work.titulo ||
            "Obra";


        workArtist.textContent =
            author?.nombre ||
            "Artista";


        workImage.src =
            work.imagen ||
            "";


        workImage.alt =
            work.titulo ||
            "Obra";


        workTechnique.textContent =
            work.tecnica ||
            "—";


        workSupport.textContent =
            work.soporte ||
            "—";


        workDimensions.textContent =
            work.dimensiones ||
            "—";


        workYear.textContent =
            work.anio ||
            "—";


        workDescription.textContent =
            work.descripcion ||
            "Descripción próximamente.";


        renderWorkInterpretations(
            work.interpretaciones
        );


        /* =================================================
           ABRIR MODAL
        ================================================= */

        workModal.hidden =
            false;


        workModal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "guest-work-modal-open"
        );


        requestAnimationFrame(
            () => {

                workModal.classList.add(
                    "is-open"
                );


                workModalClose.focus();

            }
        );

    }


    /* =====================================================
       CERRAR OBRA
    ===================================================== */

    function closeWorkModal(
        updateUrl = true
    ) {

        if (
            workModal.hidden
        ) {

            return;

        }


        workModal.classList.remove(
            "is-open"
        );


        workModal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "guest-work-modal-open"
        );


        /*
           Al cerrar eliminamos solamente &obra=...
           y dejamos la exposición abierta.
        */

        if (
            updateUrl &&
            currentExhibition
        ) {

            const cleanUrl =
                `exposicion.html?id=${encodeURIComponent(currentExhibition.id)}`;


            window.history.pushState(
                {},
                "",
                cleanUrl
            );

        }


        window.setTimeout(
            () => {

                workModal.hidden =
                    true;

            },
            250
        );

    }


    workModalClose.addEventListener(
        "click",
        () => {

            closeWorkModal(
                true
            );

        }
    );


    workModalBackdrop.addEventListener(
        "click",
        () => {

            closeWorkModal(
                true
            );

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                !workModal.hidden
            ) {

                closeWorkModal(
                    true
                );

            }

        }
    );


    /* =====================================================
       BOTONES ATRÁS / ADELANTE DEL NAVEGADOR
    ===================================================== */

    window.addEventListener(
        "popstate",
        () => {

            if (!currentExhibition) {

                return;

            }


            const params =
                new URLSearchParams(
                    window.location.search
                );


            const artworkId =
                params.get("obra");


            if (artworkId) {

                openExhibitionWork(
                    currentExhibition,
                    artworkId,
                    false
                );

            }

            else {

                closeWorkModal(
                    false
                );

            }

        }
    );


    /* =====================================================
       INTERPRETACIONES
    ===================================================== */

    function renderWorkInterpretations(
        interpretations
    ) {

        workInterpretations.innerHTML =
            "";


        if (
            !Array.isArray(
                interpretations
            ) ||
            interpretations.length === 0
        ) {

            workInterpretations.innerHTML = `

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
                    `exhibitionInterpretation-${index}`;


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


                        /*
                           Cerramos cualquier otra interpretación
                           que esté abierta.
                        */

                        workInterpretations
                            .querySelectorAll(
                                ".interpretation-card.is-open"
                            )
                            .forEach(
                                openCard => {

                                    openCard.classList.remove(
                                        "is-open"
                                    );


                                    const openButton =
                                        openCard.querySelector(
                                            ".interpretation-card__toggle"
                                        );


                                    if (openButton) {

                                        openButton.setAttribute(
                                            "aria-expanded",
                                            "false"
                                        );

                                    }

                                }
                            );


                        /*
                           Abrimos la seleccionada.
                        */

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


                workInterpretations.appendChild(
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