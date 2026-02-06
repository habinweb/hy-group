export function fillPosterCard(card, item) {
  const link = card.querySelector('[data-role="link"]');
  if (link) link.href = `#${item.id}`; // 퍼블리싱 단계 임시

  const img = card.querySelector('[data-role="poster"]');
  if (img) {
    img.src = item.poster;
    img.alt = item.title;
  }

  const title = card.querySelector('[data-role="title"]');
  if (title) title.textContent = item.title;

  const date = card.querySelector('[data-role="date"]');
  if (date) date.textContent = item.date;

  const stars = card.querySelector('[data-role="stars"]');
  if (stars) {
    stars.innerHTML = "";
    for (let i = 0; i < item.rating; i++) {
      const li = document.createElement("li");
      li.className = "score";
      li.innerHTML = `<img src="img/star_49E99C.png" alt="star" />`;
      stars.appendChild(li);
    }
  }
}

export function clearPosterList(list) {
  list.innerHTML = "";
}
