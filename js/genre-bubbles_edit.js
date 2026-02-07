// genre-bubbles.js
// Matter.js 물리 엔진 위에 “원형 버블 UI를 캔버스로 직접 그리는 렌더러
// 버블의 엔진, 물리, 렌더, 스타일, 이미지, 텍스트 관리

const OUTLINE_COLOR = "#252426";
const OUTLINE_WIDTH = 4;
const LABEL_FONT_FAMILY = `"NanumSquare", sans-serif`;
const LABEL_FONT_REM = 0.9375; // 15px 기준
const LABEL_FONT_WEIGHT_DEFAULT = 400;
const LABEL_FONT_COLOR_DEFAULT = "#faf5f5";

(function () {
  const { Engine, Render, Runner, World, Bodies, Events } = Matter;

  function initGenreBubbleApp(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`'${containerId}' 컨테이너를 찾을 수 없습니다.`);
      return null;
    }

    const width = container.clientWidth;
    const height = container.clientHeight;

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

    // 경계
    const ground = Bodies.rectangle(width / 2, height + 50, width, 100, {
      isStatic: true,
    });
    const left = Bodies.rectangle(-50, height / 2, 100, height, {
      isStatic: true,
    });
    const right = Bodies.rectangle(width + 50, height / 2, 100, height, {
      isStatic: true,
    });

    ground.render.visible = false;
    left.render.visible = false;
    right.render.visible = false;

    World.add(world, [ground, left, right]);

    //생성된 모든 버블 저장
    const bubbles = [];

    function createGenreBubble(name, color, radius, opts = {}, idx) {
      const lw = Number.isFinite(opts.lineWidth)
        ? opts.lineWidth
        : OUTLINE_WIDTH;
      const strokeColor = opts.strokeColor || OUTLINE_COLOR;

      const x = Math.random() * (width - 2 * radius) + radius;
      const order = Number.isFinite(idx) ? idx : 0;
      const spawnY = -radius - order * (radius * 0.3);

      const body = Bodies.circle(x, spawnY, radius, {
        restitution: 0.6,
        friction: 0.1,
        render: { visible: false },
      });

      // ✅ specialPoster 이미지 소스(버블별)
      const specialSrc = opts.specialPoster ? opts.imageSrc || null : null;

      body.plugin = {
        label: name, // ✅ labelMap 제거
        fill: color,
        stroke: strokeColor,
        lineWidth: lw,
        gradient: opts.gradient || null,
        fontWeight: opts.fontWeight || LABEL_FONT_WEIGHT_DEFAULT,
        fontColor: opts.fontColor || LABEL_FONT_COLOR_DEFAULT,
        idx,
        specialPoster: opts.specialPoster === true,

        // ✅ 버블별 이미지 상태
        specialSrc, // string | null
        specialImg: null, // Image | null
        specialLoaded: false, // boolean
      };

      // ✅ 버블별 이미지 로드
      if (body.plugin.specialPoster && body.plugin.specialSrc) {
        const img = new Image();
        img.src = body.plugin.specialSrc;
        img.onload = () => {
          body.plugin.specialImg = img;
          body.plugin.specialLoaded = true;
        };
        img.onerror = () => {
          console.warn("❗ special 이미지 로드 실패:", body.plugin.specialSrc);
        };
      }

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

        // ✅ specialPoster: 버블별 이미지로 그리기
        if (b.plugin.specialPoster) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(b.position.x, b.position.y, rDraw, 0, Math.PI * 2);
          ctx.clip();

          if (b.plugin.specialLoaded && b.plugin.specialImg) {
            ctx.save();
            ctx.filter = "blur(5px)";
            ctx.globalAlpha = 1.0;
            ctx.drawImage(
              b.plugin.specialImg,
              b.position.x - rDraw,
              b.position.y - rDraw,
              rDraw * 2,
              rDraw * 2,
            );
            ctx.filter = "none";
            ctx.restore();
          }

          // 이미지 위에 얇은 그라데이션(기존 느낌 유지)
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
          grd.addColorStop(0, inner);
          grd.addColorStop(1, outer);

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
