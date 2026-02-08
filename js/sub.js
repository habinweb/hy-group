$(function () {
  /* =========================
   평점(80.2%) 정보 툴팁
========================= */

  // 아이콘 클릭 시 툴팁 토글
  $(".a_rating_percent").on("click", ".a_icon_info", function (e) {
    e.preventDefault();
    e.stopPropagation();

    const $tooltip = $(this).siblings(".a_rating_tooltip");
    $tooltip.toggleClass("active");
    $tooltip.attr("aria-hidden", !$tooltip.hasClass("active"));
  });

  // 바깥 클릭 -> 닫기
  $(document).on("click", function () {
    $(".a_rating_tooltip").removeClass("active").attr("aria-hidden", "true");
  });

  // 툴팁 자체 클릭은 닫히지 않게(선택/드래그 방지용!!)
  $(".a_rating_percent").on("click", ".a_rating_tooltip", function (e) {
    e.stopPropagation();
  });

  /* =========================
   줄거리 더보기 (짧으면 버튼 숨김)
========================= */

  $(function () {
    const $plot = $(".a_plot_value");
    const $btn = $(".a_plot_toggle_btn");
    const $wrap = $(".a_movie_forms");

    if (!$plot.length || !$btn.length) return;

    // 줄거리가 넘치지 않으면 버튼 숨김
    if ($plot[0].scrollHeight <= $plot[0].clientHeight) {
      $btn.hide();
      return;
    }

    // 더보기 / 접기
    $btn.on("click", function () {
      $wrap.toggleClass("open");
      $(this).text($wrap.hasClass("open") ? "접기" : "더보기");
    });
  });

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
    감상평 버튼(더보기/접기) + 드롭다운 정렬(개수 유지)
  ========================= */

  // 상태값: 현재 몇 개 보여줄지
  let visibleCount = 3;
  const STEP = 3;

  // 리뷰 li들 현재 DOM 순서 기준으로 visibleCount만큼!! 보이게
  function applyVisibleCount() {
    const $items = $(".review_list .review_item");
    const total = $items.length;

    // 안전장치: total보다 더 크게 잡히면 total로 제한
    if (visibleCount > total) visibleCount = total;

    $items.hide();
    $items.slice(0, visibleCount).show();

    // 버튼 텍스트: 전부 보이면 "접기", 아니면 "더보기"
    if (total <= STEP) {
      // 3개 이하라면 버튼 숨겨도 됨(원하면 display만 조절)
      $(".more_btn").hide();
    } else {
      $(".more_btn").show();
      $(".more_btn")
        .contents()
        .filter(function () {
          return this.nodeType === 3; // 텍스트 노드
        })
        .first()
        .replaceWith(visibleCount >= total ? "접기 " : "더보기 ");
    }
  }

  // 현재 선택된 정렬 타입으로 전체 리뷰 정렬해서 DOM 재배치
  function sortReviews(type) {
    const $ul = $(".review_list > ul");
    const items = $ul.children(".review_item").get();

    // 값 파싱 함수들
    const getDays = (li) => {
      // 7일 전 -> 7
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
      // 최신순: "일 전" 숫자가 작을수록 더 최신(1일 전이 최상단)
      if (type === "latest") return getDays(a) - getDays(b);

      // 별점순: 큰 값이 위로
      if (type === "rating") return getRating(b) - getRating(a);

      // 북마크순: 큰 값이 위로
      if (type === "bookmark") return getBookmark(b) - getBookmark(a);

      return 0;
    });

    $ul.append(items);

    // 정렬 후에도 현재 펼쳐진 개수 유지!!
    applyVisibleCount();
  }

  // 처음엔 3개만 보이게

  applyVisibleCount();

  // 더보기/접기 버튼
  $(".review_list").on("click", ".more_btn", function () {
    const total = $(".review_list .review_item").length;

    if (visibleCount >= total) {
      // 접기
      visibleCount = STEP;
    } else {
      // 더보기
      visibleCount += STEP;
    }
    applyVisibleCount();
  });

  // 드롭다운 열고 닫기
  $(".review_list").on("click", ".sort_btn", function () {
    $(".sort_wrap").toggleClass("open");
  });

  // 정렬 옵션 클릭
  $(".review_list").on("click", ".sort_option", function () {
    const type = $(this).data("sort"); // latest / rating / bookmark

    // 버튼 라벨 변경
    $(".sort_label").text($(this).text());

    // 드롭다운 닫기
    $(".sort_wrap").removeClass("open");

    // 정렬 실행 (개수 유지 포함)
    sortReviews(type);
  });

  // 바깥 클릭하면 드롭다운 닫기
  $(document).on("click", function (e) {
    // sort_wrap 밖을 클릭했을 때만 닫기
    if ($(e.target).closest(".sort_wrap").length === 0) {
      $(".sort_wrap").removeClass("open");
    }
  });

  /* =========================
  밸런스 게임 선택지 영화 상세 데이터
======================== */

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

  /* =========================
    밸런스 게임
======================== */

  $(".a_balance_result_area").hide();

  /* =========================
    카드 클릭 시
========================= */

  $(".a_balance_card").on("click", function () {
    // left / right 판별
    const key = $(this).hasClass("left") ? "left" : "right";
    const r = BALANCE_RESULT[key];
    if (!r) return;

    // 더미 데이터에서 영화 찾기
    const movie = dummy.find((m) => m.id === r.movieId);
    if (!movie) return;

    // 결과 메시지
    $("#a_result_message_text").text(r.msg);

    // 영화 제목
    $("#a_result_movie_title_value").text(movie.title);

    // 포스터
    $(".a_result_movie_poster").attr({
      src: movie.poster,
      alt: movie.title + " 포스터",
    });

    // 태그
    $(".a_result_tags_container").html(
      r.tags.map((t) => `<span class="a_result_tag">${t}</span>`).join(""),
    );

    // 상세 페이지 이동 (sub.js 기준: id)
    $(".a_result_view_details_btn").attr("href", `sub.html?id=${movie.id}`);

    // 화면 전환
    $(".a_balance_game_container").hide();
    $(".a_balance_result_area").show();

    // 카드 active 처리
    $(".a_balance_card").removeClass("active");
    $(this).addClass("active");
  });

  /* =========================
    카드 클릭 시
========================= */

  // $(".a_balance_card").on("click", function () {
  //   // 왼쪽 카드면 left, 아니면 right
  //   const key = $(this).hasClass("left") ? "left" : "right";

  //   // 선택한 카드에 맞는 결과 데이터 가져오기
  //   const d = RESULT[key];

  //   // 결과 메시지 텍스트 변경
  //   $("#a_result_message_text").text(d.msg);

  //   // 결과 영화 제목 변경
  //   $("#a_result_movie_title_value").text(d.title);

  //   // 결과 포스터 이미지 변경
  //   $(".a_result_movie_poster").attr({
  //     src: d.poster,
  //     alt: d.title + " 포스터",
  //   });

  //   // 태그 영역 비우고 새 태그들 넣기
  //   $(".a_result_tags_container").html(
  //     d.tags.map((t) => `<span class="a_result_tag">${t}</span>`).join(""),
  //   );

  // 2026.02.07 ?movie=${d.id}를 ?id=${d.id}로 변경했습니다 -김하빈 ===========================================
  //   $(".a_result_view_details_btn").attr("href", `sub.html?movie=${d.id}`);

  //   // 게임 선택 영역 숨기기
  //   $(".a_balance_game_container").hide();

  //   // 결과 영역 보여주기
  //   $(".a_balance_result_area").show();

  //   // active 클래스 초기화
  //   $(".a_balance_card").removeClass("active");

  //   // 클릭한 카드만 active
  //   $(this).addClass("active");
  // });

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

/* =========================
    데이터 연결
======================= */

// 더미 영화 데이터 불러오기
import { dummy } from "./data.js";

$(function () {
  // 주소창에서 영화 고유코드(id) 가져오기
  const params = new URLSearchParams(location.search);

  //2026.02.07 get("movie")를 get("id")로 변경했습니다 -김하빈 =============================================
  const id = Number(params.get("id")) || 2;

  // 해당 id의 영화 찾기
  const movie = dummy.find((m) => m.id === id);
  if (!movie) return;

  // 포스터 사진
  const posterSrc = "/" + movie.poster.replace(/^\/+/, "");
  $('[data-role="poster"]').attr("src", movie.poster);
  $('[data-role="poster"]').attr("alt", movie.title + " 포스터");

  // 플랫폼 아이콘 매칭용 객체
  const platformIcons = {
    넷플릭스: "img/netflix.png",
    왓챠: "img/watcha.png",
    웨이브: "img/wavve.png",
    티빙: "img/TVING.png",
    디즈니플러스: "img/disney.png",
    쿠팡플레이: "img/coupang.png",
  };

  //플랫폼 아이콘 렌더링 (other는 제외)
  const $platformUL = $('[data-role="platform-icons"]');

  if ($platformUL.length) {
    // 기존에 들어있던 li들 비우기(하드코딩 제거 효과)
    $platformUL.empty();

    // movie.platforms가 없을 수도 있으니 안전 처리
    const platforms = movie.platforms || [];

    platforms.forEach((name) => {
      // other는 아이콘 표시 안 함
      if (!name || name === "other") return;

      // 매핑된 아이콘 없으면 표시 안 함(안전)
      const src = platformIcons[name];
      if (!src) return;

      // li 생성해서 넣기
      const $li = $(`
        <li>
          <a href="#" target="_blank" rel="noopener">
            <img src="${src}" alt="${name}" />
          </a>
        </li>
      `);

      $platformUL.append($li);
    });

    // 아이콘이 하나도 없으면(전부 other거나 매핑 실패) UL 숨김(원하면)
    if ($platformUL.children("li").length === 0) {
      $platformUL.hide();
    } else {
      $platformUL.show();
    }
  }

  // 시험용 유튜브 (없으면 섹션 숨김)
  const $yt = $('[data-role="youtube"]');
  if ($yt.length) {
    if (movie.youtube) {
      $yt.attr("src", movie.youtube);
      $yt.closest(".media_section").show(); // 영상 섹션 유지
    } else {
      $yt.closest(".media_section").hide(); // 영상 없으면 섹션 숨김
    }
  }

  // 스틸컷 배열 (최대 4장)
  const cuts = movie.stillcuts || [];

  // 없을 시 아이콘
  const PLACEHOLDER_ICON = "img/picture_6f6c76.png";

  // 상단 배경 스틸컷 (첫 번째 스틸컷 사용, 없으면 빈 박스)
  $('[data-role="stillcuts"]').attr("src", cuts[0] || "");

  // 영상/이미지 탭 스킬컷 4칸 처리
  $("#tab_media img[data-role='skillcut']").each(function (i) {
    const hasCut = !!cuts[i];
    // 해당 칸에 스틸컷 존재 여부

    $(this)
      // 스틸컷이 있으면 이미지, 없으면 아이콘
      .attr("src", hasCut ? cuts[i] : PLACEHOLDER_ICON)

      // 스틸컷이 없을 때만 placeholder 스타일 적용
      .toggleClass("is-placeholder", !hasCut)

      // 컨택트 전용!!
      // 스틸컷이 3장이고, 4번째 칸일 때만
      // 오른쪽 아래 아이콘 크기 조절용 클래스 추가
      .toggleClass("is-third-missing", !hasCut && cuts.length === 3 && i === 3);
  });

  // 영화 제목
  $('[data-role="title"]').text(movie.title);

  // 줄거리
  $('[data-role="plot"]').text(movie.plot);

  // 별점
  $('[data-role="rating"]').text(movie.rating);

  // 연령 등급 가공
  const ageText = movie.ageRating === "all" ? "all" : `${movie.ageRating}세`;

  // 러닝타임 / 부작 가공
  const timeText =
    movie.type === "drama"
      ? `${movie.runningTime}부작`
      : `${movie.runningTime}분`;

  // 드라마일 경우 감독 / 제작 숨김
  if (movie.type === "drama") {
    $('[data-role="director"]').closest("li").hide();
    $('[data-role="production"]').closest("li").hide();
  }

  // 상세 정보 한 줄
  const detailText =
    `${ageText} · ${movie.date} · ${movie.type} · ${movie.genre.join("/")}` +
    ` ${timeText}`;

  //상세 정보 한 줄 텍스트
  $('.a_details_value[data-role="optional"]').text(detailText);

  // 개별 정보 바인딩
  $('[data-role="date"]').text(movie.date);
  $('[data-role="type"]').text(movie.type);
  $('[data-role="genre"]').text(movie.genre.join("/"));
  $('[data-role="director"]').text(movie.director);
  $('[data-role="production"]').text(movie.production);
  $('[data-role="runningTime"]').text(movie.runningTime + "분");
  $('[data-role="platforms"]').text(movie.platforms.join(", "));
  $('[data-role="ageRating"]').text(movie.ageRating);
});
