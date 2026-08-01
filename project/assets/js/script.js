
document.addEventListener("DOMContentLoaded", () => {

    initializeContactForm();
    initializeSmoothScroll();

});


function initializeContactForm() {

    const contactForm =
        document.querySelector(".contact-form form");

    if (!contactForm) return;

    contactForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const fullName =
            contactForm.querySelector('input[type="text"]').value.trim();

        const email =
            contactForm.querySelector('input[type="email"]').value.trim();

        const subject =
            contactForm.querySelectorAll('input[type="text"]')[1].value.trim();

        const message =
            contactForm.querySelector("textarea").value.trim();

        if (
            fullName === "" ||
            email === "" ||
            subject === "" ||
            message === ""
        ) {

            alert("Please fill in all the fields.");
            return;

        }

        alert(
            "Thank you for contacting us. We have received your message."
        );

        contactForm.reset();

    });

}

function initializeSmoothScroll() {

    const links =
        document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {

        link.addEventListener("click", function (e) {

            const target =
                document.querySelector(this.getAttribute("href"));

            if (!target) return;

            e.preventDefault();

            target.scrollIntoView({
                behavior: "smooth"
            });

        });

    });

}