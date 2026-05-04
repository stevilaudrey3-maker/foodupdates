
// =========================
// SOUND + VIBRATION SYSTEM
// =========================
const clickSound = new Audio("click.mp3");
clickSound.volume = 0.3;

function playClick() {
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
}

function vibrate() {
    if (navigator.vibrate) navigator.vibrate(50);
}


// =========================
// THEME TOGGLE
// =========================
function toggleTheme() {
    document.body.classList.toggle("light-mode");

    playClick();
    vibrate();

    localStorage.setItem(
        "theme",
        document.body.classList.contains("light-mode") ? "light" : "dark"
    );
}


// =========================
// humburger menu toggle
// =========================
document.addEventListener("DOMContentLoaded", function () {

    const toggle = document.getElementById("menuToggle");
    const nav = document.getElementById("navMenu");

    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
        nav.classList.toggle("active");

        playClick();
        vibrate();
    });

});

//=========================
// SOCIAL DOCK
//=========================
document.addEventListener("DOMContentLoaded", () => {

    const fabBtn = document.getElementById("fabBtn");
    const fabContainer = document.getElementById("fabContainer");

    // SAFETY CHECK (VERY IMPORTANT)
    if (fabBtn && fabContainer) {

        fabBtn.addEventListener("click", () => {

            fabContainer.classList.toggle("active");

            if (fabContainer.classList.contains("active")) {
                fabBtn.innerHTML = "×";
            } else {
                fabBtn.innerHTML = "+";
            }

            playClick();
            vibrate();
        });
    }

});
// =========================
// GLOBAL STATE
// =========================
let favorites = [];


// =========================
// MAIN APP INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // LOAD THEME
    // =========================
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-mode");
    }

    // =========================
    // SEARCH FILTER
    // =========================
    const input = document.getElementById("searchInput");

    if (input) {
        input.addEventListener("input", function () {
            const value = this.value.toLowerCase();

            document.querySelectorAll(".card").forEach(card => {
                card.style.display =
                    card.innerText.toLowerCase().includes(value)
                        ? "block"
                        : "none";
            });
        });
    }


    // =========================
    // FAVORITES SYSTEM
    // =========================
    function updateFavorites() {
        const list = document.getElementById("favoritesList");
        if (!list) return;

        list.innerHTML = "";

        if (favorites.length === 0) {
            list.innerHTML = `<p class="empty">No favorites yet</p>`;
            return;
        }

        favorites.forEach((item, index) => {
            const div = document.createElement("div");
            div.className = "fav-item";

            div.innerHTML = `
                <img src="${item.img}">
                <h4>${item.title}</h4>
                <button class="remove-btn">Remove</button>
            `;

            div.querySelector(".remove-btn").addEventListener("click", () => {
                favorites.splice(index, 1);
                updateFavorites();
                playClick();
                vibrate();
            });

            list.appendChild(div);
        });
    }


    // =========================
    // NAV LINKS
    // =========================
    document.querySelectorAll("nav a").forEach(link => {
        link.addEventListener("click", () => {
            playClick();
            vibrate();

            document.getElementById("navMenu")?.classList.remove("show");
        });
    });


    // =========================
    // FEEDBACK FORM
    // =========================
    document.getElementById("feedbackForm")?.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("userEmail").value;
        const message = document.getElementById("userMessage").value;
        const status = document.getElementById("feedbackStatus");

        if (email && message) {
            status.textContent = "✅ Thank you for your feedback!";
            status.style.color = "lightgreen";
            this.reset();
        } else {
            status.textContent = "❌ Please fill all fields.";
            status.style.color = "red";
        }

        playClick();
        vibrate();
    });

});

document.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll(".glass-card");
    const nextBtn = document.querySelector(".next");
    const prevBtn = document.querySelector(".prev");

    let index = 0;
    let autoSlide;

    function showCard(i) {
        cards.forEach(card => card.classList.remove("active"));
        cards[i].classList.add("active");
    }

    function nextCard() {
        index = (index + 1) % cards.length;
        showCard(index);
    }

    function prevCard() {
        index = (index - 1 + cards.length) % cards.length;
        showCard(index);
    }

    // =========================
    // AUTO PLAY
    // =========================
    function startAuto() {
        autoSlide = setInterval(nextCard, 3000);
    }

    function stopAuto() {
        clearInterval(autoSlide);
    }

    startAuto();

    // =========================
    // PAUSE ON HOVER
    // =========================
    const carousel = document.querySelector(".carousel");

    carousel.addEventListener("mouseenter", stopAuto);
    carousel.addEventListener("mouseleave", startAuto);

    // =========================
    // ARROWS
    // =========================
    nextBtn?.addEventListener("click", () => {
        nextCard();
        stopAuto();
        startAuto();
    });

    prevBtn?.addEventListener("click", () => {
        prevCard();
        stopAuto();
        startAuto();
    });

    // =========================
    // SWIPE (MOBILE)
    // =========================
    let startX = 0;

    carousel.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    });

    carousel.addEventListener("touchend", (e) => {
        let endX = e.changedTouches[0].clientX;

        if (startX - endX > 50) {
            nextCard();
        } else if (endX - startX > 50) {
            prevCard();
        }
    });

});

// =========================
// SCROLL REVEAL SYSTEM
// =========================
const reveals = document.querySelectorAll(".card, .glass-card, .favorites, .feedback-section");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("reveal", "active");
        }
    });
}, {
    threshold: 0.15
});

reveals.forEach(el => {
    el.classList.add("reveal");
    observer.observe(el);
});


// =========================
// 3D TILT EFFECT (PREMIUM)
// =========================
document.querySelectorAll(".card, .glass-card").forEach(card => {

    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = -(y - centerY) / 12;
        const rotateY = (x - centerX) / 12;

        card.style.transform = `
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale(1.05)
        `;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "rotateX(0) rotateY(0) scale(1)";
    });

});


// =========================
// SMOOTH SCROLL DEPTH EFFECT
// =========================
window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    document.querySelectorAll(".hero img").forEach(img => {
        img.style.transform = `translateY(${scrollY * 0.1}px) scale(1.05)`;
    });
});
