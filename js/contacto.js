/* =========================================================
   COLORES EN EL VIENTO
   CONTACTO
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("contactForm");

    const nameInput =
        document.getElementById("contactName");

    const emailInput =
        document.getElementById("contactEmail");

    const subjectInput =
        document.getElementById("contactSubject");

    const messageInput =
        document.getElementById("contactMessage");

    const counter =
        document.getElementById("messageCounter");

    const success =
        document.getElementById("contactSuccess");

    const currentYear =
        document.getElementById("currentYear");


    /* =====================================================
       AÑO AUTOMÁTICO
    ===================================================== */

    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();

    }


    if (!form) return;


    /* =====================================================
       CONTADOR DEL MENSAJE
    ===================================================== */

    const MAX_MESSAGE_LENGTH = 1000;


    function updateCounter() {

        if (!messageInput || !counter) return;


        if (
            messageInput.value.length >
            MAX_MESSAGE_LENGTH
        ) {

            messageInput.value =
                messageInput.value.slice(
                    0,
                    MAX_MESSAGE_LENGTH
                );

        }


        counter.textContent =
            `${messageInput.value.length} / ${MAX_MESSAGE_LENGTH}`;

    }


    messageInput?.addEventListener(
        "input",
        updateCounter
    );


    updateCounter();


    /* =====================================================
       VALIDACIONES
    ===================================================== */

    function validateName() {

        const valid =
            nameInput.value.trim().length >= 2;


        setFieldState(
            nameInput,
            valid
        );


        return valid;

    }


    function validateEmail() {

        const value =
            emailInput.value.trim();


        const expression =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        const valid =
            expression.test(value);


        setFieldState(
            emailInput,
            valid
        );


        return valid;

    }


    function validateSubject() {

        const valid =
            subjectInput.value !== "";


        setFieldState(
            subjectInput,
            valid
        );


        return valid;

    }


    function validateMessage() {

        const valid =
            messageInput.value
                .trim()
                .length >= 10;


        setFieldState(
            messageInput,
            valid
        );


        return valid;

    }


    /* =====================================================
       ESTADO VISUAL
    ===================================================== */

    function setFieldState(
        field,
        valid
    ) {

        const container =
            field.closest(
                ".contact-field"
            );


        if (!container) return;


        if (valid) {

            container.classList.remove(
                "contact-field--error"
            );

        } else {

            container.classList.add(
                "contact-field--error"
            );

        }

    }


    /* =====================================================
       QUITAR ERROR AL CORREGIR
    ===================================================== */

    nameInput?.addEventListener(
        "input",
        () => {

            if (
                nameInput.value
                    .trim()
                    .length >= 2
            ) {

                setFieldState(
                    nameInput,
                    true
                );

            }

        }
    );


    emailInput?.addEventListener(
        "input",
        () => {

            if (
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    .test(
                        emailInput.value.trim()
                    )
            ) {

                setFieldState(
                    emailInput,
                    true
                );

            }

        }
    );


    subjectInput?.addEventListener(
        "change",
        () => {

            if (
                subjectInput.value !== ""
            ) {

                setFieldState(
                    subjectInput,
                    true
                );

            }

        }
    );


    messageInput?.addEventListener(
        "input",
        () => {

            if (
                messageInput.value
                    .trim()
                    .length >= 10
            ) {

                setFieldState(
                    messageInput,
                    true
                );

            }

        }
    );

/* =====================================================
   ENVÍO
===================================================== */

form.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const nameValid =
            validateName();

        const emailValid =
            validateEmail();

        const subjectValid =
            validateSubject();

        const messageValid =
            validateMessage();


        const formValid =
            nameValid &&
            emailValid &&
            subjectValid &&
            messageValid;


        if (!formValid) {

            const firstError =
                form.querySelector(
                    ".contact-field--error input, " +
                    ".contact-field--error select, " +
                    ".contact-field--error textarea"
                );


            firstError?.focus();

            return;
        }


        /* =============================================
           PREPARAR CORREO
        ============================================= */

        const subjectLabels = {
            consulta: "Consulta general",
            exposicion: "Exposiciones",
            colaboracion: "Colaboraciones",
            artista: "Participación artística",
            obra: "Información sobre una obra",
            otro: "Otro"
        };


        const subjectText =
            subjectLabels[subjectInput.value]
            || "Consulta desde la web";


        const emailSubject =
            `Colores en el viento - ${subjectText}`;


        const emailBody =
`Nombre: ${nameInput.value.trim()}
Correo: ${emailInput.value.trim()}
Motivo: ${subjectText}

Mensaje:
${messageInput.value.trim()}`;


        const mailtoLink =
            `mailto:coloresenelviento5@gmail.com` +
            `?subject=${encodeURIComponent(emailSubject)}` +
            `&body=${encodeURIComponent(emailBody)}`;


        window.location.href = mailtoLink;

    }
);

});