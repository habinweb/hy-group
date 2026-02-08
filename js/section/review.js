import { dummy } from "../data.js";

const reviews = [
  {
    user: "취준생은광광울어",
    text: "직장을 다니고 있는 분들의 고충이 너무 잘 느껴져서 힘들지만 재밌어요",
  },
  {
    user: "밤산책러",
    text: "그 어떤 불행한 시대에도 행복하고자 하는 마음이 죄였던 시절은 없다. 주인아! 계속 행복해도 돼!",
  },
  {
    user: "필름러버",
    text: "어쩌면 미래의 나라면 답을 알고 있을 문제에 갇혀버린 현재의 나",
  },
  {
    user: "드라마사냥꾼",
    text: "그 시절 향수가 물씬~ 두번 봐도 재미 있네요 딸도 재미 있대요",
  },
];

export function initReviewCards() {
  const list = document.querySelector("#reviewCardBox");
  if (!list) return;

  const templateEl = document.querySelector("#reviewCardTemplate");
  if (!templateEl) return;

  list.querySelectorAll(".review-card").forEach((el) => el.remove());

  const items = [...dummy]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);

  items.forEach((item, idx) => {
    const fragment = templateEl.content.cloneNode(true);
    const card = fragment.querySelector(".review-card");
    if (!card) return;

    const link = card.querySelector('[data-role="link"]');
    const img = card.querySelector('[data-role="poster"]');
    const title = card.querySelector('[data-role="title"]');

    if (link) link.href = `sub.html?id=${item.id}`;
    if (img) {
      img.src = item.poster;
      img.alt = "";
    }
    if (title) title.textContent = item.title;

    const reviewUser = card.querySelector('[data-role="reviewUser"]');
    const reviewText = card.querySelector('[data-role="reviewText"]');

    if (reviewUser) reviewUser.textContent = reviews[idx]?.user ?? "";
    if (reviewText) reviewText.textContent = reviews[idx]?.text ?? "";

    list.appendChild(fragment);
  });
}
