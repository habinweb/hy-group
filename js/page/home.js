import { initFavoriteSection } from "../section/favorite.js";
import { initHotSections } from "../section/hotContent.js";
import { initReviewCards } from "../section/review.js";
document.addEventListener("DOMContentLoaded", () => {
  initFavoriteSection();
  initHotSections();
  initReviewCards();
});
