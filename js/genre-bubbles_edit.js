// genre-bubbles.js
// 2025-11-10 정리본 : 전역 테두리, 패딩, 커스텀 렌더 일원화 + 라벨 폰트 고정(rem)

const BUBBLE_PADDING = 20; // 버블 간격(px)
const OUTLINE_COLOR = "#252426"; // 테두리 색상
const OUTLINE_WIDTH = 4; // 테두리 두께(px)

// === 라벨 폰트 설정(고정 크기) ===
const LABEL_FONT_FAMILY = `"NanumSquare", sans-serif`; // 폰트
const LABEL_FONT_REM = 0.9375; // = 15px @ root 16px (고정)
const LABEL_FONT_WEIGHT_DEFAULT = 400; // 기본 굵기(보통)
const LABEL_FONT_COLOR_DEFAULT = "#faf5f5"; // 기본 글자색

//🔥 1) 이미지 미리 로드
let posterImg = new Image();
posterImg.src = "img/poster/pt283.webp";
let posterLoaded = false;
posterImg.onload = () => {
  posterLoaded = true;
};
(function () {
  const { Engine, Render, Runner, World, Bodies, Events } = Matter;

  function initGenreBubbleApp(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`❌ '${containerId}' 컨테이너를 찾을 수 없습니다.`);
      return null;
    }

    const width = container.clientWidth;
    const height = container.clientHeight; // CSS로 고정 높이 필수

    const engine = Engine.create();
    const world = engine.world;

    const render = Render.create({
      element: container,
      engine,
      options: {
        width,
        height,
        wireframes: false,
        pixelRatio: window.devicePixelRatio || 1,
        background: "transparent",
      },
    });

    Render.run(render);
    Runner.run(Runner.create(), engine);

    // 경계 생성
    const ground = Bodies.rectangle(width / 2, height + 50, width, 100, {
      isStatic: true,
    });
    const left = Bodies.rectangle(-50, height / 2, 100, height, {
      isStatic: true,
    });
    const right = Bodies.rectangle(width + 50, height / 2, 100, height, {
      isStatic: true,
    });
    World.add(world, [ground, left, right]);

    const bubbles = [];

    function createGenreBubble(name, color, radius, opts = {}, idx, stNum) {
      if (opts.specialPoster && stNum !== undefined) {
        posterLoaded = false;
        posterImg.src = `img/poster/pt${stNum}.webp`;
        console.log(stNum);
      }
      const lw = Number.isFinite(opts.lineWidth)
        ? opts.lineWidth
        : OUTLINE_WIDTH;
      const strokeColor = opts.strokeColor || OUTLINE_COLOR;

      const x = Math.random() * (width - 2 * radius) + radius;

      // idx 기준으로 살짝씩 다른 높이에서 떨어지게
      const order = Number.isFinite(idx) ? idx : 0;
      const spawnY = -radius - order * (radius * 0.3);

      const body = Bodies.circle(x, spawnY, radius, {
        restitution: 0.6,
        friction: 0.1,
        render: { visible: false },
      });

      // label 매핑
      const labelMap = {
        애니: "애니",
        드라마: "드라마",
        액션: "액션",
        SF: "SF",
        코미디: "코미디",
        판타지: "판타지",
        스릴러: "스릴러",
        로맨스: "로맨스",
      };

      body.plugin = {
        label: labelMap[name] || name,
        fill: color,
        stroke: strokeColor,
        lineWidth: lw,
        gradient: opts.gradient || null,
        fontWeight: opts.fontWeight || LABEL_FONT_WEIGHT_DEFAULT,
        fontColor: opts.fontColor || LABEL_FONT_COLOR_DEFAULT,
        idx,
        specialPoster: opts.specialPoster === true,
      };

      World.add(world, body);
      bubbles.push(body);
    }

    Events.on(render, "afterRender", () => {
      const ctx = render.context;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const rootPx =
        parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const fixedPx = Math.round(LABEL_FONT_REM * rootPx);

      bubbles.forEach((b) => {
        const rOuter = b.circleRadius;
        const lw = b.plugin.lineWidth || OUTLINE_WIDTH;
        const rDraw = Math.max(0, rOuter - lw / 2);

        let fillStyle;
        if (b.plugin.specialPoster) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(b.position.x, b.position.y, rDraw, 0, Math.PI * 2);
          ctx.clip();

          if (posterLoaded) {
            ctx.save();
            ctx.filter = "blur(5px)";
            ctx.globalAlpha = 1.0;
            ctx.drawImage(
              posterImg,
              b.position.x - rDraw,
              b.position.y - rDraw,
              rDraw * 2,
              rDraw * 2,
            );
            ctx.filter = "none";
            ctx.restore();
          }

          const inner = "rgba(41, 131, 88, 0.5)";
          const outer = "rgba(73, 233, 156, 0.5)";

          const grd = ctx.createRadialGradient(
            b.position.x,
            b.position.y,
            0,
            b.position.x,
            b.position.y,
            rDraw,
          );
          grd.addColorStop(1, outer);
          grd.addColorStop(0, inner);
          ctx.globalAlpha = 0.1;
          fillStyle = grd;

          ctx.beginPath();
          ctx.arc(b.position.x, b.position.y, rDraw, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (b.plugin.gradient?.inner && b.plugin.gradient?.outer) {
          const grd = ctx.createRadialGradient(
            b.position.x,
            b.position.y,
            0,
            b.position.x,
            b.position.y,
            rDraw,
          );
          grd.addColorStop(0, b.plugin.gradient.inner);
          grd.addColorStop(1, b.plugin.gradient.outer);
          fillStyle = grd;
        } else {
          fillStyle = b.plugin.fill;
        }
        // 채우기
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.arc(b.position.x, b.position.y, rDraw, 0, Math.PI * 2);
        ctx.fill();

        // 테두리
        ctx.lineWidth = lw;
        ctx.strokeStyle = b.plugin.stroke || OUTLINE_COLOR;
        ctx.beginPath();
        ctx.arc(b.position.x, b.position.y, rDraw, 0, Math.PI * 2);
        ctx.stroke();

        // 라벨
        const name = b.plugin.label;
        const weight = b.plugin.fontWeight || LABEL_FONT_WEIGHT_DEFAULT;
        ctx.font = `${weight} ${fixedPx}px ${LABEL_FONT_FAMILY}`;
        ctx.fillStyle = b.plugin.fontColor || LABEL_FONT_COLOR_DEFAULT;
        ctx.fillText(name, b.position.x, b.position.y);
      });
    });

    return { createGenreBubble };
  }

  window.genreBubbleApp = { init: initGenreBubbleApp };
})();
