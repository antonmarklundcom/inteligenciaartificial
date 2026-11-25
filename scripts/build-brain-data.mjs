// Generates public/brain/shapes.bin: the particle targets for the home-page scene.
//
//   node scripts/build-brain-data.mjs
//
// Two shapes of 10,000 cones each, deterministic (seeded):
//   0 — a brain, modelled procedurally (lateral view along +z)
//   1 — the map of Paraguay, from scripts/data/paraguay-outline.json
//
// Layout (little endian), S = 2 shapes, N = 10,000 cones:
//   Uint16[S*N*3]  positions in 0–1 space (the shader maps them with (p-0.5)*2*radius)
//   Uint8 [S*N*3]  colour
//   Uint8 [S*N]    scale
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const N = 10000;

// --- seeded random + value noise ---------------------------------------------
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hash = (x, y, z, s) => {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 2147483647) ^ Math.imul(s, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a, b, t) => a + (b - a) * t;
/** Smooth value noise in [-1, 1]. */
function noise(x, y, z, s = 0) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const u = fade(x - xi), v = fade(y - yi), w = fade(z - zi);
  const c = (i, j, k) => hash(xi + i, yi + j, zi + k, s);
  return (
    lerp(
      lerp(lerp(c(0, 0, 0), c(1, 0, 0), u), lerp(c(0, 1, 0), c(1, 1, 0), u), v),
      lerp(lerp(c(0, 0, 1), c(1, 0, 1), u), lerp(c(0, 1, 1), c(1, 1, 1), u), v),
      w,
    ) * 2 - 1
  );
}
const fbm = (x, y, z, s) => noise(x, y, z, s) * 0.65 + noise(x * 2.1, y * 2.1, z * 2.1, s + 7) * 0.35;

// --- palette --------------------------------------------------------------------
const GOLD = [228, 162, 24];
const VIOLET = [130, 87, 245];
const TEAL = [40, 188, 174];
const WHITE = [236, 234, 246];

// --- brain ------------------------------------------------------------------------
// x: back (-) → front (+), y: up, z: left/right. Units: half the brain's length ≈ 1.
const ell = (p, c, r) => {
  const x = (p[0] - c[0]) / r[0], y = (p[1] - c[1]) / r[1], z = (p[2] - c[2]) / r[2];
  const k = Math.hypot(x, y, z);
  // First-order distance estimate, good enough to project points onto the surface.
  return (k - 1) * Math.min(r[0], r[1], r[2]);
};
const smin = (a, b, k) => {
  const h = Math.max(0, Math.min(1, 0.5 + (0.5 * (b - a)) / k));
  return lerp(b, a, h) - k * h * (1 - h);
};
function cerebrum(p) {
  const z = Math.abs(p[2]);
  // Each hemisphere is its own ellipsoid; the gap between them is the longitudinal fissure.
  let d = ell([p[0], p[1], z], [0, 0.06, 0.33], [1.0, 0.66, 0.4]);
  d = smin(d, ell([p[0], p[1], z], [0.5, -0.02, 0.27], [0.52, 0.5, 0.33]), 0.12); // frontal
  d = smin(d, ell([p[0], p[1], z], [-0.62, 0.0, 0.26], [0.42, 0.46, 0.3]), 0.12); // occipital
  d = smin(d, ell([p[0], p[1], z], [0.2, -0.4, 0.46], [0.56, 0.24, 0.25]), 0.1); // temporal
  return d;
}
const cerebellum = (p) => ell([p[0], p[1], Math.abs(p[2])], [-0.6, -0.56, 0.2], [0.36, 0.25, 0.36]);
function stem(p) {
  // Capsule from the middle of the brain down and slightly back.
  const a = [-0.18, -0.35, 0], b = [-0.36, -1.0, 0];
  const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const ap = [p[0] - a[0], p[1] - a[1], p[2] - a[2]];
  const t = Math.max(0, Math.min(1, (ap[0] * ab[0] + ap[1] * ab[1] + ap[2] * ab[2]) / (ab[0] ** 2 + ab[1] ** 2 + ab[2] ** 2)));
  return Math.hypot(ap[0] - ab[0] * t, ap[1] - ab[1] * t, ap[2] - ab[2] * t) - lerp(0.14, 0.09, t);
}
const PARTS = [cerebrum, cerebellum, stem];

