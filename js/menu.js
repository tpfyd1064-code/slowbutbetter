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
  const title = explorer.querySelector(".menu-category-title");
  const counter = explorer.querySelector(".menu-page-counter");
  const previousButton = explorer.querySelector(".menu-prev");
  const nextButton = explorer.querySelector(".menu-next");
  let activeCategory = "all";
  let swiper;

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
      swiper.update();
      swiper.slideTo(0, 0);
      updateCounter(swiper);
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
  swiper = new window.Swiper(explorer.querySelector(".menu-swiper"), {
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 16,
    speed: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : 550,
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
      },
      breakpoint: function () {
        updateCounter(this);
      },
    },
  });
  updateCounter(swiper);
})();
