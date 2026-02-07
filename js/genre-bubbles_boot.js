// js/bubble-boot.js
// ✅ 드라마(genre.includes("드라마")) 작품 중 랜덤 1개를 뽑고,
// ✅ 그 작품의 stillcuts(있으면)에서 랜덤 1장을 "드라마 버블" 이미지로 전달

import { dummy } from "./data.js";

(function () {
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
  const baseRadius = 45;
  const specialRadius = 95;

  // ✅ "드라마" 버블만 special
  const specialIdx = GENRES.indexOf("드라마");

  // ===== 유틸 =====
  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function getRandomImage(item) {
    if (Array.isArray(item?.stillcuts) && item.stillcuts.length > 0) {
      return pickRandom(item.stillcuts);
    }
    return null;
  }

  // ===== 드라마 데이터 랜덤 =====
  const dramaItems = dummy.filter(
    (item) =>
      item.genre?.includes("드라마") &&
      Array.isArray(item.stillcuts) &&
      item.stillcuts.length,
  );

  const randomDrama = dramaItems.length ? pickRandom(dramaItems) : null;

  // ✅ 드라마 버블에 들어갈 이미지 소스 (stillcuts 우선)
  const imageSrc = randomDrama ? getRandomImage(randomDrama) : null;

  console.log("드라마 랜덤:", randomDrama?.id, randomDrama?.title);
  console.log("드라마 이미지:", imageSrc);

  // ===== 버블 생성 =====
  for (let i = 0; i < GENRES.length; i++) {
    const isSpecial = i === specialIdx;

    const color = isSpecial ? "#49e99c" : COLOR;
    const radius = isSpecial ? specialRadius : baseRadius;

    const opts = isSpecial
      ? {
          ...GRAD_OPT,
          fontWeight: 700,
          specialPoster: true,
          imageSrc, // ✅ 드라마 버블에만 전달
        }
      : GRAD_OPT;

    app.createGenreBubble(GENRES[i], color, radius, opts, i);
  }
})();
