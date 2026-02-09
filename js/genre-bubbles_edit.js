// genre-bubbles.js
// Matter.js 기반 원형 버블 UI 렌더러

const OUTLINE_COLOR = "#252426";
const OUTLINE_WIDTH = 4;

const LABEL_FONT_FAMILY = `"NanumSquare", sans-serif`;
const LABEL_FONT_REM = 0.9375; // 15px
const LABEL_FONT_WEIGHT_DEFAULT = 400;
const LABEL_FONT_COLOR_DEFAULT = "#faf5f5";

(function () {
  const { Engine, Render, Runner, World, Bodies, Events } = Matter;

  function initGenreBubbleApp(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return null;

    const width = container.clientWidth;
    const height = container.clientHeight;

    /* ===== Matter.js 기본 세팅 ===== */

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

    /* ===== 월드 경계 ===== */

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

    /* ===== 버블 저장소 ===== */

    const bubbles = [];

    /* ===== 버블 생성 ===== */

    function createGenreBubble(name, color, radius, opts = {}, idx = 0) {
      const lw = Number.isFinite(opts.lineWidth)
        ? opts.lineWidth
        : OUTLINE_WIDTH;

      const x = Math.random() * (width - radius * 2) + radius;
      const spawnY = -radius - idx * (radius * 0.3);

      const body = Bodies.circle(x, spawnY, radius, {
        restitution: 0.6,
        friction: 0.1,
        render: { visible: false },
      });

      const specialSrc =
        opts.specialPoster === true ? opts.imageSrc || null : null;

      body.plugin = {
        label: name,
        fill: color,
        stroke: opts.strokeColor || OUTLINE_COLOR,
        lineWidth: lw,
        gradient: opts.gradient || null,

        fontWeight: opts.fontWeight || LABEL_FONT_WEIGHT_DEFAULT,
        fontColor: opts.fontColor || LABEL_FONT_COLOR_DEFAULT,

        specialPoster: opts.specialPoster === true,
        specialSrc,
        specialImg: null,
        specialLoaded: false,
      };

      if (body.plugin.specialPoster && body.plugin.specialSrc) {
        const img = new Image();
        img.src = body.plugin.specialSrc;
        img.onload = () => {
          body.plugin.specialImg = img;
          body.plugin.specialLoaded = true;
        };
      }

      World.add(world, body);
      bubbles.push(body);
    }

    /* ===== 커스텀 렌더링 ===== */

    Events.on(render, "afterRender", () => {
      const ctx = render.context;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const rootPx =
        parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const fontPx = Math.round(LABEL_FONT_REM * rootPx);

      bubbles.forEach((b) => {
        const r = b.circleRadius;
        const lw = b.plugin.lineWidth;
        const drawR = Math.max(0, r - lw / 2);

        let fillStyle;

        if (b.plugin.specialPoster) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(b.position.x, b.position.y, drawR, 0, Math.PI * 2);
          ctx.clip();

          if (b.plugin.specialLoaded && b.plugin.specialImg) {
            ctx.filter = "blur(5px)";
            ctx.drawImage(
              b.plugin.specialImg,
              b.position.x - drawR,
              b.position.y - drawR,
              drawR * 2,
              drawR * 2,
            );
            ctx.filter = "none";
          }

          const grd = ctx.createRadialGradient(
            b.position.x,
            b.position.y,
            0,
            b.position.x,
            b.position.y,
            drawR,
          );
          grd.addColorStop(0, "rgba(41, 131, 88, 0.5)");
          grd.addColorStop(1, "rgba(73, 233, 156, 0.5)");

          ctx.globalAlpha = 0.1;
          fillStyle = grd;
          ctx.fillRect(0, 0, width, height);
          ctx.restore();
        } else if (b.plugin.gradient) {
          const grd = ctx.createRadialGradient(
            b.position.x,
            b.position.y,
            0,
            b.position.x,
            b.position.y,
            drawR,
          );
          grd.addColorStop(0, b.plugin.gradient.inner);
          grd.addColorStop(1, b.plugin.gradient.outer);
          fillStyle = grd;
        } else {
          fillStyle = b.plugin.fill;
        }

        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.arc(b.position.x, b.position.y, drawR, 0, Math.PI * 2);
        ctx.fill();

        ctx.lineWidth = lw;
        ctx.strokeStyle = b.plugin.stroke;
        ctx.stroke();

        ctx.font = `${b.plugin.fontWeight} ${fontPx}px ${LABEL_FONT_FAMILY}`;
        ctx.fillStyle = b.plugin.fontColor;
        ctx.fillText(b.plugin.label, b.position.x, b.position.y);
      });
    });

    return { createGenreBubble };
  }

  window.genreBubbleApp = { init: initGenreBubbleApp };
})();
