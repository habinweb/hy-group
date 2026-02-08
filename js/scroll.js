function dragScroll(selector) {
  document.querySelectorAll(selector).forEach((box) => {
    // ✅ 이미 바인딩된 요소면 스킵
    if (box.dataset.dragScrollBound === "true") return;
    box.dataset.dragScrollBound = "true";

    let down = false;
    let startX = 0;
    let left = 0;

    box.addEventListener("mousedown", (e) => {
      down = true;
      startX = e.pageX - box.offsetLeft;
      left = box.scrollLeft;
    });

    const stop = () => (down = false);
    box.addEventListener("mouseup", stop);
    box.addEventListener("mouseleave", stop);

    box.addEventListener("mousemove", (e) => {
      if (!down) return;
      e.preventDefault();

      const x = e.pageX - box.offsetLeft;
      box.scrollLeft = left - (x - startX) * 1.5;
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  dragScroll(".favorite-list, .hot-wrap, .poster-box, .review-wrap");
});
