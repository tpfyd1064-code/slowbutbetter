const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const gallery = document.querySelector(".motion-gallery .swiper");
if (gallery && window.Swiper) {
  new window.Swiper(gallery, {
    loop: true,
    speed: reducedMotion ? 0 : 850,
    slidesPerView: 1.2,
    spaceBetween: 12,
    simulateTouch: true,
    autoplay: reducedMotion
      ? false
      : {
          delay: 2900,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
    navigation: {
      prevEl: document.querySelector(".motion-gallery .gallery-prev"),
      nextEl: document.querySelector(".motion-gallery .gallery-next"),
    },
    pagination: {
      el: document.querySelector(".motion-gallery .gallery-pagination"),
      clickable: true,
      dynamicBullets: false, // true → false
    },
    breakpoints: {
      701: {
        spaceBetween: 18,
      },
      768: {
        slidesPerView: 2.2,
        spaceBetween: 18,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 18,
      },
    },
  });
}

const detailGallery = document.querySelector("#detail-gallery");
if (window.AOS && (document.querySelector("[data-aos]") || detailGallery)) {
  window.AOS.init({
    duration: 650,
    once: true,
    disable: reducedMotion,
  });
}

if (detailGallery) {
  const detailTitle = document.querySelector("#detail-gallery-title");
  const detailGrid = detailGallery.querySelector(".detail-gallery-grid");
  const galleryCards = document.querySelectorAll("[data-gallery-category]");
  const closeButton = detailGallery.querySelector(".detail-gallery-close");
  let activeCard = null;
  const categories = {
    exterior: {
      title: "매장 외관",
      folder: "store",
      prefix: "out",
      count: 6,
      extension: "jfif",
    },
    interior: {
      title: "실내 공간",
      folder: "store",
      prefix: "i",
      count: 6,
      extension: "jfif",
    },
    bakery: {
      title: "베이커리",
      files: [
        "1.jfif",
        "2.jfif",
        "3.jfif",
        "4.jfif",
        "5.png",
        "6.png",
        "7.jfif",
        "8.jfif",
        "9.jfif",
      ],
    },
  };

  function showGallery(card) {
    const category = categories[card.dataset.galleryCategory];
    if (!category) return;

    const files =
      category.files ||
      Array.from(
        { length: category.count },
        (_, index) => `${category.prefix}${index + 1}.${category.extension}`,
      );
    detailTitle.textContent = category.title;
    detailGrid.replaceChildren();

    files.forEach((file, index) => {
      const image = document.createElement("img");
      image.src = `images/${category.folder || "food"}/${file}`;
      image.alt = `${category.title} 사진 ${index + 1}`;
      image.loading = "lazy";
      image.setAttribute("data-aos", "fade-up");
      image.setAttribute("data-aos-duration", "650");
      image.setAttribute("data-aos-delay", String((index % 3) * 100));
      detailGrid.append(image);
    });

    detailGallery.hidden = false;
    galleryCards.forEach((galleryCard) => {
      galleryCard.setAttribute("aria-expanded", String(galleryCard === card));
    });
    activeCard = card;
    if (window.AOS) window.AOS.refreshHard();

    const header = document.querySelector(".site-header");
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const top =
      detailGallery.getBoundingClientRect().top +
      window.scrollY -
      headerHeight -
      16;
    window.scrollTo({
      top,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }

  galleryCards.forEach((card) => {
    card.addEventListener("click", () => showGallery(card));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        card.click();
      }
    });
  });

  closeButton.addEventListener("click", () => {
    detailGallery.hidden = true;
    galleryCards.forEach((card) => card.setAttribute("aria-expanded", "false"));
    if (activeCard) activeCard.focus();
    activeCard = null;
  });
}

const homepageHero = document.querySelector(".home-page .editorial-hero");
const homepageSecondScreen = document.querySelector(
  ".home-page .home-second-screen",
);
if (homepageHero && homepageSecondScreen) {
  const homepageHeader = document.querySelector(".home-page .site-header");
  const desktopViewport = window.matchMedia("(min-width: 1024px)");
  let wheelTransitionLocked = false;

  function updateHeaderSpace() {
    const headerHeight = homepageHeader
      ? homepageHeader.getBoundingClientRect().height
      : 0;
    homepageSecondScreen.style.setProperty(
      "--home-header-height",
      `${headerHeight}px`,
    );
  }

  updateHeaderSpace();
  window.addEventListener("resize", updateHeaderSpace, { passive: true });

  window.addEventListener(
    "wheel",
    (event) => {
      if (!desktopViewport.matches || event.defaultPrevented) return;
      if (!event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

      const eventTarget = event.target;
      if (
        eventTarget instanceof Element &&
        eventTarget.closest(
          ".swiper, .gallery-window, .gallery-controls, a, button, input, select, textarea, [role='button'], [contenteditable='true']",
        )
      ) {
        return;
      }

      if (wheelTransitionLocked) {
        event.preventDefault();
        return;
      }

      let destination = null;
      if (
        event.deltaY > 0 &&
        window.scrollY < homepageSecondScreen.offsetTop - 1 &&
        homepageHero.getBoundingClientRect().bottom > 0
      ) {
        destination = homepageSecondScreen;
      } else if (
        event.deltaY < 0 &&
        Math.abs(homepageSecondScreen.getBoundingClientRect().top) <= 2
      ) {
        destination = homepageHero;
      }

      if (!destination) return;

      event.preventDefault();
      wheelTransitionLocked = true;
      window.setTimeout(() => {
        wheelTransitionLocked = false;
      }, 750);
      destination.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
    },
    { passive: false },
  );
}
