/* =========================
   밸런스 게임 결과 데이터
========================= */

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
   밸런스 카드 클릭
========================= */

$(".a_balance_card").on("click", function () {
  const key = $(this).hasClass("left") ? "left" : "right";
  const d = RESULT[key];

  $("#a_result_message_text").text(d.msg);
  $("#a_result_movie_title_value").text(d.title);

  $(".a_result_movie_poster").attr({
    src: d.poster,
    alt: `${d.title} 포스터`,
  });

  $(".a_result_tags_container").html(
    d.tags.map((t) => `<span class="a_result_tag">${t}</span>`).join(""),
  );

  $(".a_result_view_details_btn").attr("href", `sub.html?movie=${d.id}`);

  $(".a_balance_game_container").hide();
  $(".a_balance_result_area").show();

  $(".a_balance_card").removeClass("active");
  $(this).addClass("active");
});

/* =========================
   다시 하기
========================= */

$(".a_balance_restart_btn").on("click", function () {
  $(".a_balance_result_area").hide();
  $(".a_balance_game_container").show();
  $(".a_balance_card").removeClass("active");
});

/* =========================
   영화 상세 데이터
========================= */

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
   상세 페이지 렌더링
========================= */

function renderMovie(movie) {
  if (!movie) return;

  $(".a_movie_title_value").text(movie.title);
  $(".a_plot_value").text(movie.plot);

  $(".a_movie_poster img").attr({
    src: movie.poster,
    alt: `${movie.title} 포스터`,
  });

  if (movie.backdrop) {
    $(".a_background_still").attr({
      src: movie.backdrop,
      alt: `${movie.title} 배경 스틸컷`,
    });
  }

  const year = (movie.release || "").slice(0, 4);
  const genreLine = (movie.genres || []).join("/");
  const detailLine = `${movie.rating} · ${year} · ${movie.type} · ${genreLine} ${movie.runtimeMin}분`;

  $(".a_details_value").text(detailLine);

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

  if (movie.trailer) {
    $("#tab_media iframe").attr("src", movie.trailer);
  }

  if (movie.stills?.length >= 4) {
    $("#tab_media .image_item.large img").attr("src", movie.stills[0]);
    $("#tab_media .image_left img").attr("src", movie.stills[1]);
    $("#tab_media .image_small.top img").attr("src", movie.stills[2]);
    $("#tab_media .image_small.bottom img").attr("src", movie.stills[3]);
  }
}

/* =========================
   URL 파라미터 처리
========================= */

const params = new URLSearchParams(location.search);
const movieKey = params.get("movie");

if (movieKey && MOVIES[movieKey]) {
  renderMovie(MOVIES[movieKey]);
}
