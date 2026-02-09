import { dummy } from "./data.js";

(function () {
  // 장르 버블 앱 초기화
  const app = window.genreBubbleApp?.init("genre-bubble-container");
  if (!app) return;

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

  const BASE_COLOR = "#8670FF";
  const SPECIAL_COLOR = "#49e99c";

  const BASE_RADIUS = 45;
  const SPECIAL_RADIUS = 95;

  const GRAD_OPT = {
    gradient: { inner: "#504399", outer: "#8670FF" },
  };

  // 드라마 버블만 특별 처리
  const specialIdx = GENRES.indexOf("드라마");

  /* ===== utils ===== */

  const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const getRandomImage = (item) =>
    Array.isArray(item?.stillcuts) && item.stillcuts.length
      ? pickRandom(item.stillcuts)
      : null;

  /* ===== 드라마 랜덤 이미지 ===== */

  const dramaItems = dummy.filter(
    (item) =>
      item.genre?.includes("드라마") &&
      Array.isArray(item.stillcuts) &&
      item.stillcuts.length,
  );

  const randomDrama = dramaItems.length ? pickRandom(dramaItems) : null;
  const imageSrc = randomDrama ? getRandomImage(randomDrama) : null;

  /* ===== 버블 생성 ===== */

  GENRES.forEach((label, idx) => {
    const isSpecial = idx === specialIdx;

    const color = isSpecial ? SPECIAL_COLOR : BASE_COLOR;
    const radius = isSpecial ? SPECIAL_RADIUS : BASE_RADIUS;

    const options = isSpecial
      ? {
          ...GRAD_OPT,
          fontWeight: 700,
          specialPoster: true,
          imageSrc,
        }
      : GRAD_OPT;

    app.createGenreBubble(label, color, radius, options, idx);
  });
})();
