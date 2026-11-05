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
  const videoStartButton = document.querySelector(".hero__video-start");

  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    heroVideo.playsInline = true;
    heroVideo.setAttribute("muted", "");
    heroVideo.setAttribute("playsinline", "");

    // The mobile file is the native HTML fallback. Use the larger file on desktop only.
    if (!window.matchMedia("(max-width: 700px)").matches) {
      heroVideo.src = "assets/video/atelier-driving-720.mp4";
      heroVideo.load();
    }

    const showStartButton = () => {
      if (videoStartButton) videoStartButton.hidden = false;
    };

    const hideStartButton = () => {
      if (videoStartButton) videoStartButton.hidden = true;
    };

    const playHeroVideo = async () => {
      if (document.visibilityState !== "visible") return;

      try {
        await heroVideo.play();
        hideStartButton();
      } catch (error) {
        // Some mobile browsers block autoplay; offer a direct tap-to-play control.
        showStartButton();
      }
    };

    heroVideo.addEventListener("playing", hideStartButton);
    heroVideo.addEventListener("error", showStartButton);
    if (heroVideo.error) showStartButton();

    if (videoStartButton) {
      videoStartButton.addEventListener("click", () => {
        heroVideo.muted = true;
        playHeroVideo();
      });
    }

    if (reducedMotion) {
      heroVideo.pause();
      showStartButton();
    } else {
      heroVideo.addEventListener("loadeddata", playHeroVideo, { once: true });
      heroVideo.addEventListener("canplay", playHeroVideo, { once: true });
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") playHeroVideo();
        else heroVideo.pause();
      });
      window.addEventListener("pageshow", playHeroVideo);
      playHeroVideo();
    }
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
