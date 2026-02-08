$(function () {
  loadHeader();
  loadBottomNav();
  loadFooter();
});

function loadHeader() {
  $("#header-slot").load("import/header.html", () => {
    const root = document.querySelector("#header-slot");
    if (!root) return;

    setupAlarmBadge(root);
    setupHamburgerMenu(root);
    setupHamSubActive(root);
  });
}

function setupAlarmBadge(root) {
  const alarmBtn = root.querySelector("a.alarm-btn");
  if (!alarmBtn) return;

  if (localStorage.getItem("alarmVisited") === "true") {
    alarmBtn.classList.add("is-read");
    alarmBtn.setAttribute("aria-label", "새로운 소식");
  }
}

function setupHamburgerMenu(root) {
  const btn = root.querySelector(".hambtn");
  const nav = root.querySelector(".hamburger");
  const modal = root.querySelector(".modal-bg");
  const logo = root.querySelector("header a img");

  if (!btn || !nav || !modal || !logo) return;

  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("show");
    modal.classList.toggle("active", open);
    document.body.classList.toggle("lock", open);
    logo.classList.toggle("hide", open);
  });

  modal.addEventListener("click", () => {
    closeHamburger(nav, modal, logo);
  });
}

function closeHamburger(nav, modal, logo) {
  nav.classList.remove("show");
  modal.classList.remove("active");
  document.body.classList.remove("lock");
  logo.classList.remove("hide");
}

function setupHamSubActive(root) {
  // 초기화
  root
    .querySelectorAll(".ham-sub")
    .forEach((el) => el.classList.remove("active"));

  // 이벤트 위임 (햄버거 안의 서브 메뉴 단일 선택)
  root.addEventListener("click", (e) => {
    const sub = e.target.closest(".ham-sub");
    if (!sub) return;

    root
      .querySelectorAll(".ham-sub.active")
      .forEach((el) => el.classList.remove("active"));
    sub.classList.add("active");
  });
}

function loadBottomNav() {
  $("#bottom-nav").load("import/bottom-nav.html", () => {
    const root = document.querySelector("#bottom-nav");
    if (!root) return;

    setupBottomNavActive(root);
  });
}

function setupBottomNavActive(root) {
  const botNavs = root.querySelectorAll(".bot-nav-icon");
  const botImgs = root.querySelectorAll(".bot-nav-icon img");
  const botLinks = root.querySelectorAll(".bottom-btn");

  const defaultSrcs = [
    "img/home_6f6c76.png",
    "img/spark_6f6c76.png",
    "img/search_6f6c76.png",
    "img/comment_icon_6f6c76.png",
    "img/login_6f6c76.png",
  ];

  const activeSrcs = [
    "img/home_f5f5f5.png",
    "img/spark_f5f5f5.png",
    "img/search_f5f5f5.png",
    "img/comment_icon_f5f5f5.png",
    "img/login_f5f5f5.png",
  ];

  const current = location.pathname.split("/").pop() || "index.html";
  const activeIndex = getActiveIndex(botLinks, current);

  setBottomNavActive(botNavs, botImgs, activeIndex, defaultSrcs, activeSrcs);
}

function getActiveIndex(links, current) {
  let idx = 0;
  links.forEach((btn, i) => {
    if (btn.tagName === "A" && btn.getAttribute("href") === current) idx = i;
  });
  return idx;
}

function setBottomNavActive(items, imgs, activeIndex, defaultSrcs, activeSrcs) {
  for (let i = 0; i < items.length; i++) {
    const li = items[i];
    const img = imgs[i];
    if (!li || !img) continue;

    const isActive = i === activeIndex;
    li.classList.toggle("active", isActive);
    img.src = isActive ? activeSrcs[i] : defaultSrcs[i];
  }
}
function loadFooter() {
  $("#footer-slot").load("import/footer.html");
}
