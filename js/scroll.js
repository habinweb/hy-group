/* =========================
   Drag to scroll (horizontal)
========================= */
function dragScroll(selector) {
  document.querySelectorAll(selector).forEach((box) => {
    // 이미 바인딩된 요소는 제외
    if (box.dataset.dragScrollBound === "true") return;
    box.dataset.dragScrollBound = "true";

    let isDown = false;
    let startX = 0;
    let startScroll = 0;

    box.addEventListener("mousedown", (e) => {
      isDown = true;
      startX = e.pageX - box.offsetLeft;
      startScroll = box.scrollLeft;
    });

    const stop = () => (isDown = false);
    box.addEventListener("mouseup", stop);
    box.addEventListener("mouseleave", stop);

    box.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();

      const x = e.pageX - box.offsetLeft;
      box.scrollLeft = startScroll - (x - startX) * 1.5;
    });
  });
}

/* =========================
   Init
========================= */
document.addEventListener("DOMContentLoaded", () => {
  dragScroll(".favorite-list, .hot-wrap, .poster-box, .review-wrap");
});
