$(function () {
  /* =========================
  드롭다운 정렬 버튼
========================= */

  // 날짜 텍스트 -> "일" 숫자로 변환 ("3일 전", "1주 전")
  const toDays = (text = "") => {
    const t = text.trim();
    if (t.includes("방금")) return 0;

    const day = t.match(/(\d+)\s*일/);
    if (day) return +day[1];

    const week = t.match(/(\d+)\s*주/);
    if (week) return +week[1] * 7;

    return 999999;
  };

  // 숫자만 뽑기(자식 img 제거 후 text)
  const numFrom = ($el, isFloat = false) => {
    const txt = $el.clone().children().remove().end().text();
    const n = isFloat
      ? parseFloat(txt)
      : parseInt(txt.replace("+", "").trim(), 10);
    return Number.isNaN(n) ? (isFloat ? -999999 : -999999) : n;
  };

  // 정렬 실행(정렬 후 더보기 상태 유지)
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
    applyVisibleCount();
    // 정렬 후 현재 보이는 개수 유지
  }

  // 드롭다운 열기/닫기
  $(document).on("click", ".sort_btn", function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).closest(".sort_wrap").toggleClass("open");
  });

  // 드롭다운 영역 클릭은 바깥 클릭 닫기 막기
  $(document).on("click", ".sort_wrap", (e) => e.stopPropagation());

  // 바깥 클릭하면 닫기
  $(document).on("click", () => $(".sort_wrap").removeClass("open"));

  // 옵션 클릭 → 라벨 변경 + 정렬 + 닫기
  $(document).on("click", ".sort_option", function (e) {
    e.preventDefault();

    const $wrap = $(this).closest(".sort_wrap");
    const type = $(this).data("sort");
    const label = $(this).text().trim();

    $(".sort_option").removeClass("active");
    $(this).addClass("active");

    $wrap
      .find(".sort_btn")
      .contents()
      .filter((_, node) => node.nodeType === 3)
      .first()
      .replaceWith(label + " ");

    $wrap.removeClass("open");
    sortReviews(type);
  });

  //옵션 클릭

  $(document).on("click", ".sort_option", function (e) {
    e.preventDefault();

    const type = $(this).data("sort");
    // latest / rating / bookmark
    const label = $(this).text().trim();

    // active 표시 이동
    $(".sort_option").removeClass("active");
    $(this).addClass("active");

    // 버튼 라벨 변경 (이미지 유지: 텍스트 노드만 교체)
    const $btn = $(this).closest(".sort_wrap").find(".sort_btn");
    $btn
      .contents()
      .filter(function () {
        return this.nodeType === 3;
        // 텍스트 노드
      })
      .first()
      .replaceWith(label + " ");

    // 드롭다운 닫기
    $(this).closest(".sort_wrap").removeClass("open");

    // 정렬 실행
    sortReviews(type);
  });

  /* =========================
  더보기 / 접기 버튼
========================= */

  // 초기 설정
  const STEP = 6;
  // 한 번에 보여줄 개수
  let visibleCount = 6;
  // 처음엔 6개

  // 현재 기준으로 리뷰 표시
  function applyVisibleCount() {
    const $items = $(".review_item");
    const total = $items.length;

    if (visibleCount > total) visibleCount = total;

    $items.hide();

    $items.slice(0, visibleCount).show();

    // 버튼 텍스트 변경
    if (visibleCount >= total) {
      $(".review_more_btn").text("접기");
    } else {
      $(".review_more_btn").text("더보기");
    }
  }

  // 초기 실행
  applyVisibleCount();

  // 더보기 / 접기 버튼 클릭
  $(document).on("click", ".review_more_btn", function () {
    const total = $(".review_item").length;

    if (visibleCount >= total) {
      // 접기 -> 기본 상태(6개)
      visibleCount = STEP;
      applyVisibleCount();

      // 접기 누르면 상단으로 자연스럽게 이동
      const top = $("#review_container").length
        ? $("#review_container").offset().top - 60
        : $(".review_list").offset().top - 60;

      $("html, body").stop().animate({ scrollTop: top }, 350);
      return;
    }

    // 더보기 -> 6개씩 증가
    visibleCount += STEP;
    applyVisibleCount();
  });
});
