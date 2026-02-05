$(function () {
  /* =========================
    탭
  ========================= */

  const $tabMenus = $(".tab_menu li");
  const $tabContents = $(".tab_content");

  // 초기: 1번 탭만 보이기
  $tabMenus.removeClass("b_active").first().addClass("b_active");
  $tabContents.removeClass("b_active").hide();
  $("#tab_info").addClass("b_active").show();

  // 탭 클릭
  $(".tab_menu li button").on("click", function () {
    const idx = $(this).parent().index();

    $tabMenus.removeClass("b_active");
    $(this).parent().addClass("b_active");

    $tabContents.removeClass("b_active").hide();
    $tabContents.eq(idx).addClass("b_active").show();
  });

  /* =========================
    감상평 안내창
  ======================== */

  // 아이콘(i) 클릭했을 때 안내 팝업 토글
  $("#tab_review").on("click", 'img[alt="i_icon"]', function (e) {
    e.preventDefault();

    // 로그인 / 비로그인 영역 기준 팝업 찾기
    const $popup = $(this)
      .closest(".review_login, .review_unlogin")
      .find(".iicon_popup")
      .first();

    $popup.toggleClass("active");
  });

  /* =========================
    별점
  ========================= */

  $(".star_rating .star").on("click", function () {
    const rating = Number($(this).data("value"));
    const $wrap = $(this).closest(".star_rating");
    const $stars = $wrap.find(".star");

    // 전부 회색
    $stars.attr("src", "img/star_6f6c76.png");

    // 클릭한 별까지 초록
    $stars.each(function (index) {
      if (index < rating) {
        $(this).attr("src", "img/star_49E99C.png");
      }
    });
  });

  /* =========================
    감상평 드롭다운 정렬
  ========================= */

  $(function () {
    // 정렬 버튼 클릭 -> 드롭다운 동작
    $(".sort_btn").click(() => $(".sort_wrap").toggleClass("open"));

    // 정렬 옵션 클릭
    $(".sort_option").click(function () {
      const type = $(this).data("sort"); // latest / rating / bookmark

      // 버튼 텍스트 변경
      $(".sort_label").text($(this).text());

      // 드롭다운 닫기
      $(".sort_wrap").removeClass("open");

      // 리뷰 리스트 ul
      const $ul = $(".review_list > ul");

      // 정렬 대상 리뷰 li들
      const items = $ul.children(".review_item").get();

      // 정렬 기준에 따라 li 순서 변경
      items.sort((a, b) => {
        // 최신순
        if (type === "latest")
          return (
            parseInt($(a).find(".date").text()) -
            parseInt($(b).find(".date").text())
          );

        // 별점순
        if (type === "rating")
          return (
            parseFloat($(b).find(".score").text()) -
            parseFloat($(a).find(".score").text())
          );

        // 북마크순
        if (type === "bookmark")
          return (
            parseInt($(b).find(".bookmark_btn").text()) -
            parseInt($(a).find(".bookmark_btn").text())
          );
      });

      // 정렬된 순서로 다시 DOM에 삽입
      $ul.append(items);
    });
  });

  /* =========================
    밸런스 게임
======================== */

  // 카드별 대응하는 결과 미리 적어둠
  const RESULT = {
    left: {
      msg: "마법 같은 분위기에 끌리는 당신에게 어울리는 작품..",
      title: "겨울왕국",
      poster: "img/poster/poster_겨울왕국.jpg",
      tags: ["#애니메이션", "#영화", "#마법", "#겨울", "#디즈니"],
    },
    right: {
      msg: "정의와 사명감을 가진 당신에게 어울리는 작품..",
      title: "가디언즈",
      poster: "img/poster/poster_가디언즈.jpg",
      tags: ["#애니메이션", "#영화", "#모험", "#크리스마스", "#가족"],
    },
  };

  /* =========================
    카드 클릭 시
========================= */

  $(".a_balance_card").on("click", function () {
    // 왼쪽 카드면 left, 아니면 right
    const key = $(this).hasClass("left") ? "left" : "right";

    // 선택한 카드에 맞는 결과 데이터 가져오기
    const d = RESULT[key];

    // 결과 메시지 텍스트 변경
    $("#a_result_message_text").text(d.msg);

    // 결과 영화 제목 변경
    $("#a_result_movie_title_value").text(d.title);

    // 결과 포스터 이미지 변경
    $(".a_result_movie_poster").attr({
      src: d.poster,
      alt: d.title + " 포스터",
    });

    // 태그 영역 비우고 새 태그들 넣기
    $(".a_result_tags_container").html(
      d.tags.map((t) => `<span class="a_result_tag">${t}</span>`).join(""),
    );

    // 게임 선택 영역 숨기기
    $(".a_balance_game_container").hide();

    // 결과 영역 보여주기
    $(".a_balance_result_area").show();

    // active 클래스 초기화
    $(".a_balance_card").removeClass("active");

    // 클릭한 카드만 active
    $(this).addClass("active");
  });

  /* =========================
    다시 하기 버튼
========================= */

  $(".a_balance_restart_btn").on("click", function () {
    // 결과 숨기기
    $(".a_balance_result_area").hide();

    // 다시 선택 화면 보여주기
    $(".a_balance_game_container").show();

    // 카드 active 초기화
    $(".a_balance_card").removeClass("active");
  });

  /* =========================
    로그인 유도 팝업
======================= */

  // 팝업 열기
  function openLoginPopup() {
    $("#login_popup").addClass("active").attr("aria-hidden", "false");
  }

  // 추천해요/별로예요 누르면 팝업
  $("#tab_info").on("click", ".like_btn, .hate_btn", function (e) {
    e.preventDefault();
    openLoginPopup();
  });

  // 등록하기 누르면 팝업
  $("#tab_review").on("click", ".register_btn", function (e) {
    e.preventDefault();
    openLoginPopup();
  });

  // 괜찮아요 -> 닫기
  $(document).on("click", ".login_btn_cancel", function () {
    $("#login_popup").removeClass("active").attr("aria-hidden", "true");
  });

  // 로그인 할게요 -> 이동
  $(document).on("click", ".login_btn_go", function () {
    location.href = "form.html";
  });
});

// ===================================================================
// 밸런스 게임 + 다시 하기 수정하기 전 기존 코드입니다. html 도 함께 백업중입니다!!

/* =========================
     4) 밸런스 게임
  ========================= */

// const $cards = $(".a_balance_card");
// const $game = $(".a_balance_game_container");
// const $result = $(".a_balance_result_area");

// $cards.on("click", function () {
//   $game.hide();
//   $result.show();

//   $cards.removeClass("active");
//   $(this).addClass("active");
// });

/* =========================
  // 5) 다시 하기 버튼
    ========================= */
// $(".a_balance_restart_btn").on("click", function () {
//   $result.hide();
//   $game.show();
//   $cards.removeClass("active");
// });
