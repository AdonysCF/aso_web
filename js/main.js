/* =========================================================
   COLORES EN EL VIENTO
   JAVASCRIPT GLOBAL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const header =
        document.getElementById("header");

    const menuButton =
        document.getElementById("menuButton");

    const mobileMenu =
        document.getElementById("mobileMenu");



    /* =====================================================
       HEADER AL HACER SCROLL
    ===================================================== */

    function updateHeader() {

        if (!header) return;


        if (window.scrollY > 30) {

            header.classList.add(
                "header--scrolled"
            );

        } else {

            header.classList.remove(
                "header--scrolled"
            );

        }

    }


    updateHeader();


    window.addEventListener(
        "scroll",
        updateHeader,
        {
            passive: true
        }
    );



    /* =====================================================
       MENÚ MÓVIL
    ===================================================== */

    function openMenu() {

        if (
            !menuButton ||
            !mobileMenu
        ) return;


        menuButton.classList.add(
            "active"
        );

        mobileMenu.classList.add(
            "active"
        );

        document.body.classList.add(
            "menu-open"
        );


        menuButton.setAttribute(
            "aria-expanded",
            "true"
        );


        menuButton.setAttribute(
            "aria-label",
            "Cerrar menú"
        );


        mobileMenu.setAttribute(
            "aria-hidden",
            "false"
        );

    }



    function closeMenu() {

        if (
            !menuButton ||
            !mobileMenu
        ) return;


        menuButton.classList.remove(
            "active"
        );

        mobileMenu.classList.remove(
            "active"
        );

        document.body.classList.remove(
            "menu-open"
        );


        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );


        menuButton.setAttribute(
            "aria-label",
            "Abrir menú"
        );


        mobileMenu.setAttribute(
            "aria-hidden",
            "true"
        );

    }



    function toggleMenu() {

        if (!mobileMenu) return;


        const isOpen =
            mobileMenu.classList.contains(
                "active"
            );


        if (isOpen) {

            closeMenu();

        } else {

            openMenu();

        }

    }



    if (menuButton) {

        menuButton.addEventListener(
            "click",
            toggleMenu
        );

    }



    /* =====================================================
       CERRAR MENÚ AL HACER CLICK
    ===================================================== */

    const mobileLinks =
        document.querySelectorAll(
            ".mobile-menu__link"
        );


    mobileLinks.forEach(link => {

        link.addEventListener(
            "click",
            closeMenu
        );

    });



    /* =====================================================
       CERRAR MENÚ CON ESC
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                mobileMenu?.classList.contains(
                    "active"
                )
            ) {

                closeMenu();

            }

        }
    );



    /* =====================================================
       CERRAR MENÚ AL PASAR A ESCRITORIO
    ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 1050 &&
                mobileMenu?.classList.contains(
                    "active"
                )
            ) {

                closeMenu();

            }

        }
    );



    /* =====================================================
       NAVEGACIÓN ACTIVA
    ===================================================== */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    /*
     * Relacionamos páginas de detalle
     * con su sección principal.
     */

    const sectionMap = {

        "obra.html":
            "obras.html",

        "artista.html":
            "artistas.html",

        "exposicion.html":
            "exposiciones.html"

    };


    const activePage =
        sectionMap[currentPage] ||
        currentPage;



    /* =====================================================
       MENÚ DE ESCRITORIO
    ===================================================== */

    const desktopLinks =
        document.querySelectorAll(
            ".desktop-nav__link"
        );


    desktopLinks.forEach(link => {

        link.classList.remove(
            "active"
        );


        const linkPage =
            link
                .getAttribute("href")
                ?.split("?")[0]
                .toLowerCase();


        if (
            linkPage === activePage
        ) {

            link.classList.add(
                "active"
            );

            link.setAttribute(
                "aria-current",
                "page"
            );

        } else {

            link.removeAttribute(
                "aria-current"
            );

        }

    });



    /* =====================================================
       MENÚ MÓVIL ACTIVO
    ===================================================== */

    mobileLinks.forEach(link => {

        link.classList.remove(
            "active"
        );


        const linkPage =
            link
                .getAttribute("href")
                ?.split("?")[0]
                .toLowerCase();


        if (
            linkPage === activePage
        ) {

            link.classList.add(
                "active"
            );

            link.setAttribute(
                "aria-current",
                "page"
            );

        } else {

            link.removeAttribute(
                "aria-current"
            );

        }

    });



    /* =====================================================
       AÑO AUTOMÁTICO
    ===================================================== */

    const yearElements =
        document.querySelectorAll(
            "[data-current-year]"
        );


    yearElements.forEach(element => {

        element.textContent =
            new Date().getFullYear();

    });



    /* =====================================================
       ANIMACIONES AL HACER SCROLL
    ===================================================== */

    const revealElements =
        document.querySelectorAll(
            "[data-reveal]"
        );


    /*
     * Respetamos la configuración
     * de accesibilidad del usuario.
     */

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (prefersReducedMotion) {

        revealElements.forEach(
            element => {

                element.classList.add(
                    "is-visible"
                );

            }
        );

    } else if (
        "IntersectionObserver" in window
    ) {

        const revealObserver =
            new IntersectionObserver(

                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target
                                    .classList.add(
                                        "is-visible"
                                    );


                                revealObserver
                                    .unobserve(
                                        entry.target
                                    );

                            }

                        }
                    );

                },

                {
                    threshold: 0.12,
                    rootMargin:
                        "0px 0px -40px 0px"
                }

            );


        revealElements.forEach(
            element => {

                revealObserver.observe(
                    element
                );

            }
        );

    } else {

        revealElements.forEach(
            element => {

                element.classList.add(
                    "is-visible"
                );

            }
        );

    }



    /* =====================================================
       ENLACES INTERNOS SUAVES
    ===================================================== */

    const anchorLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    anchorLinks.forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const href =
                    link.getAttribute(
                        "href"
                    );


                if (
                    !href ||
                    href === "#"
                ) {

                    return;

                }


                const target =
                    document.querySelector(
                        href
                    );


                if (!target) return;


                event.preventDefault();


                target.scrollIntoView({

                    behavior:
                        prefersReducedMotion
                            ? "auto"
                            : "smooth",

                    block:
                        "start"

                });

            }
        );

    });


});