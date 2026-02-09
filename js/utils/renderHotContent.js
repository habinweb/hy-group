const MAX_STARS = 5;

export function fillPosterCard(card, item) {
  const link = card.querySelector('[data-role="link"]');
  if (link) link.href = `sub.html?id=${item.id}`;

  const img = card.querySelector('[data-role="poster"]');
  if (img) {
    img.src = item.poster;
    img.alt = "";
  }

  const title = card.querySelector('[data-role="title"]');
  if (title) title.textContent = item.title;

  const date = card.querySelector('[data-role="date"]');
  if (date) date.textContent = item.date;

  const stars = card.querySelector('[data-role="stars"]');
  if (!stars) return;

  stars.innerHTML = "";

  for (let i = 0; i < MAX_STARS; i++) {
    const li = document.createElement("li");
    li.className = "score";

    const img = document.createElement("img");

    if (i < item.rating) {
      img.src = "img/star_49E99C.png";
      img.alt = "별점";
    } else {
      img.src = "img/star_6f6c76.png";
      img.alt = "빈 별";
    }

    li.appendChild(img);
    stars.appendChild(li);
  }
}

export function clearPosterList(list) {
  list.innerHTML = "";
}
