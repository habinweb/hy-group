// 데이터 가져오기
import { dummy } from "../data.js";

export function initFavoriteSection() {
  const list = document.querySelector(".favorite-list-box");
  if (!list) return;

  const templateEl = document.querySelector("#favoriteItemTemplate");
  if (!templateEl) return;

  // ✅ 기준 장르(문구에 있는 값) 읽기
  const genreEl = document.querySelector('[data-role="genre"]');
  const targetGenre = (genreEl?.textContent ?? "").trim();
  if (!targetGenre) return;

  const moreBtn = list.querySelector(".favorite-more");

  list
    .querySelectorAll(".favorite-thing:not(.favorite-more)")
    .forEach((el) => el.remove());

  // ✅ 렌더링 시작: "기준 장르"로 필터링 추가
  const items = [...dummy]
    .filter(
      (item) => Array.isArray(item.genre) && item.genre.includes(targetGenre),
    )
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7);

  items.forEach((item) => {
    const fragment = templateEl.content.cloneNode(true);

    const card = fragment.querySelector(".favorite-thing");
    if (!card) return;

    const link = card.querySelector('[data-role="link"]');
    const img = card.querySelector('[data-role="poster"]');

    if (link) link.href = `sub.html?id=${item.id}`;
    if (img) {
      img.src = item.poster;
      img.alt = "";
    }

    if (moreBtn) list.insertBefore(card, moreBtn);
    else list.appendChild(card);
  });
}
