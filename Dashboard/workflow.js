document.addEventListener(
    "DOMContentLoaded",
    () => {

        const menuBtn =
            document.getElementById(
                "menuBtn"
            );

        const sidebar =
            document.getElementById(
                "sidebar"
            );

        const overlay =
            document.getElementById(
                "mobileOverlay"
            );


        /* ====================================================
           MOBILE MENU
        ==================================================== */

        function closeMenu() {

            sidebar?.classList.remove(
                "open"
            );

            overlay?.classList.remove(
                "open"
            );

            if (menuBtn) {
                menuBtn.innerHTML = "☰";
            }
        }


        menuBtn?.addEventListener(
            "click",
            () => {

                const opened =
                    sidebar?.classList.toggle(
                        "open"
                    );

                overlay?.classList.toggle(
                    "open"
                );

                if (menuBtn) {

                    menuBtn.innerHTML =
                        opened
                            ? "×"
                            : "☰";
                }

            }
        );


        overlay?.addEventListener(
            "click",
            closeMenu
        );


        document
            .querySelectorAll(
                ".nav-item"
            )
            .forEach(
                item => {

                    item.addEventListener(
                        "click",
                        closeMenu
                    );

                }
            );


        /* ====================================================
           WORKFLOW CARD ANIMATION
        ==================================================== */

        const cards =
            document.querySelectorAll(
                ".workflow-card"
            );


        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "visible"
                                );

                            }

                        }
                    );

                },
                {
                    threshold:
                        0.12
                }
            );


        cards.forEach(
            card => {

                card.style.opacity = "0";

                card.style.transform =
                    "translateY(15px)";

                card.style.transition =
                    "opacity .5s ease, transform .5s ease";

                observer.observe(
                    card
                );

            }
        );


        /* ====================================================
           MAKE CARDS VISIBLE
        ==================================================== */

        const style =
            document.createElement(
                "style"
            );


        style.textContent = `

            .workflow-card.visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }

        `;


        document.head.appendChild(
            style
        );


        /* ====================================================
           QUICK FLOW CLICK
        ==================================================== */

        document
            .querySelectorAll(
                ".quick-step"
            )
            .forEach(
                step => {

                    step.addEventListener(
                        "click",
                        () => {

                            step.style.transform =
                                "scale(.97)";

                            setTimeout(
                                () => {

                                    step.style.transform =
                                        "";

                                },
                                120
                            );

                        }
                    );

                }
            );

    }
);