/* =========================================================
   COLORES EN EL VIENTO
   JAVASCRIPT GLOBAL
========================================================= */


document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const header = document.getElementById("header");
    const menuButton = document.getElementById("menuButton");
    const mobileMenu = document.getElementById("mobileMenu");



    /* =====================================================
       HEADER AL HACER SCROLL
    ===================================================== */

    function updateHeader() {

        if (!header) return;


        if (window.scrollY > 30) {

            header.classList.add("header--scrolled");

        } else {

            header.classList.remove("header--scrolled");

        }

    }


    updateHeader();

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );



    /* =====================================================
       MENÚ MÓVIL
    ===================================================== */

    function openMenu() {

        if (!menuButton || !mobileMenu) return;


        menuButton.classList.add("active");
        mobileMenu.classList.add("active");

        document.body.classList.add("menu-open");


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

        if (!menuButton || !mobileMenu) return;


        menuButton.classList.remove("active");
        mobileMenu.classList.remove("active");

        document.body.classList.remove("menu-open");


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

        const isOpen =
            mobileMenu.classList.contains("active");


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
       CERRAR MENÚ AL HACER CLICK EN UN ENLACE
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
                mobileMenu?.classList.contains("active")
            ) {

                closeMenu();

            }

        }
    );



    /* =====================================================
       CERRAR MENÚ SI PASAMOS A ESCRITORIO
    ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 1050 &&
                mobileMenu?.classList.contains("active")
            ) {

                closeMenu();

            }

        }
    );



    /* =====================================================
       MARCAR PÁGINA ACTUAL EN EL MENÚ
    ===================================================== */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop();


    const desktopLinks =
        document.querySelectorAll(
            ".desktop-nav__link"
        );


    desktopLinks.forEach(link => {

        const linkPage =
            link.getAttribute("href");


        if (linkPage === currentPage) {

            link.classList.add("active");

        }

    });

});