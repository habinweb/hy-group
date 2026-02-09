function ready(fn) {
  document.addEventListener("DOMContentLoaded", fn);
}

// 헤더 메뉴
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

// 좋아요 버튼
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

// OTT 탭
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

  // ✅ 요소 없으면 여기서 종료 (에러 방지)
  if (!reviewContainer || !reviewTab || !closebtn) return;

  // 리뷰 폼 열고 닫기
  reviewContainer.addEventListener("click", () => {
    reviewTab.classList.add("open");
  });

  closebtn.addEventListener("click", (e) => {
    e.stopPropagation();
    reviewTab.classList.remove("open");
  });

  /* =========================
     Login required popup (like/hate/register)
  ========================= */

  const POPUP_ID = "#login_popup";
  const OPEN_CLASS = "active";

  function openLoginPopup() {
    $(POPUP_ID).addClass(OPEN_CLASS).attr("aria-hidden", "false");
  }

  function closeLoginPopup() {
    $(POPUP_ID).removeClass(OPEN_CLASS).attr("aria-hidden", "true");
  }

  $("#star").on("click", ".star", function (e) {
    e.preventDefault();
    openLoginPopup();
  });

  $(document).on("click", ".login_btn_cancel", function () {
    closeLoginPopup();
  });

  $(document).on("click", ".login_btn_go", function () {
    location.href = "form.html";
  });
}

ready(() => {
  headerMenu();
  likeToggle();
  hotTab();
  reveiwForm();
});
