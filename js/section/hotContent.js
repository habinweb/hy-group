import { dummy } from "../data.js";
import { fillPosterCard, clearPosterList } from "../utils/renderHotContent.js";

export function initHotSections() {
  const sections = document.querySelectorAll(".hot-container");
  const templateEl = document.querySelector("#posterTemplate");
  if (!templateEl) return;

  sections.forEach((section) => {
    const type = section.dataset.type;
    const nav = section.querySelector(".hot-nav-box");
    const list = section.querySelector(".posterList");
    if (!nav || !list) return;

    renderPosters("all");

    nav.addEventListener("click", (e) => {
      const btn = e.target.closest(".hot-btn-inner");
      if (!btn) return;
      renderPosters(btn.dataset.platform);
    });

    function renderPosters(platform) {
      clearPosterList(list);

      const result = getFilteredData(type, platform);
      result.forEach((item) => {
        const fragment = templateEl.content.cloneNode(true);
        const card = fragment.querySelector(".all-poster");
        if (!card) return;

        fillPosterCard(card, item);
        list.appendChild(card);
      });
    }
  });
}

function getFilteredData(type, platform) {
  return dummy
    .filter((item) => item.type === type)
    .filter((item) =>
      platform === "all" ? true : item.platforms.includes(platform),
    )
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);
}
