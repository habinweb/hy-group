import { dummy } from "../data.js";

const MAX_ITEMS = 7;

export function initTicketSection() {
  const list = document.querySelector(".ticket-view-list-box");
  if (!list) return;

  const templateEl = document.querySelector("#ticketItemTemplate");
  if (!templateEl) return;

  // 더보기 li (유지 대상)
  const moreItem = list.querySelector(".ticket-view-more");

  // 기존 렌더된 아이템 제거 (더보기 제외)
  list
    .querySelectorAll(".ticket-view-thing:not(.ticket-view-more)")
    .forEach((el) => el.remove());

  // 랜덤 아이템 추출
  const items = pickRandom(dummy, MAX_ITEMS);

  // 아이템 렌더
  const fragment = document.createDocumentFragment();
  items.forEach((item) => {
    fragment.appendChild(buildItem(templateEl, item));
  });

  // 더보기 앞에 삽입
  if (moreItem) list.insertBefore(fragment, moreItem);
  else list.appendChild(fragment);
}

/* helpers */

// 배열에서 랜덤 n개 추출
function pickRandom(arr, limit) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, limit);
}

// 템플릿 기반 아이템 생성
function buildItem(templateEl, item) {
  const fragment = templateEl.content.cloneNode(true);
  const root = fragment.querySelector(".ticket-view-thing");

  root.querySelector('[data-role="link"]').href = `sub.html?id=${item.id}`;

  const img = root.querySelector('[data-role="poster"]');
  img.src = item.poster;
  img.alt = "";

  return root;
}
