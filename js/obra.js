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

    const artworkInterpretations =
        document.getElementById("artworkInterpretations");

    const artworkExhibitionNote =
        document.getElementById("artworkExhibitionNote");

    const artworkExhibitionLinks =
        document.getElementById("artworkExhibitionLinks");

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
            throw new Error("No se pudieron cargar los archivos JSON.");
        }

        obras = await responses[0].json();
        artistas = await responses[1].json();
        exposiciones = await responses[2].json();

        const artwork = obras.find(
            obra => obra.id === artworkCode
        );

        if (!artwork) {
            showError();
            return;
        }

        renderArtwork(artwork);

    } catch (err) {

        console.error("Error cargando la ficha de obra:", err);
        showError();

    }


    /* =====================================================
       MOSTRAR OBRA
    ===================================================== */

    function renderArtwork(artwork) {

        const artist = artistas.find(
            artista => artista.id === artwork.artista
        );

        const artistName = artist?.nombre || "Artista";

        document.title =
            `${artwork.titulo} | Colores en el viento`;

        artworkImage.src = artwork.imagen;
        artworkImage.alt = artwork.titulo;

        artworkId.textContent = artwork.id.toUpperCase();
        artworkTitle.textContent = artwork.titulo;
        artworkArtist.textContent = artistName;
        artworkArtist.href = `artista.html?id=${artwork.artista}`;

        artworkDescription.textContent =
            artwork.descripcion ||
            "Información de la obra próximamente.";

        technicalArtist.textContent = artistName;
        technicalTechnique.textContent = artwork.tecnica || "—";
        technicalSupport.textContent = artwork.soporte || "—";
        technicalDimensions.textContent = artwork.dimensiones || "—";
        technicalYear.textContent = artwork.anio || "—";
        technicalCode.textContent = artwork.id.toUpperCase();

        renderInterpretations(artwork);
        renderExhibitionNote(artwork);
        renderNavigation(artwork);

        loading.hidden = true;
        error.hidden = true;
        page.hidden = false;
    }


    /* =====================================================
       INTERPRETACIONES
    ===================================================== */

    function renderInterpretations(artwork) {

        artworkInterpretations.innerHTML = "";

        if (
            !Array.isArray(artwork.interpretaciones) ||
            artwork.interpretaciones.length === 0
        ) {
            const message = document.createElement("p");
            message.className = "artwork-no-interpretations";
            message.textContent =
                "Las interpretaciones de esta obra estarán disponibles próximamente.";
            artworkInterpretations.appendChild(message);
            return;
        }

        artwork.interpretaciones.forEach((interpretation, index) => {

            const card = document.createElement("article");
            card.className = "interpretation-card";
            card.dataset.type = interpretation.tipo || "ciencia";

            const button = document.createElement("button");
            button.type = "button";
            button.className = "interpretation-card__toggle";
            button.setAttribute("aria-expanded", "false");

            const number = document.createElement("span");
            number.className = "interpretation-card__number";
            number.textContent = String(index + 1).padStart(2, "0");

            const title = document.createElement("span");
            title.className = "interpretation-card__title";
            title.textContent = interpretation.titulo || `Interpretación ${index + 1}`;

            const icon = document.createElement("span");
            icon.className = "interpretation-card__icon";
            icon.setAttribute("aria-hidden", "true");
            icon.textContent = "+";

            const content = document.createElement("div");
            content.className = "interpretation-card__content";

            const contentInner = document.createElement("div");
            contentInner.className = "interpretation-card__content-inner";

            const text = document.createElement("p");
            text.textContent = interpretation.texto || "";

            contentInner.appendChild(text);
            content.appendChild(contentInner);

            button.appendChild(number);
            button.appendChild(title);
            button.appendChild(icon);

            card.appendChild(button);
            card.appendChild(content);

            button.addEventListener("click", () => {

                const wasOpen = card.classList.contains("is-open");

                artworkInterpretations
                    .querySelectorAll(".interpretation-card.is-open")
                    .forEach(openCard => {
                        openCard.classList.remove("is-open");
                        const openButton = openCard.querySelector(
                            ".interpretation-card__toggle"
                        );
                        if (openButton) {
                            openButton.setAttribute("aria-expanded", "false");
                        }
                    });

                if (!wasOpen) {
                    card.classList.add("is-open");
                    button.setAttribute("aria-expanded", "true");
                }

            });

            artworkInterpretations.appendChild(card);
        });
    }


    /* =====================================================
       EXPOSICIÓN — FRANJA PEQUEÑA
    ===================================================== */

    function renderExhibitionNote(artwork) {

        artworkExhibitionLinks.innerHTML = "";
        artworkExhibitionNote.hidden = true;

        if (
            !Array.isArray(artwork.exposiciones) ||
            artwork.exposiciones.length === 0
        ) {
            return;
        }

        const exhibitionData = artwork.exposiciones
            .map(id => exposiciones.find(expo => expo.id === id))
            .filter(Boolean);

        if (exhibitionData.length === 0) {
            return;
        }

        exhibitionData.forEach((exhibition, index) => {

            const link = document.createElement("a");
            link.href = `exposicion.html?id=${exhibition.id}`;
            link.className = "artwork-exhibition-note__link";

            const name = document.createElement("strong");
            name.textContent = exhibition.nombre;

            const meta = document.createElement("span");
            meta.textContent = [
                exhibition.lugar,
                exhibition.ciudad,
                exhibition.anio
            ].filter(Boolean).join(" · ");

            const arrow = document.createElement("span");
            arrow.className = "artwork-exhibition-note__arrow";
            arrow.setAttribute("aria-hidden", "true");
            arrow.textContent = "↗";

            link.appendChild(name);
            link.appendChild(meta);
            link.appendChild(arrow);

            artworkExhibitionLinks.appendChild(link);

            if (index < exhibitionData.length - 1) {
                const divider = document.createElement("span");
                divider.className = "artwork-exhibition-note__divider";
                artworkExhibitionLinks.appendChild(divider);
            }
        });

        artworkExhibitionNote.hidden = false;
    }


    /* =====================================================
       ANTERIOR / SIGUIENTE
    ===================================================== */

    function renderNavigation(artwork) {

        if (obras.length <= 1) {
            previousArtwork.style.visibility = "hidden";
            nextArtwork.style.visibility = "hidden";
            return;
        }

        const currentIndex = obras.findIndex(
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

        const previous = obras[previousIndex];
        const next = obras[nextIndex];

        previousArtwork.href = `obra.html?id=${previous.id}`;
        previousArtworkTitle.textContent = previous.titulo;

        nextArtwork.href = `obra.html?id=${next.id}`;
        nextArtworkTitle.textContent = next.titulo;
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
