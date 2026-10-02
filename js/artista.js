/* =========================================================
   COLORES EN EL VIENTO
   PERFIL INDIVIDUAL DE ARTISTA
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    const loading =
        document.getElementById("artistLoading");

    const error =
        document.getElementById("artistError");

    const profile =
        document.getElementById("artistProfile");


    const photo =
        document.getElementById("artistPhoto");

    const photoFallback =
        document.getElementById("artistPhotoFallback");

    const initials =
        document.getElementById("artistInitials");

    const code =
        document.getElementById("artistCode");

    const type =
        document.getElementById("artistType");

    const name =
        document.getElementById("artistName");

    const bio =
        document.getElementById("artistBio");

    const social =
        document.getElementById("artistSocial");


    const worksCount =
        document.getElementById("artistWorksCount");

    const worksLabel =
        document.getElementById("artistWorksLabel");

    const worksGrid =
        document.getElementById("artistWorksGrid");

    const worksEmpty =
        document.getElementById("artistWorksEmpty");


    /* =====================================================
       ID DESDE URL
    ===================================================== */

    const params =
        new URLSearchParams(
            window.location.search
        );

    const artistId =
        params.get("id");


    if (!artistId) {

        showError();

        return;

    }


    let artistas = [];
    let obras = [];


    /* =====================================================
       CARGAR DATOS
    ===================================================== */

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


        const artist =
            artistas.find(
                item =>
                    item.id === artistId
            );


        if (!artist) {

            showError();

            return;

        }


        renderArtist(artist);

    }

    catch (err) {

        console.error(
            "Error cargando perfil:",
            err
        );

        showError();

    }


    /* =====================================================
       MOSTRAR ARTISTA
    ===================================================== */

    function renderArtist(artist) {

        const artistWorks =
            obras.filter(
                obra =>
                    obra.artista === artist.id
            );


        document.title =
            `${artist.nombre} | Colores en el viento`;


        /* Código */

        code.textContent =
            artist.id.toUpperCase();


        /* Tipo */

        type.textContent =
            artist.tipo === "colaborador"
                ? "Colaborador"
                : "Artista";


        /* Nombre */

        name.textContent =
            artist.nombre;


        /* Biografía */

        bio.textContent =
            artist.biografia?.trim()
                ? artist.biografia
                : "Biografía próximamente.";


        /* Iniciales */

        initials.textContent =
            getInitials(artist.nombre);


        /* Fotografía */

        if (artist.foto) {

            photo.src =
                artist.foto;

            photo.alt =
                artist.nombre;


            photo.addEventListener(
                "error",
                showPhotoFallback,
                { once: true }
            );

        }

        else {

            showPhotoFallback();

        }


        /* Redes */

        renderSocialNetworks(artist);


        /* Obras */

        renderWorks(artistWorks);


        /* Mostrar */

        loading.hidden = true;
        error.hidden = true;
        profile.hidden = false;

    }


    /* =====================================================
       FOTO ALTERNATIVA
    ===================================================== */

    function showPhotoFallback() {

        photo.hidden = true;

        photoFallback.hidden = false;

    }


    /* =====================================================
       INICIALES
    ===================================================== */

    function getInitials(fullName = "") {

        const words =
            fullName
                .trim()
                .split(/\s+/)
                .filter(Boolean);


        if (words.length === 0) {

            return "CE";

        }


        if (words.length === 1) {

            return words[0]
                .substring(0, 2)
                .toUpperCase();

        }


        return (
            words[0][0] +
            words[words.length - 1][0]
        ).toUpperCase();

    }


    /* =====================================================
       REDES
    ===================================================== */

    function renderSocialNetworks(artist) {

        social.innerHTML = "";


        const networks = [];


        if (artist.instagram?.trim()) {

            networks.push({
                label: "Instagram ↗",
                url: artist.instagram
            });

        }


        if (artist.facebook?.trim()) {

            networks.push({
                label: "Facebook ↗",
                url: artist.facebook
            });

        }


        if (networks.length === 0) {

            social.hidden = true;

            return;

        }


        social.hidden = false;


        networks.forEach(network => {

            const link =
                document.createElement("a");


            link.href =
                network.url;

            link.target =
                "_blank";

            link.rel =
                "noopener noreferrer";

            link.textContent =
                network.label;


            social.appendChild(link);

        });

    }


    /* =====================================================
       OBRAS DEL ARTISTA
    ===================================================== */

    function renderWorks(artistWorks) {

        worksGrid.innerHTML = "";


        worksCount.textContent =
            artistWorks.length;


        worksLabel.textContent =
            artistWorks.length === 1
                ? "obra"
                : "obras";


        if (artistWorks.length === 0) {

            worksGrid.hidden = true;

            worksEmpty.hidden = false;

            return;

        }


        worksGrid.hidden = false;

        worksEmpty.hidden = true;


        artistWorks.forEach(
            (work, index) => {

                const article =
                    document.createElement("article");


                article.className =
                    "artist-work-card";


                article.innerHTML = `

                    <a
                        href="obra.html?id=${work.id}"
                        class="artist-work-card__image"
                    >

                        <img
                            src="${work.imagen}"
                            alt="${work.titulo}"
                            loading="lazy"
                        >

                        <span class="artist-work-card__number">
                            ${String(index + 1).padStart(2, "0")}
                        </span>

                        <span class="artist-work-card__view">
                            Ver obra ↗
                        </span>

                    </a>


                    <div class="artist-work-card__info">

                        <div>

                            <h3>
                                <a href="obra.html?id=${work.id}">
                                    ${work.titulo}
                                </a>
                            </h3>

                            <span>
                                ${work.tecnica || ""}
                            </span>

                        </div>


                        <span>
                            ${work.anio || ""}
                        </span>

                    </div>

                `;


                worksGrid.appendChild(article);

            }
        );

    }


    /* =====================================================
       ERROR
    ===================================================== */

    function showError() {

        if (loading) {

            loading.hidden = true;

        }


        if (profile) {

            profile.hidden = true;

        }


        if (error) {

            error.hidden = false;

        }


        document.title =
            "Perfil no encontrado | Colores en el viento";

    }

});