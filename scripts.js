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
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

// =========================
// THEME TOGGLE
// =========================
function toggleTheme() {
    document.body.classList.toggle("light-mode");

    playClick();
    vibrate();

    if (document.body.classList.contains("light-mode")) {
        localStorage.setItem("theme", "light");
    } else {
        localStorage.setItem("theme", "dark");
    }
}

// =========================
// HAMBURGER MENU
// =========================
function toggleMenu(btn) {
    const menu = document.getElementById("navMenu");

    menu.classList.toggle("show");
    btn.innerHTML = menu.classList.contains("show") ? "✕" : "☰";

    playClick();
    vibrate();
}

// =========================
// POPUP SYSTEM
// =========================
function openPopup(card) {
    const popup = document.getElementById("popup");

    document.getElementById("popupImg").src =
        card.querySelector("img").src;

    document.getElementById("popupTitle").innerText =
        card.querySelector("h3").innerText;

    document.getElementById("popupText").innerText =
        "Delicious recipe details coming soon...";

    popup.classList.add("active");
}

function closePopup() {
    document.getElementById("popup").classList.remove("active");
}

// =========================
// INIT EVERYTHING AFTER DOM LOAD
// =========================
document.addEventListener("DOMContentLoaded", () => {

    // LOAD SAVED THEME
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
        document.body.classList.add("light-mode");
    }

    // =========================
    // CARD CLICKS
    // =========================
    document.querySelectorAll(".card").forEach(card => {

        // OPEN POPUP
        card.addEventListener("click", () => {
            playClick();
            vibrate();
            openPopup(card);
        });

        // ADD FAVORITE BUTTON
        const btn = document.createElement("div");
        btn.innerHTML = "❤️";
        btn.classList.add("like-btn");

        btn.addEventListener("click", (e) => {
            e.stopPropagation();

            const title = card.querySelector("h3")?.innerText;
            const img = card.querySelector("img")?.src;

            const item = { title, img };

            favorites.push(item);
            updateFavorites();
            playClick();
        });

        card.appendChild(btn);
    });

    // =========================
    // NAV LINK CLICKS
    // =========================
    document.querySelectorAll("nav a").forEach(link => {
        link.addEventListener("click", () => {
            playClick();
            vibrate();

            // CLOSE MENU AFTER CLICK (IMPORTANT)
            document.getElementById("navMenu").classList.remove("show");
        });
    });

    // =========================
    // SEARCH FILTER
    // =========================
    const input = document.getElementById("searchInput");

    if (input) {
        input.addEventListener("input", function () {
            const value = this.value.toLowerCase();

            document.querySelectorAll(".card").forEach(card => {
                const text = card.innerText.toLowerCase();
                card.style.display = text.includes(value) ? "block" : "none";
            });
        });
    }

    // =========================
    // SCROLL ANIMATION
    // =========================
    const elements = document.querySelectorAll(".scroll-anim");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));

    // =========================
    // FAB SCROLL BEHAVIOR
    // =========================
    const fab = document.querySelector(".fab");

    if (fab) {
        window.addEventListener("scroll", () => {
            const scrollPosition = window.innerHeight + window.scrollY;
            const pageHeight = document.body.offsetHeight;

            if (scrollPosition >= pageHeight - 50) {
                fab.classList.add("right");
            } else {
                fab.classList.remove("right");
            }
        });
    }
});

// =========================
// FAVORITES SYSTEM
// =========================
let favorites = [];

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
        div.classList.add("fav-item");

        div.innerHTML = `
            <img src="${item.img}" style="width:100%; border-radius:10px;">
            <h4>${item.title}</h4>
            <button class="remove-btn">Remove</button>
        `;

        div.querySelector(".remove-btn").addEventListener("click", () => {
            favorites.splice(index, 1);
            updateFavorites();
            playClick();
        });

        list.appendChild(div);
    });
}

// =========================
// GLOBAL CLICK RIPPLE EFFECT
// =========================
document.addEventListener("click", (e) => {
    const ripple = document.createElement("div");

    ripple.style.position = "absolute";
    ripple.style.width = "10px";
    ripple.style.height = "10px";
    ripple.style.background = "rgba(255,255,255,0.5)";
    ripple.style.borderRadius = "50%";
    ripple.style.left = e.pageX + "px";
    ripple.style.top = e.pageY + "px";
    ripple.style.transform = "translate(-50%, -50%)";
    ripple.style.pointerEvents = "none";
    ripple.style.animation = "fadeOut 0.6s ease";

    document.body.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
});