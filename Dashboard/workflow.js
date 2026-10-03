/* ============================================================
   WEATHER//MONITOR
   WORKFLOW PAGE ENGINE
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const cards =
            document.querySelectorAll(
                ".flow-card"
            );

        /*
         * Staggered entrance animation
         */

        cards.forEach(
            (card, index) => {

                card.style.opacity = "0";

                card.style.transform =
                    "translateY(20px)";

                setTimeout(
                    () => {

                        card.style.transition =
                            "opacity .6s ease, transform .6s ease";

                        card.style.opacity = "1";

                        card.style.transform =
                            "translateY(0)";

                    },
                    150 + index * 120
                );

            }
        );


        /*
         * Simple live-flow indicator
         */

        const dataPath =
            document.querySelector(
                ".data-path"
            );

        if (dataPath) {

            setInterval(
                () => {

                    dataPath.classList.toggle(
                        "pulse"
                    );

                },
                1800
            );

        }


        /*
         * Card interaction
         */

        cards.forEach(
            card => {

                card.addEventListener(
                    "click",
                    () => {

                        cards.forEach(
                            item => {

                                item.classList.remove(
                                    "selected"
                                );

                            }
                        );

                        card.classList.add(
                            "selected"
                        );

                    }
                );

            }
        );

    }
);