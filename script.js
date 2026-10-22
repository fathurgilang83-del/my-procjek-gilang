
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector("#menuToggle");
  const navLinks = document.querySelector("#navLinks");
  const navItems = document.querySelectorAll(".nav-link");
  const revealItems = document.querySelectorAll(".reveal");

  // Pastikan elemen navigasi tersedia
  if (menuToggle && navLinks) {
    function closeMenu() {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Buka navigasi");
    }

    // Buka dan tutup menu mobile
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Tutup navigasi" : "Buka navigasi"
      );
    });

    // Tutup menu setelah tautan dipilih
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Tutup menu menggunakan tombol Escape
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    // Tutup menu ketika layar kembali ke desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });
  }


  // Fade in saat elemen masuk ke layar
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            entry.target.classList.remove("fade-out");
          } else {
            entry.target.classList.remove("visible");
            entry.target.classList.add("fade-out");
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -25px 0px",
      }
    );

    revealItems.forEach((item) => {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => {
      item.classList.add("visible");
    });
  }


  // Penanda navigasi berdasarkan bagian yang terlihat
  const sections = document.querySelectorAll(
    "#home, #about, #ambition, #contact"
  );

  if ("IntersectionObserver" in window && navItems.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (!visibleSections.length) return;

        const currentId = visibleSections[0].target.id;

        navItems.forEach((link) => {
          const isActive =
            link.getAttribute("href") === `#${currentId}`;

          link.classList.toggle("active", isActive);
        });
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5],
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // Penanganan jika foto profil gagal dimuat
  const profilePhoto = document.querySelector(".profile-photo");

  if (profilePhoto) {
    profilePhoto.addEventListener("error", () => {
      profilePhoto.style.opacity = "0";
      console.warn(
        "Foto profil tidak ditemukan. Periksa lokasi images/profil.jpg."
      );
    });
  }
});
