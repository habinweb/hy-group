function ready(fn) {
  document.addEventListener("DOMContentLoaded", fn);
}
//헤더 메뉴
function headerMenu() {
  const items = document.querySelectorAll(".ham-sub-box li");
  if (!items.length) return;

  items.forEach((i) => i.classList.remove("active"));

  items.forEach((item) => {
    item.addEventListener("click", () => {
      const on = item.classList.contains("active");
      items.forEach((i) => i.classList.remove("active"));
      if (!on) item.classList.add("active");
    });
  });
}

//좋아요 버튼
function likeToggle() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".likeBtn");
    if (!btn) return;

    const img = btn.querySelector("img");
    if (!img) return;

    const on = "img/heart_49e99c.png";
    const off = "img/heart_6f6c76.png";

    img.src = img.src.includes("heart_6f6c76") ? on : off;
  });
}

//ott 탭
function hotTab() {
  document.querySelectorAll(".hot-container").forEach((section) => {
    const nav = section.querySelector(".hot-nav-box");
    if (!nav) return;

    const btns = () => nav.querySelectorAll(".hot-btn-inner");

    if (!nav.querySelector(".active") && btns().length) {
      btns()[0].classList.add("active");
    }

    nav.addEventListener("click", (e) => {
      const btn = e.target.closest(".hot-btn-inner");
      if (!btn) return;

      btns().forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
}

function reveiwForm() {
  const reviewContainer = document.querySelector(".btn-form-container");
  const reviewTab = document.querySelector(".review-form");
  const closebtn = document.querySelector(".prev-btn");
  reviewContainer.addEventListener("click", () => {
    reviewTab.classList.add("open");
  });
  closebtn.addEventListener("click", (e) => {
    e.stopPropagation();
    reviewTab.classList.remove("open");
  });
}

function logReady() {
  console.log("페이지가 로드되었습니다.");
}

ready(() => {
  headerMenu();
  likeToggle();
  hotTab();
  reveiwForm();
  logReady();
});
