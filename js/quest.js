(function () {
  const wrapTop = document.querySelector(".find-good-content-wrap");
  const listTop = document.querySelector(".find-good-content-list");
  const listBot = document.querySelector(".user-hate-review-list");
  const nextBtn = document.querySelector(".play-next-btn");

  if (!wrapTop || !listTop || !listBot) return;

  const GAP = 20;

  let topSlides = Array.from(listTop.children);
  let botSlides = Array.from(listBot.children);

  // ✅ 둘 중 하나라도 비었거나 개수가 다르면 동기화 불가
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
    // width 측정은 현재 DOM에 있는 "실제 슬라이드" 기준
    topW = topSlides[0].getBoundingClientRect().width;
    botW = botSlides[0].getBoundingClientRect().width;

    // ✅ 상단 중앙정렬
    const padTop = Math.max(0, window.innerWidth / 2 - topW / 2);
    listTop.style.paddingLeft = `${padTop}px`;
    listTop.style.paddingRight = `${padTop}px`;

    // ✅ 하단(리뷰)도 중앙정렬
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
    topSlides.forEach((el) => el.classList.remove("active"));
    botSlides.forEach((el) => el.classList.remove("active"));

    if (topSlides[index]) topSlides[index].classList.add("active");
    if (botSlides[index]) botSlides[index].classList.add("active");
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

  // ✅ 버튼으로 다음 슬라이드 (위/아래 같이)
  if (nextBtn) nextBtn.addEventListener("click", next);

  // ✅ 상단 클릭으로 인접 이동 (아래도 같이 따라감)
  listTop.addEventListener("click", (e) => {
    const li = e.target.closest(".find-good-content-item");
    if (!li) return;

    const clicked = topSlides.indexOf(li);
    if (clicked === index + 1) next();
    if (clicked === index - 1) prev();
  });

  // ✅ transition 보정은 한 군데에서만 (상단 기준으로)
  listTop.addEventListener("transitionend", () => {
    // 마지막(복제본)까지 갔으면 → 진짜 첫 슬라이드로 순간이동
    if (index === topSlides.length - 1) {
      index = 1;
      move(false);
    }
    // 첫(복제본)까지 갔으면 → 진짜 마지막 슬라이드로 순간이동
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
})();
