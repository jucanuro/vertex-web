/**
 * Red de nodos del hero. TypeScript puro, sin librerías.
 * Se importa de forma dinámica desde Hero.astro, después de `load` y en reposo
 * (nunca antes del LCP). Hero.astro decide si arranca; aquí solo se adapta al
 * dispositivo (perfil) y se autoprotege si los fotogramas salen lentos.
 * Devuelve una función de limpieza.
 */

const CAP = 90; // capacidad máxima de nodos (escritorio)
const FPS_SLOW = 28; // ms por fotograma: promedio por encima = menos de ~35 fps
const FPS_FRAMES = 60; // fotogramas medidos por etapa
const FPS_WARMUP = 4; // fotogramas descartados al arrancar o reanudar
// Colores y opacidades salen de variables CSS (--pt-0..3 en "r, g, b", --pt-node-k, --pt-line-k):
// se leen al iniciar y cuando cambia data-theme, sin recrear el canvas.
let STROKE = ['', '', '', ''];
let NODE_K = 1;
let LINE_K = 1;
function readTheme() {
  const cs = getComputedStyle(document.documentElement);
  STROKE = [0, 1, 2, 3].map((i) => `rgb(${cs.getPropertyValue(`--pt-${i}`).trim()})`);
  NODE_K = parseFloat(cs.getPropertyValue('--pt-node-k')) || 1;
  LINE_K = parseFloat(cs.getPropertyValue('--pt-line-k')) || 1;
}

/**
 * Decisión de autoprotección de FPS, fácil de inspeccionar sin console.log:
 * en DevTools mira `document.documentElement.dataset.particles`
 * ("full" | "lite" = mitad de nodos y sin líneas | "off" = detenido).
 */
const PERF = { stage: 'full' as 'full' | 'lite' | 'off', avg: 0 };

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Perfil por dispositivo: misma lógica, distintos parámetros. */
function getProfile() {
  const w = innerWidth;
  const mobile = w < 768;
  // Sin hover (táctil) el momento de marca se dispara solo
  const auto = mobile || !matchMedia('(hover: hover)').matches;
  return {
    mobile,
    auto,
    n: w >= 1024 ? CAP : mobile ? 40 : 50,
    link: mobile ? 90 : 120, // distancia máxima de conexión (px)
    maxLinks: mobile ? 3 : 6, // tope de conexiones por nodo
    reach: mobile ? 150 : 190, // radio de influencia del cursor o del toque (px)
    dpr: mobile ? 1.5 : 2, // tope de devicePixelRatio
    alpha: mobile ? 0.75 : 1, // opacidad global: baja en móvil para no dañar la lectura
    form: auto ? 2 : 0.9, // s: los nodos viajan hacia la V
    hold: auto ? 1.5 : 1.1, // s: la V se mantiene
    release: 1.1, // s: se dispersan
    first: auto ? 1.5 : 3.5, // s hasta el primer momento de marca
    every: auto ? 7 : 8, // s entre momentos de marca
  };
}