function buildBrain() {
  const rand = mulberry32(20261125);
  const pts = [];
  const quota = [Math.round(N * 0.82), Math.round(N * 0.13)];
  quota.push(N - quota[0] - quota[1]);
  const bounds = [
    [[-1.15, 1.15], [-0.75, 0.85], [-0.85, 0.85]],
    [[-1.05, -0.15], [-0.9, -0.2], [-0.65, 0.65]],
    [[-0.6, 0.05], [-1.05, -0.3], [-0.2, 0.2]],
  ];
  PARTS.forEach((sdf, part) => {
    let made = 0;
    while (made < quota[part]) {
      const b = bounds[part];
      let p = [lerp(b[0][0], b[0][1], rand()), lerp(b[1][0], b[1][1], rand()), lerp(b[2][0], b[2][1], rand())];
      if (Math.abs(sdf(p)) > 0.25) continue;
      // Project onto the surface along the numerical gradient.
      let ok = true;
      for (let it = 0; it < 6; it++) {
        const d = sdf(p), e = 0.002;
        const g = [
          sdf([p[0] + e, p[1], p[2]]) - d,
          sdf([p[0], p[1] + e, p[2]]) - d,
          sdf([p[0], p[1], p[2] + e]) - d,
        ];
        const len = Math.hypot(g[0], g[1], g[2]);
        if (len < 1e-9) { ok = false; break; }
        p = [p[0] - (g[0] / len) * d, p[1] - (g[1] / len) * d, p[2] - (g[2] / len) * d];
      }
      if (!ok || Math.abs(sdf(p)) > 0.004) continue;
      // Keep only the outside: drop points buried inside another part.
      if (PARTS.some((other, o) => o !== part && other(p) < -0.03)) continue;
      // The stem's cut ends and the flat inner faces of the hemispheres stay sparse.
      if (part === 0 && Math.abs(p[2]) < 0.035 && rand() > 0.25) continue;

      // Folds: winding sulci are the zero crossings of a warped noise field.
      let fold;
      if (part === 0) {
        const wx = p[0] + fbm(p[0] * 2.2, p[1] * 2.2, p[2] * 2.2, 3) * 0.16;
        const wy = p[1] + fbm(p[0] * 2.2 + 9, p[1] * 2.2, p[2] * 2.2, 5) * 0.16;
        fold = Math.abs(fbm(wx * 4.6, wy * 4.6, p[2] * 4.6, 11));
      } else if (part === 1) {
        fold = Math.abs(Math.sin((p[1] + p[0] * 0.25) * 46)) * 0.5; // fine horizontal folia
      } else {
        fold = 0.3;
      }
      const ridge = Math.min(1, fold / 0.2);
      if (rand() > 0.05 + 0.95 * ridge ** 1.8) continue;

      // Colour by lobe, with noisy borders and a few white sparks.
      const n = fbm(p[0] * 1.6, p[1] * 1.6, p[2] * 1.6, 23) * 0.22;
      let col;
      if (part === 1) col = TEAL;
      else if (part === 2) col = WHITE;
      else if (p[1] < -0.22 + n && p[0] > -0.45) col = TEAL; // temporal
      else if (p[0] > 0.18 + n) col = GOLD; // frontal
      else if (p[0] < -0.5 + n) col = GOLD; // occipital
      else col = VIOLET; // parietal
      if (part === 0 && rand() < 0.07) col = WHITE;
      if (part === 0 && rand() < 0.06) col = [GOLD, VIOLET, TEAL][Math.floor(rand() * 3)];
      const shade = 0.72 + 0.28 * ridge;
      const scale = (0.34 + 0.66 * rand() ** 2.2) * (0.6 + 0.4 * ridge);
      pts.push({ p, col: col.map((c) => c * shade), scale });
      made++;
    }
  });
  // Fit into 0–1 space: centred slightly above the middle, like the scene expects.
  const k = 0.3;
  for (const q of pts) q.p = [0.5 + q.p[0] * k, 0.62 + q.p[1] * k, 0.5 + q.p[2] * k];
  return pts;
}

