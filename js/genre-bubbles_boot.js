// js/bubble-boot.js
(async function () {
  const app = window.genreBubbleApp?.init("genre-bubble-container");
  if (!app) return;

  const GRAD_OPT = { gradient: { inner: "#504399", outer: "#8670FF" } };
  const GENRES = [
    "애니",
    "드라마",
    "액션",
    "SF",
    "코미디",
    "판타지",
    "스릴러",
    "로맨스",
  ];
  const COLOR = "#8670FF";

  const baseRadius = 40;
  const specialRadius = 90;

  // ✅ 드라마를 항상 1순위로
  const specialIdx = GENRES.indexOf("드라마");

  // ✅ 고정 포스터 번호
  const FIXED_POSTER = 283;

  for (let i = 0; i < GENRES.length; i++) {
    const isSpecial = i === specialIdx;

    const color = isSpecial ? "#49e99c" : COLOR;
    const radius = isSpecial ? specialRadius : baseRadius;
    const opts = isSpecial
      ? { ...GRAD_OPT, fontWeight: 700, specialPoster: true }
      : GRAD_OPT;

    const posterNum = FIXED_POSTER;

    app.createGenreBubble(GENRES[i], color, radius, opts, i, posterNum);
  }
})();
