// 헤더 연결 및 기능 구현
$(function () {
  // 헤더 임포트 주소 연결
  $("#header-slot").load("import/header.html", () => {
    const r = document.querySelector("#header-slot");
    const btn = r.querySelector(".hambtn");
    const nav = r.querySelector(".hamburger");
    const modal = r.querySelector(".modal-bg");
    const logo = r.querySelector("header a img");

    // 초기화
    r.querySelectorAll(".ham-sub").forEach((el) =>
      el.classList.remove("active"),
    );

    // 메뉴 열기/닫기
    btn.addEventListener("click", () => {
      const open = nav.classList.toggle("show");
      modal.classList.toggle("active", open);
      document.body.classList.toggle("lock", open);
      logo.classList.toggle("hide", open);
    });

    // 배경 클릭 시 닫기
    modal.addEventListener("click", () => {
      nav.classList.remove("show");
      modal.classList.remove("active");
      document.body.classList.remove("lock");
      logo.classList.remove("hide");
    });

    // 단일 선택
    r.addEventListener("click", (e) => {
      const sub = e.target.closest(".ham-sub");
      if (!sub) return;
      r.querySelectorAll(".ham-sub.active").forEach((el) =>
        el.classList.remove("active"),
      );
      sub.classList.add("active");
    });
  });
});

// 하단바 루트 연결
$(function () {
  $("#bottom-nav").load("import/bottom-nav.html", function () {
    const container = document.getElementById("bottom-nav");
    if (!container) return;

    const botNavs = container.querySelectorAll(".bot-nav-icon");
    const botImgs = container.querySelectorAll(".bot-nav-icon img");
    const botLinks = container.querySelectorAll(".bottom-btn");

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

    function setActive(activeIndex) {
      for (let i = 0; i < botNavs.length; i++) {
        const li = botNavs[i];
        const img = botImgs[i];
        if (!li || !img) continue;

        if (i === activeIndex) {
          li.classList.add("active");
          img.src = activeSrcs[i];
        } else {
          li.classList.remove("active");
          img.src = defaultSrcs[i];
        }
      }
    }

    const current = location.pathname.split("/").pop() || "index.html";
    let activeIndex = 0;

    botLinks.forEach((btn, i) => {
      if (btn.tagName === "A" && btn.getAttribute("href") === current) {
        activeIndex = i;
      }
    });

    setActive(activeIndex);
  });
});