// --- Paraguay ------------------------------------------------------------------------
function buildParaguay() {
  const rand = mulberry32(595);
  const { ring } = JSON.parse(readFileSync(join(root, "scripts/data/paraguay-outline.json"), "utf8"));
  const lat0 = Math.cos((-23.4 * Math.PI) / 180);
  const proj = ([lon, lat]) => [(lon + 58.45) * lat0, lat + 23.44];
  const poly = ring.map(proj);
  const inside = ([x, y]) => {
    let hit = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i], [xj, yj] = poly[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
    }
    return hit;
  };
  const edgeDist = ([x, y]) => {
    let best = Infinity;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [ax, ay] = poly[j], [bx, by] = poly[i];
      const t = Math.max(0, Math.min(1, ((x - ax) * (bx - ax) + (y - ay) * (by - ay)) / ((bx - ax) ** 2 + (by - ay) ** 2 || 1)));
      best = Math.min(best, Math.hypot(x - ax - (bx - ax) * t, y - ay - (by - ay) * t));
    }
    return best;
  };
  // Where we work: Asunción and Ciudad del Este glow white.
  const cities = [[-57.63, -25.28], [-54.61, -25.51]].map(proj);
  const pts = [];
  const half = 4.3; // degrees from the centre to the furthest edge
  while (pts.length < N) {
    const p = [lerp(-half, half, rand()), lerp(-half, half, rand())];
    if (!inside(p)) continue;
    const edge = edgeDist(p);
    // A dense rim draws the border; the interior stays lighter.
    if (edge > 0.12 && rand() > 0.5) continue;
    const city = Math.min(...cities.map((c) => Math.hypot(c[0] - p[0], c[1] - p[1])));
    const n = fbm(p[0] * 0.9, p[1] * 0.9, 0, 31);
    let col = n > 0.12 ? GOLD : n < -0.14 ? TEAL : VIOLET;
    if (rand() < 0.05) col = WHITE;
    let scale = 0.3 + 0.6 * rand() ** 2.2;
    if (edge < 0.12) scale *= 0.8;
    if (city < 0.3) {
      col = WHITE;
      scale = 0.75 + 0.25 * rand();
    }
    const k = 0.34 / half;
    pts.push({
      p: [0.5 + p[0] * k, 0.62 + p[1] * k, 0.5 + (rand() - 0.5) * 0.035 + n * 0.02],
      col,
      scale,
    });
  }
  return pts;
}

// --- write ----------------------------------------------------------------------------------
const shuffle = (pts, seed) => {
  // Mobile renders only the first 7,000 cones, so the order must be a uniform sample.
  const rand = mulberry32(seed);
  for (let i = pts.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pts[i], pts[j]] = [pts[j], pts[i]];
  }
  return pts;
};
const shapes = [shuffle(buildBrain(), 1), shuffle(buildParaguay(), 2)];
const S = shapes.length;
const pos = new Uint16Array(S * N * 3);
const col = new Uint8Array(S * N * 3);
const scl = new Uint8Array(S * N);
shapes.forEach((pts, s) => {
  if (pts.length !== N) throw new Error(`shape ${s} has ${pts.length} points`);
  pts.forEach((q, i) => {
    const o = (s * N + i) * 3;
    for (let a = 0; a < 3; a++) {
      pos[o + a] = Math.round(Math.max(0, Math.min(1, q.p[a])) * 65535);
      col[o + a] = Math.round(Math.max(0, Math.min(255, q.col[a])));
    }
    scl[s * N + i] = Math.round(Math.max(0, Math.min(1, q.scale)) * 255);
  });
});
const out = Buffer.concat([Buffer.from(pos.buffer), Buffer.from(col.buffer), Buffer.from(scl.buffer)]);
mkdirSync(join(root, "public/brain"), { recursive: true });
writeFileSync(join(root, "public/brain/shapes.bin"), out);
console.log(`public/brain/shapes.bin — ${S} shapes × ${N} cones, ${out.length} bytes`);
