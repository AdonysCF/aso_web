/* =========================================================
   COLORES EN EL VIENTO
   ARCHIVO DE EXPOSICIONES
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    const grid =
        document.getElementById("exhibitionsGrid");

    const empty =
        document.getElementById("exhibitionsEmpty");

    const count =
        document.getElementById("exhibitionCount");

    const countLabel =
        document.getElementById("exhibitionCountLabel");

    const tabs =
        document.querySelectorAll(".exhibitions-tab");


    let exposiciones = [];
    let currentFilter = "todas";


    /* =====================================================
       CARGAR EXPOSICIONES
    ===================================================== */

    async function loadExhibitions() {

        try {

            const response =
                await fetch("data/exposiciones.json");


            if (!response.ok) {

                throw new Error(
                    "No se pudo cargar exposiciones.json"
                );

            }


            exposiciones =
                await response.json();


            sortExhibitions();

            applyFilter();

        }

        catch (error) {

            console.error(
                "Error cargando exposiciones:",
                error
            );


            grid.innerHTML = `

                <div class="exhibitions-load-error">

                    <h2>
                        No se pudieron cargar
                        las exposiciones.
                    </h2>

                    <p>
                        Comprueba el archivo
                        data/exposiciones.json.
                    </p>

                </div>

            `;

        }

    }


    /* =====================================================
       ORDENAR POR FECHA
    ===================================================== */

    function sortExhibitions() {

        exposiciones.sort(
            (a, b) =>
                new Date(b.fecha) -
                new Date(a.fecha)
        );

    }


    /* =====================================================
       FILTRAR
    ===================================================== */

    function applyFilter() {

        const filtered =
            currentFilter === "todas"

                ? exposiciones

                : exposiciones.filter(
                    exhibition =>
                        exhibition.estado ===
                        currentFilter
                );


        renderExhibitions(filtered);

    }


    /* =====================================================
       MOSTRAR EXPOSICIONES
    ===================================================== */

    function renderExhibitions(items) {

        grid.innerHTML = "";


        count.textContent =
            items.length;


        countLabel.textContent =
            items.length === 1
                ? "exposición"
                : "exposiciones";


        if (items.length === 0) {

            grid.hidden = true;
            empty.hidden = false;

            return;

        }


        grid.hidden = false;
        empty.hidden = true;


        items.forEach((exhibition, index) => {

            const article =
                document.createElement("article");


            article.className =
                "exhibition-card";


            const date =
                formatDate(exhibition.fecha);


            const status =
                getStatusLabel(
                    exhibition.estado
                );


            const works =
                Array.isArray(exhibition.obras)
                    ? exhibition.obras.length
                    : 0;


            const artists =
                Array.isArray(exhibition.artistas)
                    ? exhibition.artistas.length
                    : 0;


            article.innerHTML = `

                <a
                    href="exposicion.html?id=${exhibition.id}"
                    class="exhibition-card__image"
                    aria-label="Ver ${exhibition.nombre}"
                >

                    <img
                        src="${exhibition.portada}"
                        alt="${exhibition.nombre}"
                        loading="lazy"
                    >


                    <span
                        class="
                            exhibition-card__status
                            exhibition-card__status--${exhibition.estado}
                        "
                    >
                        ${status}
                    </span>


                    <span class="exhibition-card__number">
                        ${String(index + 1).padStart(2, "0")}
                    </span>


                    <span class="exhibition-card__view">
                        Ver exposición ↗
                    </span>

                </a>


                <div class="exhibition-card__content">

                    <div class="exhibition-card__meta">

                        <span>
                            ${date}
                        </span>

                        <span>
                            ${exhibition.ciudad || ""}
                        </span>

                    </div>


                    <h2>

                        <a
                            href="exposicion.html?id=${exhibition.id}"
                        >
                            ${exhibition.nombre}
                        </a>

                    </h2>


                    <div class="exhibition-card__footer">

                        <span>
                            ${exhibition.lugar || ""}
                        </span>

                        <span>
                            ${works}
                            ${works === 1 ? "obra" : "obras"}
                            ·
                            ${artists}
                            ${artists === 1 ? "artista" : "artistas"}
                        </span>

                    </div>

                </div>

            `;


            const image =
                article.querySelector("img");


            image.addEventListener(
                "error",
                () => {

                    image.style.display = "none";

                    article
                        .querySelector(
                            ".exhibition-card__image"
                        )
                        .classList.add(
                            "exhibition-card__image--empty"
                        );

                },
                { once: true }
            );


            grid.appendChild(article);

        });

    }


    /* =====================================================
       FECHA
    ===================================================== */

    function formatDate(dateString) {

        if (!dateString) {

            return "Fecha por confirmar";

        }


        const parts =
            dateString.split("-");


        if (parts.length !== 3) {

            return dateString;

        }


        const date =
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
        ).format(date);

    }


    /* =====================================================
       ESTADO
    ===================================================== */

    function getStatusLabel(status) {

        const labels = {

            proxima:
                "Próxima",

            realizada:
                "Realizada",

            actual:
                "En curso"

        };


        return labels[status] || status;

    }


    /* =====================================================
       FILTROS
    ===================================================== */

    tabs.forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                tabs.forEach(item =>

                    item.classList.remove(
                        "active"
                    )

                );


                tab.classList.add("active");


                currentFilter =
                    tab.dataset.filter;


                applyFilter();

            }
        );

    });


    /* =====================================================
       INICIAR
    ===================================================== */

    loadExhibitions();

});