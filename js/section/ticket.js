import { dummy } from "../data.js";

const MAX_ITEMS = 7;

export function initTicketSection() {
  const list = document.querySelector(".ticket-view-list-box");
  if (!list) return;

  const templateEl = document.querySelector("#ticketItemTemplate");
  if (!templateEl) return;

  // ✅ 더보기 버튼(li)
  const moreItem = list.querySelector(".ticket-view-more");

  // ✅ 기존 아이템 제거 (더보기는 유지)
  list
    .querySelectorAll(".ticket-view-thing:not(.ticket-view-more)")
    .forEach((el) => el.remove());

  // ✅ 랜덤 7개
  const items = pickRandom(dummy, MAX_ITEMS);

  // ✅ 렌더
  const frag = document.createDocumentFragment();
  items.forEach((item) => {
    frag.appendChild(buildItem(templateEl, item));
  });

  // ✅ 더보기 앞에 삽입
  if (moreItem) list.insertBefore(frag, moreItem);
  else list.appendChild(frag);
}

/* ---------------- helpers ---------------- */

function pickRandom(arr, limit) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, limit);
}

function buildItem(templateEl, item) {
  const frag = templateEl.content.cloneNode(true);
  const root = frag.querySelector(".ticket-view-thing");

  root.querySelector('[data-role="link"]').href = `sub.html?id=${item.id}`;

  const img = root.querySelector('[data-role="poster"]');
  img.src = item.poster;
  img.alt = "";

  return root;
}
