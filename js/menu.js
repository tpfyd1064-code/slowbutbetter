(function () {
  const explorer = document.querySelector(".menu-explorer");
  if (!explorer) return;

  if (!Array.isArray(window.MENU_ITEMS)) {
    console.error("Menu data is unavailable: expected window.MENU_ITEMS.");
    return;
  }
  if (!window.Swiper) {
    console.error("Menu carousel is unavailable: Swiper did not load.");
    return;
  }

  const labels = {
    all: "전체 메뉴",
    coffee: "Coffee",
    signature: "Signature & Hand Drip",
    fruit: "Seasonal Fruit",
    noncoffee: "Non-Coffee",
    bread: "Bakery",
  };
  const categories = Array.from(
    explorer.querySelectorAll(".menu-categories button"),
  );
  const wrapper = explorer.querySelector(".menu-swiper .swiper-wrapper");
  const swiperElement = explorer.querySelector(".menu-swiper");
  const title = explorer.querySelector(".menu-category-title");
  const counter = explorer.querySelector(".menu-page-counter");
  const previousButton = explorer.querySelector(".menu-prev");
  const nextButton = explorer.querySelector(".menu-next");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeCategory = "all";
  let swiper;
  // Each card animates once per category render. Never reset a card when revisiting it.
  const revealedCards = new WeakSet();
  let menuIsVisible = false;
  let firstRevealDone = false;
  let changingCategory = false;

  function getActiveCards(instance) {
    const count = Math.max(1, Math.ceil(Number(instance.params.slidesPerView) || 1));
    return Array.from(instance.slides || [])
      .slice(instance.activeIndex, instance.activeIndex + count)
      .map((slide) => slide.querySelector(".menu-card"))
      .filter(Boolean);
  }

  // Start image loading for the current and next groups before they slide in.
  // This avoids mistaking a late lazy-loaded photo for animation flicker.
  function preloadNearbyPhotos(instance) {
    const count = Math.max(1, Math.ceil(Number(instance.params.slidesPerView) || 1));
    Array.from(instance.slides || [])
      .slice(instance.activeIndex, instance.activeIndex + count * 2)
      .forEach((slide) => {
        const image = slide.querySelector(".menu-card-media img");
        if (image) image.loading = "eager";
      });
  }

  // For the initial/category entrance only: hide the group BEFORE it can paint.
  // Other slides are never hidden, so dragging/swiping cannot show blank cards.
  function prepareFirstGroup(instance) {
    if (reduceMotion.matches) return;
    wrapper.querySelectorAll(".menu-card.is-reveal-pending").forEach((card) => {
      card.classList.remove("is-reveal-pending");
    });
    getActiveCards(instance).forEach((card) => {
      if (!revealedCards.has(card)) card.classList.add("is-reveal-pending");
    });
  }

  function revealActiveGroup(instance, entrance = "page") {
    if (!menuIsVisible || reduceMotion.matches) return;
    const cards = getActiveCards(instance).filter((card) => !revealedCards.has(card));
    const entranceClass = entrance === "first" ? "is-first-entering" : "is-page-entering";
    const animationName = entrance === "first" ? "menu-card-fade-up" : "menu-card-soft-fade-up";

    cards.forEach((card, index) => {
      revealedCards.add(card);
      card.style.setProperty("--menu-reveal-delay", `${index * 120}ms`);
      // The pending state is removed in the same task as the first animation class.
      // Animation fill-mode: both prevents a flash during the stagger delay.
      card.classList.remove("is-reveal-pending");
      card.classList.add(entranceClass);
      card.addEventListener("animationend", function handleRevealEnd(event) {
        if (event.target !== card || event.animationName !== animationName) return;
        card.classList.remove(entranceClass);
        card.style.removeProperty("--menu-reveal-delay");
        card.removeEventListener("animationend", handleRevealEnd);
      });
    });
    if (cards.length) firstRevealDone = true;
  }

  function makePlaceholder() {
    const placeholder = document.createElement("div");
    placeholder.className = "menu-card-placeholder";
    placeholder.setAttribute("role", "img");
    placeholder.setAttribute("aria-label", "이미지가 제공되지 않았습니다.");

    const mark = document.createElement("span");
    mark.setAttribute("aria-hidden", "true");
    mark.textContent = "SLOW BUT BETTER";
    placeholder.append(mark);
    return placeholder;
  }

  function makeCard(item) {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";

    const card = document.createElement("article");
    card.className = "menu-card";

    const media = document.createElement("div");
    media.className = "menu-card-media";
    if (item.image) {
      const image = document.createElement("img");
      image.src = item.image.startsWith("images/menu/")
        ? `menujs/${item.image}`
        : item.image;
      image.alt = item.name;
      image.loading = "lazy";
      image.decoding = "async";
      image.addEventListener(
        "error",
        function () {
          media.replaceChildren(makePlaceholder());
        },
        { once: true },
      );
      media.append(image);
    } else {
      media.append(makePlaceholder());
    }

    const copy = document.createElement("div");
    copy.className = "menu-card-copy";

    const name = document.createElement("h3");
    name.textContent = item.name;

    const description = document.createElement("p");
    description.textContent = item.description;

    const price = document.createElement("span");
    price.className = "menu-card-price";
    price.textContent = `₩${Number(item.price).toLocaleString("ko-KR")}`;

    copy.append(name, description, price);
    card.append(media, copy);
    slide.append(card);
    return slide;
  }

  function updateCounter(instance) {
    if (!instance) return;

    const groupSize = Math.ceil(Number(instance.params.slidesPerGroup) || 1);
    const totalPages = Math.max(1, Math.ceil(instance.slides.length / groupSize));
    const currentPage = Math.min(
      Math.ceil(instance.activeIndex / groupSize) + 1,
      totalPages,
    );
    counter.textContent = `${String(currentPage).padStart(2, "0")} / ${String(
      totalPages,
    ).padStart(2, "0")}`;
  }

  function renderCategory() {
    const visibleItems =
      activeCategory === "all"
        ? window.MENU_ITEMS
        : window.MENU_ITEMS.filter((item) => item.category === activeCategory);

    wrapper.replaceChildren(...visibleItems.map(makeCard));
    title.textContent = labels[activeCategory];

    if (swiper) {
      changingCategory = true;
      swiper.update();
      swiper.slideTo(0, 0, false); // Don't run slide-change reveal during category replacement.
      updateCounter(swiper);
      preloadNearbyPhotos(swiper);
      prepareFirstGroup(swiper);
      changingCategory = false;
      if (menuIsVisible) revealActiveGroup(swiper, "first");
    }
  }

  categories.forEach((button) => {
    button.addEventListener("click", function () {
      activeCategory = button.dataset.category;
      categories.forEach((categoryButton) => {
        categoryButton.setAttribute(
          "aria-pressed",
          String(categoryButton === button),
        );
      });
      renderCategory();
    });
  });

  renderCategory();
  swiper = new window.Swiper(swiperElement, {
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 16,
    speed: reduceMotion.matches ? 0 : 550,
    grabCursor: true,
    simulateTouch: true,
    watchOverflow: true,
    navigation: {
      prevEl: previousButton,
      nextEl: nextButton,
    },
    breakpoints: {
      701: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 18,
      },
      1024: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 22,
      },
    },
    on: {
      slideChange: function () {
        updateCounter(this);
        preloadNearbyPhotos(this);
      },
      slideChangeTransitionStart: function () {
        if (!changingCategory) revealActiveGroup(this, "page");
      },
      breakpoint: function () {
        if (!this.slides?.length || changingCategory) return;
        updateCounter(this);
        // The number of visible cards changes at responsive breakpoints.
        if (!firstRevealDone) prepareFirstGroup(this);
        else revealActiveGroup(this, "page");
      },
    },
  });
  updateCounter(swiper);
  preloadNearbyPhotos(swiper);
  prepareFirstGroup(swiper);

  if ("IntersectionObserver" in window) {
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries.find((item) => item.target === swiperElement);
        if (!entry) return;
        menuIsVisible = entry.isIntersecting;
        if (menuIsVisible) {
          revealActiveGroup(swiper, firstRevealDone ? "page" : "first");
        }
      },
      { threshold: 0.01 },
    );
    visibilityObserver.observe(swiperElement);
  } else {
    menuIsVisible = true;
    revealActiveGroup(swiper, "first");
  }
})();
