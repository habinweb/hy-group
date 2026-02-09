import { dummy } from "./data.js";

$(function () {
  /* =========================
     1) Rating tooltip (percent info)
  ========================= */
  $(".a_rating_percent").on("click", ".a_icon_info", function (e) {
    e.preventDefault();
    e.stopPropagation();

    const $tooltip = $(this).siblings(".a_rating_tooltip");
    $tooltip.toggleClass("active");
    $tooltip.attr("aria-hidden", !$tooltip.hasClass("active"));
  });

  $(document).on("click", function () {
    $(".a_rating_tooltip").removeClass("active").attr("aria-hidden", "true");
  });

  $(".a_rating_percent").on("click", ".a_rating_tooltip", function (e) {
    e.stopPropagation();
  });

  /* =========================
     2) Plot "more/less" (hide if not overflow)
  ========================= */
  $(function () {
    // 1) 이벤트 위임: 나중에 DOM이 로드되어도 동작
    $(document).on("click", ".a_plot_toggle_btn", function () {
      const $wrap = $(this).closest(".a_movie_forms");
      $wrap.toggleClass("open");
      $(this).text($wrap.hasClass("open") ? "접기" : "더보기");
    });

    function updatePlotToggleButtons() {
      $(".a_movie_forms").each(function () {
        const $wrap = $(this);
        const $plot = $wrap.find(".a_plot_value");
        const $btn = $wrap.find(".a_plot_toggle_btn");

        if (!$plot.length || !$btn.length) return;

        $wrap.removeClass("open");
        const closedH = $plot[0].getBoundingClientRect().height;

        $wrap.addClass("open");
        const openH = $plot[0].getBoundingClientRect().height;

        $wrap.removeClass("open");
        $btn.text("더보기");

        if (openH <= closedH + 1) {
          $btn.hide();
        } else {
          $btn.show();
        }
      });
    }

    updatePlotToggleButtons();

    $(window).on("resize", function () {
      updatePlotToggleButtons();
    });
  });

  /* =========================
     3) Tabs (info / review / media)
  ========================= */
  const $tabMenus = $(".tab_menu li");
  const $tabContents = $(".tab_content");

  $tabMenus.removeClass("b_active").first().addClass("b_active");
  $tabContents.removeClass("b_active").hide();
  $("#tab_info").addClass("b_active").show();

  $(".tab_menu li button").on("click", function () {
    const idx = $(this).parent().index();

    $tabMenus.removeClass("b_active");
    $(this).parent().addClass("b_active");

    $tabContents.removeClass("b_active").hide();
    $tabContents.eq(idx).addClass("b_active").show();
  });

  /* =========================
     4) Review guide popup (i icon)
  ========================= */
  $("#tab_review").on("click", 'img[alt="i_icon"]', function (e) {
    e.preventDefault();

    const $popup = $(this)
      .closest(".review_login, .review_unlogin")
      .find(".iicon_popup")
      .first();

    $popup.toggleClass("active");
  });

  /* =========================
     5) Star rating UI (client-side)
  ========================= */
  $(".star_rating .star").on("click", function () {
    const rating = Number($(this).data("value"));
    const $wrap = $(this).closest(".star_rating");
    const $stars = $wrap.find(".star");

    $stars.attr("src", "img/star_6f6c76.png");

    $stars.each(function (index) {
      if (index < rating) $(this).attr("src", "img/star_49E99C.png");
    });
  });

  /* =========================
     6) Review list: show more/less + sort (keep visibleCount)
  ========================= */
  let visibleCount = 3;
  const STEP = 3;

  function applyVisibleCount() {
    const $items = $(".review_list .review_item");
    const total = $items.length;

    if (visibleCount > total) visibleCount = total;

    $items.hide();
    $items.slice(0, visibleCount).show();

    if (total <= STEP) {
      $(".more_btn").hide();
      return;
    }

    $(".more_btn").show();
    $(".more_btn")
      .contents()
      .filter((_, node) => node.nodeType === 3)
      .first()
      .replaceWith(visibleCount >= total ? "접기 " : "더보기 ");
  }

  function sortReviews(type) {
    const $ul = $(".review_list > ul");
    const items = $ul.children(".review_item").get();

    const getDays = (li) => {
      const t = $(li).find(".date").text();
      const n = parseInt(t, 10);
      return Number.isNaN(n) ? 999999 : n;
    };

    const getRating = (li) => {
      const t = $(li).find(".score").clone().children().remove().end().text();
      const n = parseFloat(t);
      return Number.isNaN(n) ? -999999 : n;
    };

    const getBookmark = (li) => {
      const t = $(li)
        .find(".bookmark_btn")
        .clone()
        .children()
        .remove()
        .end()
        .text();
      const n = parseInt(t.replace("+", "").trim(), 10);
      return Number.isNaN(n) ? -999999 : n;
    };

    items.sort((a, b) => {
      if (type === "latest") return getDays(a) - getDays(b);
      if (type === "rating") return getRating(b) - getRating(a);
      if (type === "bookmark") return getBookmark(b) - getBookmark(a);
      return 0;
    });

    $ul.append(items);
    applyVisibleCount();
  }

  applyVisibleCount();

  $(".review_list").on("click", ".more_btn", function () {
    const total = $(".review_list .review_item").length;
    visibleCount = visibleCount >= total ? STEP : visibleCount + STEP;
    applyVisibleCount();
  });

  $(".review_list").on("click", ".sort_btn", function () {
    $(".sort_wrap").toggleClass("open");
  });

  $(".review_list").on("click", ".sort_option", function () {
    const type = $(this).data("sort");
    $(".sort_label").text($(this).text());
    $(".sort_wrap").removeClass("open");
    sortReviews(type);
  });

  $(document).on("click", function (e) {
    if ($(e.target).closest(".sort_wrap").length === 0) {
      $(".sort_wrap").removeClass("open");
    }
  });

  /* =========================
     7) Balance game: result mapping (by movieId)
  ========================= */
  const BALANCE_RESULT = {
    left: {
      movieId: 101,
      msg: "마법 같은 분위기에 끌리는 당신에게 어울리는 작품..",
      tags: ["#애니메이션", "#자매", "#영화", "#마법", "#겨울", "#디즈니"],
    },
    right: {
      movieId: 102,
      msg: "정의와 사명감을 가진 당신에게 어울리는 작품..",
      tags: ["#애니메이션", "#영화", "#겨울", "#모험", "#가족", "#드림웍스"],
    },
  };

  $(".a_balance_result_area").hide();

  $(".a_balance_card").on("click", function () {
    const key = $(this).hasClass("left") ? "left" : "right";
    const r = BALANCE_RESULT[key];
    if (!r) return;

    const movie = dummy.find((m) => m.id === r.movieId);
    if (!movie) return;

    $("#a_result_message_text").text(r.msg);
    $("#a_result_movie_title_value").text(movie.title);

    $(".a_result_movie_poster").attr({
      src: movie.poster,
      alt: movie.title + " 포스터",
    });

    $(".a_result_tags_container").html(
      r.tags.map((t) => `<span class="a_result_tag">${t}</span>`).join(""),
    );

    $(".a_result_view_details_btn").attr("href", `sub.html?id=${movie.id}`);

    $(".a_balance_game_container").hide();
    $(".a_balance_result_area").show();

    $(".a_balance_card").removeClass("active");
    $(this).addClass("active");
  });

  $(".a_balance_restart_btn").on("click", function () {
    $(".a_balance_result_area").hide();
    $(".a_balance_game_container").show();
    $(".a_balance_card").removeClass("active");
  });

  /* =========================
     8) Login required popup (like/hate/register)
  ========================= */
  function openLoginPopup() {
    $("#login_popup").addClass("active").attr("aria-hidden", "false");
  }

  $("#tab_info").on("click", ".like_btn, .hate_btn", function (e) {
    e.preventDefault();
    openLoginPopup();
  });

  $("#tab_review").on("click", ".register_btn", function (e) {
    e.preventDefault();
    openLoginPopup();
  });

  $(document).on("click", ".login_btn_cancel", function () {
    $("#login_popup").removeClass("active").attr("aria-hidden", "true");
  });

  $(document).on("click", ".login_btn_go", function () {
    location.href = "form.html";
  });
});

