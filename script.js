(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#site-nav");

  if (menuButton && navigation) {
    const closeMenu = () => {
      menuButton.setAttribute("aria-expanded", "false");
      navigation.classList.remove("is-open");
    };

    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      navigation.classList.toggle("is-open", !isOpen);
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (!navigation.contains(event.target) && !menuButton.contains(event.target)) {
        closeMenu();
      }
    });
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const heroVideo = document.querySelector(".hero__video");

  if (heroVideo) {
    // Muted inline autoplay is supported by current desktop and mobile browsers.
    // Keep an MP4 source in the markup as a fallback and use the HD file on desktop.
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    heroVideo.volume = 0;
    heroVideo.playsInline = true;
    heroVideo.autoplay = true;
    heroVideo.loop = true;
    heroVideo.setAttribute("muted", "");
    heroVideo.setAttribute("playsinline", "");
    heroVideo.setAttribute("autoplay", "");
    heroVideo.setAttribute("loop", "");

    const playHeroVideo = () => {
      if (document.visibilityState !== "visible" || !heroVideo.paused) return;
      const playback = heroVideo.play();
      if (playback && typeof playback.catch === "function") {
        // Never show a play button: retry on media readiness, tab focus and user gesture.
        playback.catch(() => {});
      }
    };

    ["loadedmetadata", "loadeddata", "canplay", "canplaythrough"].forEach((eventName) => {
      heroVideo.addEventListener(eventName, playHeroVideo);
    });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") playHeroVideo();
      else heroVideo.pause();
    });
    window.addEventListener("pageshow", playHeroVideo);

    // A few browsers defer muted autoplay until the first ordinary page interaction.
    ["pointerdown", "touchstart", "keydown"].forEach((eventName) => {
      document.addEventListener(eventName, playHeroVideo, { passive: true });
    });

    if (!window.matchMedia("(max-width: 700px)").matches) {
      heroVideo.src = "assets/video/atelier-driving-720.mp4";
      heroVideo.load();
    }

    playHeroVideo();
  }

  const revealItems = document.querySelectorAll("[data-reveal]");

  if (!reducedMotion && "IntersectionObserver" in window && revealItems.length) {
    document.documentElement.classList.add("has-motion");

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const bookingForm = document.querySelector("#booking-form");
  const formStatus = document.querySelector("#form-status");

  if (bookingForm && formStatus) {
    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!bookingForm.reportValidity()) return;

      formStatus.textContent =
        "Проверка пройдена. Это демонстрация: заявка не отправлена и данные не сохранены.";
    });
  }
})();