export function initParticles(hero: HTMLElement): () => void {
  const canvas = hero.querySelector<HTMLCanvasElement>('[data-particles]');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return () => {};

  const vSvg = hero.querySelector<SVGSVGElement>('[data-vmark]');
  const title = hero.querySelector<HTMLElement>('[data-hero-title]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;

  let P = getProfile();
  let n = P.n; // nodos activos (<= CAP)
  let lines = true;

  let W = 0;
  let H = 0;
  let dpr = 1;
  let cols = 1;
  let rows = 1;
  let head = new Int32Array(1);
  const next = new Int32Array(CAP);
  const deg = new Uint8Array(CAP);

  // Estado de los nodos (arreglos tipados: cero asignaciones por frame)
  const X = new Float32Array(CAP); // posición natural
  const Y = new Float32Array(CAP);
  const BX = new Float32Array(CAP); // deriva base (px/s)
  const BY = new Float32Array(CAP);
  const OX = new Float32Array(CAP); // velocidad extra por cursor o toque
  const OY = new Float32Array(CAP);
  const R = new Float32Array(CAP);
  const C = new Uint8Array(CAP);
  const TX = new Float32Array(CAP); // destino en la V
  const TY = new Float32Array(CAP);
  const PX = new Float32Array(CAP); // posición dibujada
  const PY = new Float32Array(CAP);
  const NEAR = new Float32Array(CAP); // cercanía al cursor (0 a 1)

  for (let i = 0; i < CAP; i++) {
    const a = Math.random() * Math.PI * 2;
    const v = 8 + Math.random() * 16;
    BX[i] = Math.cos(a) * v;
    BY[i] = Math.sin(a) * v;
    R[i] = 1.5 + Math.random();
    // Más blanco azulado que color: el color queda como acento
    const k = Math.random();
    C[i] = k < 0.28 ? 0 : k < 0.56 ? 1 : k < 0.84 ? 2 : 3;
  }

  // ── Muestreo de la V a lo largo del contorno (coordenadas del viewBox) ──
  const paths = vSvg ? Array.from(vSvg.querySelectorAll('path')) : [];
  const lens = paths.map((p) => p.getTotalLength());
  const total = lens.reduce((a, b) => a + b, 0);
  const VX = new Float32Array(CAP);
  const VY = new Float32Array(CAP);
  function sampleV() {
    if (!paths.length) return;
    for (let i = 0; i < n; i++) {
      let d = ((i + 0.5) / n) * total;
      let k = 0;
      while (k < paths.length - 1 && d > lens[k]) d -= lens[k++];
      const p = paths[k].getPointAtLength(d);
      VX[i] = p.x;
      VY[i] = p.y;
    }
  }

  function layoutV() {
    if (!vSvg || !paths.length) return;
    const hr = hero.getBoundingClientRect();
    const vb = vSvg.viewBox.baseVal;
    let s: number;
    let ox: number;
    let oy: number;
    if (P.mobile) {
      // Ancho 80% del hero (rango pedido: 70–90%), centrada en el área visible del hero
      const top = Math.max(0, -hr.top);
      const bottom = Math.min(H, innerHeight - hr.top);
      s = Math.min((W * 0.8) / vb.width, ((bottom - top) * 0.8) / vb.height);
      ox = W / 2 - (vb.x + vb.width / 2) * s;
      oy = (top + bottom) / 2 - (vb.y + vb.height / 2) * s;
    } else {
      const sr = vSvg.getBoundingClientRect();
      s = Math.min(sr.width / vb.width, sr.height / vb.height);
      ox = sr.left - hr.left + (sr.width - vb.width * s) / 2 - vb.x * s;
      oy = sr.top - hr.top + (sr.height - vb.height * s) / 2 - vb.y * s;
    }
    for (let i = 0; i < n; i++) {
      TX[i] = ox + VX[i] * s;
      TY[i] = oy + VY[i] * s;
    }
  }

  // ── Estado ──
  let stopped = false;
  let running = false;
  let inView = true;
  let raf = 0;
  let last = 0;
  let clock = 0;
  let nextAt = P.first;
  let lastEnd = 0;
  let phase = 0; // 0 reposo, 1 momento de marca
  let mt = 0;
  let w = 0; // peso de la V (0 a 1)
  let ptrOn = false;
  let cx = 0;
  let cy = 0;
  let mx = 0;
  let my = 0;
  let timer = 0;
  let touchTimer = 0;
  let shown = false;
  // Autoprotección de FPS
  let fpsSeen = 0;
  let fpsSum = 0;
  let fpsDone = false;

  function setStage(s: typeof PERF.stage) {
    PERF.stage = s;
    root.dataset.particles = s;
  }

  function resize() {
    if (stopped) return;
    const nw = hero.clientWidth;
    const nh = hero.clientHeight;
    const prev = P;
    P = getProfile();
    const nd = Math.min(devicePixelRatio || 1, P.dpr);
    const want = PERF.stage === 'lite' ? P.n >> 1 : P.n;
    if (!nw || !nh) return;
    if (nw === W && nh === H && nd === dpr && want === n && P.mobile === prev.mobile) return;
    const fresh = W === 0;
    const sx = fresh ? 1 : nw / W;
    const sy = fresh ? 1 : nh / H;
    W = nw;
    H = nh;
    dpr = nd;
    canvas!.width = Math.round(W * dpr);
    canvas!.height = Math.round(H * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (let i = 0; i < CAP; i++) {
      X[i] = fresh ? Math.random() * W : X[i] * sx;
      Y[i] = fresh ? Math.random() * H : Y[i] * sy;
    }
    n = want;
    cols = Math.ceil(W / P.link) || 1;
    rows = Math.ceil(H / P.link) || 1;
    head = new Int32Array(cols * rows);
    sampleV();
    layoutV();
    if (!running) draw();
  }

  function startMoment() {
    if (phase || clock < lastEnd + 1.5) return;
    phase = 1;
    mt = 0;
    // En móvil el scroll cambia qué parte del hero se ve: recentra la V al empezar
    if (P.mobile) layoutV();
    if (P.auto) nextAt = clock + P.every; // cadencia medida desde el inicio
  }

  function draw() {
    const c = ctx!;
    c.clearRect(0, 0, W, H);
    const LINK = P.link;
    const REACH = P.reach;

    if (ptrOn) {
      const r = canvas!.getBoundingClientRect();
      mx = cx - r.left;
      my = cy - r.top;
    }

    // Posiciones dibujadas y cercanía al cursor
    for (let i = 0; i < n; i++) {
      PX[i] = X[i] + (TX[i] - X[i]) * w;
      PY[i] = Y[i] + (TY[i] - Y[i]) * w;
      let k = 0;
      if (ptrOn) {
        const dx = PX[i] - mx;
        const dy = PY[i] - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < REACH * REACH) k = 1 - Math.sqrt(d2) / REACH;
      }
      NEAR[i] = k;
    }

    if (lines) {
      // Grilla espacial: cada nodo solo se compara con su vecindario 3×3
      head.fill(-1);
      deg.fill(0);
      for (let i = 0; i < n; i++) {
        const gx = Math.min(cols - 1, Math.max(0, (PX[i] / LINK) | 0));
        const gy = Math.min(rows - 1, Math.max(0, (PY[i] / LINK) | 0));
        const cell = gy * cols + gx;
        next[i] = head[cell];
        head[cell] = i;
      }

      c.lineWidth = 1;
      let style = -1;
      const L2 = LINK * LINK;
      const MAX = P.maxLinks;
      for (let i = 0; i < n; i++) {
        if (deg[i] >= MAX) continue;
        const gx = Math.min(cols - 1, Math.max(0, (PX[i] / LINK) | 0));
        const gy = Math.min(rows - 1, Math.max(0, (PY[i] / LINK) | 0));
        for (let oy = -1; oy <= 1; oy++) {
          const yy = gy + oy;
          if (yy < 0 || yy >= rows) continue;
          for (let ox = -1; ox <= 1; ox++) {
            const xx = gx + ox;
            if (xx < 0 || xx >= cols) continue;
            for (let j = head[yy * cols + xx]; j >= 0; j = next[j]) {
              if (j <= i || deg[j] >= MAX || deg[i] >= MAX) continue;
              const dx = PX[i] - PX[j];
              const dy = PY[i] - PY[j];
              const d2 = dx * dx + dy * dy;
              if (d2 > L2) continue;
              deg[i]++;
              deg[j]++;
              const a = 1 - Math.sqrt(d2) / LINK;
              const boost = Math.max(NEAR[i], NEAR[j]);
              c.globalAlpha = Math.min(0.9, a * (0.22 + boost * 0.7 + w * 0.25) * LINE_K) * P.alpha;
              if (style !== C[i]) c.strokeStyle = STROKE[(style = C[i])];
              c.beginPath();
              c.moveTo(PX[i], PY[i]);
              c.lineTo(PX[j], PY[j]);
              c.stroke();
            }
          }
        }
      }
    }

    let style = -1;
    for (let i = 0; i < n; i++) {
      if (style !== C[i]) c.fillStyle = STROKE[(style = C[i])];
      c.globalAlpha = Math.min(1, (0.4 + NEAR[i] * 0.55 + w * 0.2) * NODE_K) * P.alpha;
      c.beginPath();
      c.arc(PX[i], PY[i], R[i] + NEAR[i] * 1.2, 0, 6.2832);
      c.fill();
    }
    c.globalAlpha = 1;
  }

  /** Mide ~60 fotogramas; si son lentos baja a la mitad de nodos sin líneas y, si persiste, se detiene. */
  function watchFps(ms: number) {
    if (fpsDone || ms > 250) return; // ms > 250: pausa de pestaña, no cuenta
    if (++fpsSeen <= FPS_WARMUP) return;
    fpsSum += ms;
    if (fpsSeen - FPS_WARMUP < FPS_FRAMES) return;
    PERF.avg = fpsSum / FPS_FRAMES;
    fpsSeen = fpsSum = 0;
    if (PERF.avg <= FPS_SLOW) {
      fpsDone = true;
    } else if (PERF.stage === 'full') {
      setStage('lite');
      lines = false;
      n = P.n >> 1;
      sampleV();
      layoutV();
    } else {
      setStage('off');
      stop();
    }
  }

  function frame(t: number) {
    raf = requestAnimationFrame(frame);
    watchFps(t - last);
    if (stopped) return;
    const dt = Math.min(Math.max((t - last) / 1000, 0), 0.05);
    last = t;
    clock += dt;

    // Momento de marca
    if (!phase && clock >= nextAt) startMoment();
    if (phase) {
      mt += dt;
      if (mt < P.form) w = ease(mt / P.form);
      else if (mt < P.form + P.hold) w = 1;
      else if (mt < P.form + P.hold + P.release) w = 1 - ease((mt - P.form - P.hold) / P.release);
      else {
        w = 0;
        phase = 0;
        lastEnd = clock;
        if (!P.auto) nextAt = clock + P.every;
        else nextAt = Math.max(nextAt, clock + 1.5);
      }
    }

    // Movimiento natural + atracción suave hacia el cursor o el toque
    const damp = Math.pow(0.92, dt * 60);
    const pull = (1 - w) * 160 * dt;
    const REACH = P.reach;
    for (let i = 0; i < n; i++) {
      if (ptrOn && pull > 0) {
        const dx = mx - X[i];
        const dy = my - Y[i];
        const d2 = dx * dx + dy * dy;
        if (d2 < REACH * REACH && d2 > 1) {
          const d = Math.sqrt(d2);
          const f = ((1 - d / REACH) * pull) / d;
          OX[i] += dx * f;
          OY[i] += dy * f;
        }
      }
      OX[i] *= damp;
      OY[i] *= damp;
      let x = X[i] + (BX[i] + OX[i]) * dt;
      let y = Y[i] + (BY[i] + OY[i]) * dt;
      if (x < -20) x += W + 40;
      else if (x > W + 20) x -= W + 40;
      if (y < -20) y += H + 40;
      else if (y > H + 20) y -= H + 40;
      X[i] = x;
      Y[i] = y;
    }

    draw();
    if (!shown) {
      shown = true;
      canvas!.classList.add('is-on');
    }
  }

  function sync() {
    const go = inView && !document.hidden && !stopped;
    if (go && !running) {
      running = true;
      last = performance.now();
      fpsSeen = fpsSum = 0; // tras una pausa se vuelve a calentar la medición
      raf = requestAnimationFrame(frame);
    } else if (!go && running) {
      running = false;
      cancelAnimationFrame(raf);
    }
  }

  // ── Eventos (todos pasivos: nunca bloquean el scroll vertical) ──
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === 'mouse' && P.mobile) return; // móvil: sin interacción con cursor
    clearTimeout(touchTimer);
    cx = e.clientX;
    cy = e.clientY;
    ptrOn = true;
  };
  const onLeave = () => (ptrOn = false);
  // Un toque suelta la atracción poco después; si el navegador toma el gesto para scroll llega pointercancel
  const onUp = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') return;
    clearTimeout(touchTimer);
    touchTimer = window.setTimeout(onLeave, 600);
  };
  const onHover = () => !P.auto && startMoment(); // el hover solo existe donde hay cursor
  const onResize = () => {
    clearTimeout(timer);
    timer = window.setTimeout(resize, 150);
  };
  // Tras girar el dispositivo el viewport tarda en asentarse
  const onOrient = () => {
    clearTimeout(timer);
    timer = window.setTimeout(resize, 300);
  };

  readTheme();
  const themeObs = new MutationObserver(() => {
    readTheme();
    if (!running) draw();
  });
  themeObs.observe(root, { attributes: true, attributeFilter: ['data-theme'] });

  const opt = { passive: true } as const;
  hero.addEventListener('pointerdown', onMove, opt);
  hero.addEventListener('pointermove', onMove, opt);
  hero.addEventListener('pointerup', onUp, opt);
  hero.addEventListener('pointercancel', onUp, opt);
  hero.addEventListener('pointerleave', onLeave, opt);
  title?.addEventListener('pointerenter', onHover, opt);
  addEventListener('orientationchange', onOrient, opt);
  document.addEventListener('visibilitychange', sync);
  reduce.addEventListener('change', stop);
  document.addEventListener('astro:before-swap', stop, { once: true });
  const io = new IntersectionObserver((e) => {
    inView = e[0].isIntersecting;
    sync();
  });
  const ro = new ResizeObserver(onResize);
  io.observe(hero);
  ro.observe(hero);

  function stop() {
    if (stopped) return;
    stopped = true;
    sync();
    clearTimeout(timer);
    clearTimeout(touchTimer);
    io.disconnect();
    ro.disconnect();
    themeObs.disconnect();
    hero.removeEventListener('pointerdown', onMove);
    hero.removeEventListener('pointermove', onMove);
    hero.removeEventListener('pointerup', onUp);
    hero.removeEventListener('pointercancel', onUp);
    hero.removeEventListener('pointerleave', onLeave);
    title?.removeEventListener('pointerenter', onHover);
    removeEventListener('orientationchange', onOrient);
    document.removeEventListener('visibilitychange', sync);
    document.removeEventListener('astro:before-swap', stop);
    reduce.removeEventListener('change', stop);
    canvas!.classList.remove('is-on');
  }

  setStage('full');
  if (reduce.matches) {
    stop();
  } else {
    resize();
    sync();
  }
  return stop;
}