/* =========================
   9) Data binding: movie detail by querystring id
========================= */
$(function () {
  const params = new URLSearchParams(location.search);
  const id = Number(params.get("id")) || 2;

  const movie = dummy.find((m) => m.id === id);
  if (!movie) return;

  // Poster
  $('[data-role="poster"]').attr("src", movie.poster);
  $('[data-role="poster"]').attr("alt", movie.title + " 포스터");

  // Platforms (icon mapping)
  const platformIcons = {
    넷플릭스: "img/netflix.png",
    왓챠: "img/watcha.png",
    웨이브: "img/wavve.png",
    티빙: "img/TVING.png",
    디즈니플러스: "img/disney.png",
    쿠팡플레이: "img/coupang.png",
  };

  const $platformUL = $('[data-role="platform-icons"]');
  if ($platformUL.length) {
    $platformUL.empty();

    (movie.platforms || []).forEach((name) => {
      if (!name || name === "other") return;
      const src = platformIcons[name];
      if (!src) return;

      $platformUL.append(`
        <li>
          <a href="#" target="_blank" rel="noopener">
            <img src="${src}" alt="${name}" />
          </a>
        </li>
      `);
    });

    $platformUL.toggle($platformUL.children("li").length > 0);
  }

  // Youtube
  const $yt = $('[data-role="youtube"]');
  if ($yt.length) {
    if (movie.youtube) {
      $yt.attr("src", movie.youtube);
      $yt.closest(".media_section").show();
    } else {
      $yt.closest(".media_section").hide();
    }
  }

  // Stillcuts (up to 4)
  const cuts = movie.stillcuts || [];
  const PLACEHOLDER_ICON = "img/picture_6f6c76.png";

  $('[data-role="stillcuts"]').attr("src", cuts[0] || "");

  $("#tab_media img[data-role='skillcut']").each(function (i) {
    const hasCut = !!cuts[i];

    $(this)
      .attr("src", hasCut ? cuts[i] : PLACEHOLDER_ICON)
      .toggleClass("is-placeholder", !hasCut)
      .toggleClass("is-third-missing", !hasCut && cuts.length === 3 && i === 3);
  });

  // Text fields
  $('[data-role="title"]').text(movie.title);
  $('[data-role="plot"]').text(movie.plot);
  $('[data-role="rating"]').text(movie.rating);

  const ageText = movie.ageRating === "all" ? "all" : `${movie.ageRating}세`;
  const timeText =
    movie.type === "drama"
      ? `${movie.runningTime}부작`
      : `${movie.runningTime}분`;

  if (movie.type === "drama") {
    $('[data-role="director"]').closest("li").hide();
    $('[data-role="production"]').closest("li").hide();
  }

  const detailText =
    `${ageText} · ${movie.date} · ${movie.type} · ${movie.genre.join("/")}` +
    ` ${timeText}`;

  $('.a_details_value[data-role="optional"]').text(detailText);

  $('[data-role="date"]').text(movie.date);
  $('[data-role="type"]').text(movie.type);
  $('[data-role="genre"]').text(movie.genre.join("/"));
  $('[data-role="director"]').text(movie.director);
  $('[data-role="production"]').text(movie.production);
  $('[data-role="runningTime"]').text(movie.runningTime + "분");
  $('[data-role="platforms"]').text(movie.platforms.join(", "));
  $('[data-role="ageRating"]').text(movie.ageRating);
});
