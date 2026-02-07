// 0206 원본 코드 백업용

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

  $(".a_result_view_details_btn").attr("href", `sub.html?movie=${d.id}`);

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
  밸런스 게임 선택지 영화 상세 데이터(세부 페이지 교체용)
======================== */

const MOVIES = {
  frozen: {
    title: "겨울왕국",
    genres: ["애니메이션", "판타지"],
    director: "크리스 벅, 제니퍼 리",
    production: "디즈니",
    distributor: "월트 디즈니 픽처스",
    release: "2014-01-16",
    runtimeMin: 102,
    streamingText: "디즈니 플러스",
    rating: "전체관람가",
    type: "영화",
    plot: "자매의 사랑과 희생, 마법과 모험 속에서 서로를 지켜가는 이야기로, 엘사가 스스로의 힘을 이해하고 가족과 화해하는 과정을 보여준다.",
    poster: "img/poster/poster_겨울왕국.jpg",

    backdrop: null,

    stills: [
      "img/stillcut/stillcut_겨울왕국.jpg",
      "img/stillcut/stillcut_겨울왕국2.jpg",
      "img/stillcut/stillcut_겨울왕국3.jpg",
      "img/stillcut/stillcut_겨울왕국4.jpg",
    ],

    // iframe용 embed
    trailer: "https://www.youtube.com/embed/9lqZM7G1ZiM",
  },

  guardians: {
    title: "가디언즈",
    genres: ["애니메이션", "판타지"],
    director: "피터 램지",
    production: "드림웍스 애니메이션",
    distributor: "UPI 코리아",
    release: "2012-11-28",
    runtimeMin: 97,
    streamingText: "넷플릭스, 티빙, 웨이브, 라프텔",
    rating: "전체 관람가",
    type: "영화",
    plot: "산타, 부활절 토끼 등 전설 속 영웅들이 악당 '피치'로부터 아이들의 꿈을 지킨다.",
    poster: "img/poster/poster_가디언즈.jpg",

    backdrop: null,

    stills: [
      "img/stillcut/stillcut_가디언즈.jpg",
      "img/stillcut/stillcut_가디언즈2.jpg",
      "img/stillcut/stillcut_가디언즈3.jpg",
      "img/stillcut/stillcut_가디언즈4.jpg",
    ],

    trailer: "https://www.youtube.com/embed/aPLiBxhoug0",
  },
};

/* =========================
  세부 페이지: URL(movie=)로 영화 데이터 렌더링
======================== */

function renderMovie(movie) {
  if (!movie) return;

  // 상단: 제목 / 줄거리
  $(".a_movie_title_value").text(movie.title);
  $(".a_plot_value").text(movie.plot);

  // 상단: 포스터
  $(".a_movie_poster img").attr({
    src: movie.poster,
    alt: movie.title + " 포스터",
  });

  // 상단: 배경 스틸컷 (값 있을 때만 교체)
  if (movie.backdrop) {
    $(".a_background_still").attr({
      src: movie.backdrop,
      alt: movie.title + " 배경 스틸컷",
    });
  }

  // 상단 한 줄 정보 만들기: "전체관람가 · 2014 · 영화 · 애니메이션/판타지 102분"
  const year = (movie.release || "").slice(0, 4);
  const genreLine = (movie.genres || []).join("/");
  const detailLine = `${movie.rating} · ${year} · ${movie.type} · ${genreLine} ${movie.runtimeMin}분`;

  $(".a_details_value").text(detailLine);

  // 탭1 메타정보: strong 텍스트(라벨) 기준으로 span 값 교체
  function setMeta(label, value) {
    $(".movie_meta li").each(function () {
      const key = $(this).find("strong").text().trim();
      if (key === label) $(this).find("span").last().text(value);
    });
  }

  setMeta("개봉 연도", year || "-");
  setMeta("종류", movie.type || "-");
  setMeta("장르", genreLine || "-");
  setMeta("감독", movie.director || "-");
  setMeta("제작", movie.production || "-");
  setMeta("상영 시간", `${movie.runtimeMin}분`);
  setMeta("스트리밍", movie.streamingText || "-");
  setMeta("연령 등급", movie.rating || "-");

  /* =========================
    ✅ 탭3(영상/이미지) 교체 추가
  ========================= */

  // 1) 유튜브 영상 교체
  if (movie.trailer) {
    $("#tab_media iframe").attr("src", movie.trailer);
  }

  // 2) 스틸컷 4장 교체 (HTML 구조 그대로 기준)
  if (movie.stills && movie.stills.length >= 4) {
    $("#tab_media .image_item.large img").attr("src", movie.stills[0]);
    $("#tab_media .image_left img").attr("src", movie.stills[1]);
    $("#tab_media .image_small.top img").attr("src", movie.stills[2]);
    $("#tab_media .image_small.bottom img").attr("src", movie.stills[3]);
  }
}

// URL에서 movie 키 읽어서 렌더
const params = new URLSearchParams(location.search);
const movieKey = params.get("movie");

if (movieKey && MOVIES[movieKey]) {
  renderMovie(MOVIES[movieKey]);
}

/* =========================
    밸런스 게임
======================== */

// 카드별 대응하는 결과 미리 적어둠
const RESULT = {
  left: {
    id: "frozen",
    msg: "마법 같은 분위기에 끌리는 당신에게 어울리는 작품..",
    title: "겨울왕국",
    poster: "img/poster/poster_겨울왕국.jpg",
    tags: ["#애니메이션", "#영화", "#마법", "#겨울", "#디즈니"],
  },
  right: {
    id: "guardians",
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

  $(".a_result_view_details_btn").attr("href", `sub.html?movie=${d.id}`);

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
