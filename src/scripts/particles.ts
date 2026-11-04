/**
 * Red de nodos del hero. TypeScript puro, sin librerías.
 * Se importa de forma dinámica desde Hero.astro (nunca en móvil, con
 * reduced-motion ni con saveData). Devuelve una función de limpieza.
 */

const LINK = 120; // distancia máxima de conexión (px)
const MAX_LINKS = 6; // tope de conexiones por nodo
const REACH = 190; // radio de influencia del cursor (px)
const FORM = 0.9; // s: los nodos viajan hacia la V
const HOLD = 1.1; // s: la V se mantiene
const RELEASE = 1.1; // s: se dispersan
const FIRST = 3.5; // s hasta el primer momento de marca
const EVERY = 8; // s entre momentos de marca
// Violeta, esmeralda y cian (verbos) + blanco azulado del texto
const RGB = ['139,92,246', '52,211,153', '34,211,238', '203,220,255'];
const STROKE = RGB.map((c) => `rgb(${c})`);

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function initParticles(hero: HTMLElement): () => void {
  const canvas = hero.querySelector<HTMLCanvasElement>('[data-particles]');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return () => {};

  const vSvg = hero.querySelector<SVGSVGElement>('[data-vmark]');
  const title = hero.querySelector<HTMLElement>('[data-hero-title]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const N = innerWidth >= 1024 ? 90 : 50;

  let W = 0;
  let H = 0;
  let dpr = 1;
  let cols = 1;
  let rows = 1;
  let head = new Int32Array(1);
  const next = new Int32Array(N);
  const deg = new Uint8Array(N);

  // Estado de los nodos (arreglos tipados: cero asignaciones por frame)
  const X = new Float32Array(N); // posición natural
  const Y = new Float32Array(N);
  const BX = new Float32Array(N); // deriva base (px/s)
  const BY = new Float32Array(N);
  const OX = new Float32Array(N); // velocidad extra por el cursor
  const OY = new Float32Array(N);
  const R = new Float32Array(N);
  const C = new Uint8Array(N);
  const TX = new Float32Array(N); // destino en la V
  const TY = new Float32Array(N);
  const PX = new Float32Array(N); // posición dibujada
  const PY = new Float32Array(N);
  const NEAR = new Float32Array(N); // cercanía al cursor (0 a 1)

  for (let i = 0; i < N; i++) {
    const a = Math.random() * Math.PI * 2;
    const v = 8 + Math.random() * 16;
    BX[i] = Math.cos(a) * v;
    BY[i] = Math.sin(a) * v;
    R[i] = 1.5 + Math.random();
    // Más blanco azulado que color: el color queda como acento
    const k = Math.random();
    C[i] = k < 0.28 ? 0 : k < 0.56 ? 1 : k < 0.84 ? 2 : 3;
  }

  // ── Muestreo de la V (viewBox del SVG) ──
  const paths = vSvg ? Array.from(vSvg.querySelectorAll('path')) : [];
  const VX = new Float32Array(N);
  const VY = new Float32Array(N);
  if (paths.length) {
    const lens = paths.map((p) => p.getTotalLength());
    const total = lens.reduce((a, b) => a + b, 0);
    for (let i = 0; i < N; i++) {
      let d = ((i + 0.5) / N) * total;
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
    const sr = vSvg.getBoundingClientRect();
    const vb = vSvg.viewBox.baseVal;
    const s = Math.min(sr.width / vb.width, sr.height / vb.height);
    const ox = sr.left - hr.left + (sr.width - vb.width * s) / 2 - vb.x * s;
    const oy = sr.top - hr.top + (sr.height - vb.height * s) / 2 - vb.y * s;
    for (let i = 0; i < N; i++) {
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
  let nextAt = FIRST;
  let lastEnd = 0;
  let phase = 0; // 0 reposo, 1 momento de marca
  let mt = 0;
  let w = 0; // peso de la V (0 a 1)
  let mouseOn = false;
  let cx = 0;
  let cy = 0;
  let mx = 0;
  let my = 0;
  let timer = 0;
  let shown = false;

  function resize() {
    const nw = hero.clientWidth;
    const nh = hero.clientHeight;
    const nd = Math.min(devicePixelRatio || 1, 2);
    if (innerWidth < 768) return stop();
    if (!nw || !nh || (nw === W && nh === H && nd === dpr)) return;
    const fresh = W === 0;
    const sx = fresh ? 1 : nw / W;
    const sy = fresh ? 1 : nh / H;
    W = nw;
    H = nh;
    dpr = nd;
    canvas!.width = Math.round(W * dpr);
    canvas!.height = Math.round(H * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (let i = 0; i < N; i++) {
      X[i] = fresh ? Math.random() * W : X[i] * sx;
      Y[i] = fresh ? Math.random() * H : Y[i] * sy;
    }
    cols = Math.ceil(W / LINK) || 1;
    rows = Math.ceil(H / LINK) || 1;
    head = new Int32Array(cols * rows);
    layoutV();
    if (!running) draw();
  }

  function startMoment() {
    if (phase || clock < lastEnd + 1.5) return;
    phase = 1;
    mt = 0;
  }

  function draw() {
    const c = ctx!;
    c.clearRect(0, 0, W, H);

    if (mouseOn) {
      const r = canvas!.getBoundingClientRect();
      mx = cx - r.left;
      my = cy - r.top;
    }

    // Posiciones dibujadas y cercanía al cursor
    for (let i = 0; i < N; i++) {
      PX[i] = X[i] + (TX[i] - X[i]) * w;
      PY[i] = Y[i] + (TY[i] - Y[i]) * w;
      let n = 0;
      if (mouseOn) {
        const dx = PX[i] - mx;
        const dy = PY[i] - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < REACH * REACH) n = 1 - Math.sqrt(d2) / REACH;
      }
      NEAR[i] = n;
    }

    // Grilla espacial: cada nodo solo se compara con su vecindario 3×3
    head.fill(-1);
    deg.fill(0);
    for (let i = 0; i < N; i++) {
      const gx = Math.min(cols - 1, Math.max(0, (PX[i] / LINK) | 0));
      const gy = Math.min(rows - 1, Math.max(0, (PY[i] / LINK) | 0));
      const cell = gy * cols + gx;
      next[i] = head[cell];
      head[cell] = i;
    }

    c.lineWidth = 1;
    let style = -1;
    const L2 = LINK * LINK;
    for (let i = 0; i < N; i++) {
      if (deg[i] >= MAX_LINKS) continue;
      const gx = Math.min(cols - 1, Math.max(0, (PX[i] / LINK) | 0));
      const gy = Math.min(rows - 1, Math.max(0, (PY[i] / LINK) | 0));
      for (let oy = -1; oy <= 1; oy++) {
        const yy = gy + oy;
        if (yy < 0 || yy >= rows) continue;
        for (let ox = -1; ox <= 1; ox++) {
          const xx = gx + ox;
          if (xx < 0 || xx >= cols) continue;
          for (let j = head[yy * cols + xx]; j >= 0; j = next[j]) {
            if (j <= i || deg[j] >= MAX_LINKS || deg[i] >= MAX_LINKS) continue;
            const dx = PX[i] - PX[j];
            const dy = PY[i] - PY[j];
            const d2 = dx * dx + dy * dy;
            if (d2 > L2) continue;
            deg[i]++;
            deg[j]++;
            const a = 1 - Math.sqrt(d2) / LINK;
            const boost = Math.max(NEAR[i], NEAR[j]);
            c.globalAlpha = Math.min(0.9, a * (0.22 + boost * 0.7 + w * 0.25));
            if (style !== C[i]) c.strokeStyle = STROKE[(style = C[i])];
            c.beginPath();
            c.moveTo(PX[i], PY[i]);
            c.lineTo(PX[j], PY[j]);
            c.stroke();
          }
        }
      }
    }

    style = -1;
    for (let i = 0; i < N; i++) {
      if (style !== C[i]) c.fillStyle = STROKE[(style = C[i])];
      c.globalAlpha = Math.min(1, 0.4 + NEAR[i] * 0.55 + w * 0.2);
      c.beginPath();
      c.arc(PX[i], PY[i], R[i] + NEAR[i] * 1.2, 0, 6.2832);
      c.fill();
    }
    c.globalAlpha = 1;
  }

  function frame(t: number) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(Math.max((t - last) / 1000, 0), 0.05);
    last = t;
    clock += dt;

    // Momento de marca
    if (!phase && clock >= nextAt) startMoment();
    if (phase) {
      mt += dt;
      if (mt < FORM) w = ease(mt / FORM);
      else if (mt < FORM + HOLD) w = 1;
      else if (mt < FORM + HOLD + RELEASE) w = 1 - ease((mt - FORM - HOLD) / RELEASE);
      else {
        w = 0;
        phase = 0;
        lastEnd = clock;
        nextAt = clock + EVERY;
      }
    }

    // Movimiento natural + atracción suave hacia el cursor
    const damp = Math.pow(0.92, dt * 60);
    const pull = (1 - w) * 160 * dt;
    for (let i = 0; i < N; i++) {
      if (mouseOn && pull > 0) {
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
      raf = requestAnimationFrame(frame);
    } else if (!go && running) {
      running = false;
      cancelAnimationFrame(raf);
    }
  }

  // ── Eventos ──
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    cx = e.clientX;
    cy = e.clientY;
    mouseOn = true;
  };
  const onLeave = () => (mouseOn = false);
  const onHover = () => startMoment();
  const onResize = () => {
    clearTimeout(timer);
    timer = window.setTimeout(resize, 150);
  };

  hero.addEventListener('pointermove', onMove, { passive: true });
  hero.addEventListener('pointerleave', onLeave);
  title?.addEventListener('pointerenter', onHover);
  document.addEventListener('visibilitychange', sync);
  reduce.addEventListener('change', stop);
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
    io.disconnect();
    ro.disconnect();
    hero.removeEventListener('pointermove', onMove);
    hero.removeEventListener('pointerleave', onLeave);
    title?.removeEventListener('pointerenter', onHover);
    document.removeEventListener('visibilitychange', sync);
    reduce.removeEventListener('change', stop);
    canvas!.classList.remove('is-on');
  }

  if (reduce.matches) {
    stop();
  } else {
    resize();
    sync();
  }
  return stop;
}
