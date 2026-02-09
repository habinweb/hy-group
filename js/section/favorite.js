import { dummy } from "../data.js";

const SELECTOR = {
  list: ".favorite-list-box",
  template: "#favoriteItemTemplate",
  genre: '[data-role="genre"]',
  item: ".favorite-thing",
  more: ".favorite-more",
  link: '[data-role="link"]',
  poster: '[data-role="poster"]',
};

const MAX_ITEMS = 7;

export function initFavoriteSection() {
  const list = document.querySelector(SELECTOR.list);
  if (!list) return;

  const templateEl = document.querySelector(SELECTOR.template);
  if (!templateEl) return;

  const targetGenre = getTargetGenre();
  if (!targetGenre) return;

  const moreEl = list.querySelector(SELECTOR.more);

  clearItems(list);

  const items = pickItemsByGenre(dummy, targetGenre, MAX_ITEMS);
  items.forEach((item) => {
    const card = createCard(templateEl, item);
    if (!card) return;

    insertCard(list, card, moreEl);
  });
}

function getTargetGenre() {
  const genreEl = document.querySelector(SELECTOR.genre);
  return (genreEl?.textContent ?? "").trim();
}

function clearItems(listEl) {
  listEl
    .querySelectorAll(`${SELECTOR.item}:not(${SELECTOR.more})`)
    .forEach((el) => el.remove());
}

function pickItemsByGenre(data, genre, limit) {
  return [...data]
    .filter((item) => Array.isArray(item.genre) && item.genre.includes(genre))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, limit);
}

function createCard(templateEl, item) {
  const fragment = templateEl.content.cloneNode(true);
  const card = fragment.querySelector(SELECTOR.item);
  if (!card) return null;

  const link = card.querySelector(SELECTOR.link);
  const img = card.querySelector(SELECTOR.poster);

  if (link) link.href = `sub.html?id=${item.id}`;
  if (img) {
    img.src = item.poster;
    img.alt = ""; // 장식용이면 OK. 정보용이면 item.title 권장.
  }

  return card;
}

function insertCard(listEl, cardEl, moreEl) {
  if (moreEl) listEl.insertBefore(cardEl, moreEl);
  else listEl.appendChild(cardEl);
}
