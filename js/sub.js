$(function () {
  /* =========================
     1) 탭
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
     2) 별점
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
     3) 밸런스 게임
  ========================= */
  const $cards = $(".a_balance_card");
  const $game = $(".a_balance_game_container");
  const $result = $(".a_balance_result_area");

  $cards.on("click", function () {
    $game.hide();
    $result.show();

    $cards.removeClass("active");
    $(this).addClass("active");
  });

  // 다시 하기 버튼
  $(".a_balance_restart_btn").on("click", function () {
    $result.hide();
    $game.show();
    $cards.removeClass("active");
  });
});
