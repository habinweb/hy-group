$(function () {
  /* =========================
     helpers
  ========================= */

  // "방금 전" / "3일 전" / "1주 전" → 일(day) 숫자
  const toDays = (text = "") => {
    const t = text.trim();
    if (t.includes("방금")) return 0;

    const day = t.match(/(\d+)\s*일/);
    if (day) return Number(day[1]);

    const week = t.match(/(\d+)\s*주/);
    if (week) return Number(week[1]) * 7;

    return 999999; // 알 수 없는 형식은 가장 오래된 값으로
  };

  // 요소의 "텍스트만" 뽑아서 숫자로 변환 (img 등 자식 제거)
  const numFrom = ($el, isFloat = false) => {
    const txt = $el.clone().children().remove().end().text();
    const val = isFloat
      ? parseFloat(txt)
      : parseInt(txt.replace("+", "").trim(), 10);
    return Number.isNaN(val) ? -999999 : val;
  };

  /* =========================
     리뷰 정렬
  ========================= */

  function sortReviews(type) {
    const $ul = $(".review_ul");
    const items = $ul.children(".review_item").get();

    const getVal = {
      latest: (li) => -toDays($(li).find(".date").text()),
      rating: (li) => numFrom($(li).find(".score"), true),
      bookmark: (li) => numFrom($(li).find(".bookmark_btn")),
    };

    items.sort((a, b) => getVal[type](b) - getVal[type](a));

    $ul.append(items);

    // 정렬 후에도 "현재 보이는 개수" 유지
    applyVisibleCount();
  }

  /* =========================
     드롭다운 UI
  ========================= */

  // 버튼 클릭: 드롭다운 토글
  $(document).on("click", ".sort_btn", function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).closest(".sort_wrap").toggleClass("open");
  });

  // 드롭다운 내부 클릭은 바깥 클릭 닫기 방지
  $(document).on("click", ".sort_wrap", (e) => e.stopPropagation());

  // 바깥 클릭: 닫기
  $(document).on("click", () => $(".sort_wrap").removeClass("open"));

  // 옵션 클릭: 라벨 교체 + 정렬 + 닫기
  $(document).on("click", ".sort_option", function (e) {
    e.preventDefault();

    const $wrap = $(this).closest(".sort_wrap");
    const type = $(this).data("sort"); // latest / rating / bookmark
    const label = $(this).text().trim();

    $(".sort_option").removeClass("active");
    $(this).addClass("active");

    // 이미지 유지하면서 텍스트 노드만 교체
    $wrap
      .find(".sort_btn")
      .contents()
      .filter((_, node) => node.nodeType === 3)
      .first()
      .replaceWith(label + " ");

    $wrap.removeClass("open");
    sortReviews(type);
  });

  /* =========================
     더보기 / 접기
  ========================= */

  const STEP = 6;
  let visibleCount = STEP;

  function applyVisibleCount() {
    const $items = $(".review_item");
    const total = $items.length;

    if (visibleCount > total) visibleCount = total;

    $items.hide();
    $items.slice(0, visibleCount).show();

    $(".review_more_btn").text(visibleCount >= total ? "접기" : "더보기");
  }

  applyVisibleCount();

  $(document).on("click", ".review_more_btn", function () {
    const total = $(".review_item").length;

    // 접기 상태로 전환
    if (visibleCount >= total) {
      visibleCount = STEP;
      applyVisibleCount();

      const top = $("#review_container").length
        ? $("#review_container").offset().top - 60
        : $(".review_list").offset().top - 60;

      $("html, body").stop().animate({ scrollTop: top }, 350);
      return;
    }

    // 더보기: STEP씩 증가
    visibleCount += STEP;
    applyVisibleCount();
  });
});
