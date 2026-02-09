/* =========================
   Selectors & constants
========================= */
const SELECTOR = {
  game: {
    article: ".content-container",
    imgBox: ".game-content-img-box",
    resultBox: ".game-result-box",
    resultShowClass: "show",
    activeClass: "active",
    blindClass: "blind",
  },

  like: {
    btn: ".likeBtn",
    on: "img/heart_49e99c.png",
    off: "img/heart_6f6c76.png",
  },

  slider: {
    wrapTop: ".find-good-content-wrap",
    listTop: ".find-good-content-list",
    listBot: ".user-hate-review-list",
    nextBtn: ".play-next-btn",
    itemTop: ".find-good-content-item",
    activeClass: "active",
  },
};

/* =========================
   1) Balance game (single pick)
========================= */
function initBalanceGame() {
  let isLocked = false;

  document.addEventListener("click", (e) => {
    if (isLocked) return;

    const s = SELECTOR.game;
    const article = e.target.closest(s.article);
    if (!article) return;

    document.querySelectorAll(s.article).forEach((el) => {
      el.classList.remove(s.activeClass);
    });

    document.querySelectorAll(s.imgBox).forEach((box) => {
      box.classList.add(s.blindClass);
    });

    article.classList.add(s.activeClass);

    const imgBox = article.querySelector(s.imgBox);
    if (imgBox) imgBox.classList.remove(s.blindClass);

    const resultBox = document.querySelector(s.resultBox);
    if (resultBox) resultBox.classList.add(s.resultShowClass);

    isLocked = true;
  });
}

/* =========================
   2) Ticket modal (open/close + focus restore)
========================= */
function initTicketModal() {
  const ticket = document.querySelector(".ticket-box");
  const modal = document.querySelector(".ticket-modal");
  const content = document.querySelector(".ticket-modal-content");
  const closeBtn = document.querySelector(".modal-close");

  if (!ticket || !modal || !content || !closeBtn) return;

  let timer = null;
  let lastFocus = null;

  const open = () => {
    lastFocus = document.activeElement;

    ticket.classList.add("rotated", "opacity");

    timer = setTimeout(() => {
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("lock");
      closeBtn.focus();
    }, 1000);
  };

  const close = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    if (document.activeElement === closeBtn) closeBtn.blur();

    if (lastFocus) lastFocus.focus();
    lastFocus = null;

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lock");

    ticket.classList.remove("opacity", "rotated");
  };

  ticket.addEventListener("click", open);
  closeBtn.addEventListener("click", close);

  modal.addEventListener("click", (e) => {
    if (!content.contains(e.target)) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) close();
  });
}

/* =========================
   3) Like button (heart toggle)
========================= */
function initLikeToggle() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(SELECTOR.like.btn);
    if (!btn) return;

    const img = btn.querySelector("img");
    if (!img) return;

    const cur = img.getAttribute("src");
    img.setAttribute(
      "src",
      cur === SELECTOR.like.off ? SELECTOR.like.on : SELECTOR.like.off,
    );
  });
}

/* =========================
   4) Dual slider (poster + review sync)
========================= */
function initDualSlider() {
  const s = SELECTOR.slider;

  const wrapTop = document.querySelector(s.wrapTop);
  const listTop = document.querySelector(s.listTop);
  const listBot = document.querySelector(s.listBot);
  const nextBtn = document.querySelector(s.nextBtn);

  if (!wrapTop || !listTop || !listBot) return;

  const GAP = 20;

  let topSlides = Array.from(listTop.children);
  let botSlides = Array.from(listBot.children);

  if (topSlides.length === 0 || botSlides.length === 0) return;

  if (topSlides.length !== botSlides.length) {
    console.error("포스터 개수와 리뷰 개수가 다릅니다.", {
      top: topSlides.length,
      bottom: botSlides.length,
    });
    return;
  }

  let index = 1;
  let topW = 0;
  let botW = 0;

  function setSizes() {
    topW = topSlides[0].getBoundingClientRect().width;
    botW = botSlides[0].getBoundingClientRect().width;

    const padTop = Math.max(0, window.innerWidth / 2 - topW / 2);
    listTop.style.paddingLeft = `${padTop}px`;
    listTop.style.paddingRight = `${padTop}px`;

    const padBot = Math.max(0, window.innerWidth / 2 - botW / 2);
    listBot.style.paddingLeft = `${padBot}px`;
    listBot.style.paddingRight = `${padBot}px`;
  }

  function move(animate = true) {
    const t = animate ? "transform 300ms ease" : "none";
    listTop.style.transition = t;
    listBot.style.transition = t;

    listTop.style.transform = `translateX(${-(topW + GAP) * index}px)`;
    listBot.style.transform = `translateX(${-(botW + GAP) * index}px)`;
  }

  function setActive() {
    topSlides.forEach((el) => el.classList.remove(s.activeClass));
    botSlides.forEach((el) => el.classList.remove(s.activeClass));

    if (topSlides[index]) topSlides[index].classList.add(s.activeClass);
    if (botSlides[index]) botSlides[index].classList.add(s.activeClass);
  }

  function rebuild(listEl, slidesArr) {
    const first = slidesArr[0].cloneNode(true);
    const last = slidesArr[slidesArr.length - 1].cloneNode(true);

    listEl.innerHTML = "";
    listEl.appendChild(last);
    slidesArr.forEach((el) => listEl.appendChild(el));
    listEl.appendChild(first);

    return Array.from(listEl.children);
  }

  function build() {
    topSlides = rebuild(listTop, topSlides);
    botSlides = rebuild(listBot, botSlides);

    index = 1;
    setSizes();
    move(false);
    setActive();
  }

  function next() {
    index++;
    move(true);
  }

  function prev() {
    index--;
    move(true);
  }

  if (nextBtn) nextBtn.addEventListener("click", next);

  listTop.addEventListener("click", (e) => {
    const li = e.target.closest(s.itemTop);
    if (!li) return;

    const clicked = topSlides.indexOf(li);
    if (clicked === index + 1) next();
    if (clicked === index - 1) prev();
  });

  listTop.addEventListener("transitionend", () => {
    if (index === topSlides.length - 1) {
      index = 1;
      move(false);
    }
    if (index === 0) {
      index = topSlides.length - 2;
      move(false);
    }
    setActive();
  });

  window.addEventListener("resize", () => {
    setSizes();
    move(false);
  });

  build();
}

/* =========================
   Boot
========================= */
function initAll() {
  initTicketModal();
  initLikeToggle();
  initBalanceGame();
  initDualSlider();
}
initAll();
