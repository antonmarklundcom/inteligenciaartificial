// WebGL scene for the home hero: a particle lapacho tree standing on water that,
// as the visitor scrolls, morphs into a cube carrying the "IA Paraguay" wordmark.
// Browser-only — import it from a client component inside an effect.
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

export type SceneHandle = {
  /** Scroll progress through the hero stage, 0..1. */
  setProgress(progress: number): void;
  /** Intro reveal (sphere of particles → tree), 0..1. */
  setIntro(intro: number): void;
  /** Called every frame with elapsed seconds, for DOM elements synced to the scene. */
  onFrame(cb: (time: number) => void): void;
  setPaused(paused: boolean): void;
  dispose(): void;
};

const WORDMARK = "IA Paraguay";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

const TREE_VERTEX = /* glsl */ `
attribute float aSize, aPhase, aDrift;
attribute vec3 aTarget, aSphere;
uniform float uTime, uPixelRatio, uMorph, uIntro, uOpacity, uHover;
uniform float uTreeRadius, uCubeRadius, uTreeSpread, uCubeSpread, uTreeCore, uCubeCore, uTreeRamp, uCubeRamp;
uniform vec2 uPointer, uResolution;
varying float vGlow, vOpacity, vDepth, vPetal;
void main() {
  float m = smoothstep(0., 1., uMorph), intro = smoothstep(0., 1., uIntro);
  vec3 treeShape = mix(aSphere, position, intro);
  vec3 p = mix(treeShape, aTarget, m);
  float wind = sin(uTime * .75 + p.y * 1.65 + aPhase) * (.025 + smoothstep(2.5, 7., p.y) * (1. - m) * .14) * intro;
  p.x += wind + aDrift * mod(uTime * .16 + aPhase, 6.) * intro;
  p.z += sin(uTime * .55 + aPhase) * .025 * (1. - m) * intro;
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mv;
  vec2 screen = (gl_Position.xy / gl_Position.w * .5 + .5) * uResolution;
  vec2 delta = screen - uPointer;
  float dist = length(delta);
  float radius = mix(uTreeRadius, uCubeRadius, m);
  float ramp = clamp(1. - dist / radius, 0., 1.);
  ramp = ramp * ramp * (3. - 2. * ramp);
  ramp = pow(max(ramp, .0001), mix(uTreeRamp, uCubeRamp, m));
  float core = mix(uTreeCore, uCubeCore, m);
  float softCore = mix(core, 1., smoothstep(0., radius * .34, dist));
  float repel = ramp * softCore * uHover * intro;
  float spread = mix(uTreeSpread, uCubeSpread, m);
  gl_Position.xy += normalize(delta + vec2(.001)) * repel * spread * gl_Position.w;
  vDepth = clamp((-mv.z - 8.) / 14., 0., 1.);
  float depthScale = mix(1.28, .72, vDepth);
  gl_PointSize = aSize * depthScale * uPixelRatio * (27. / -mv.z) * (1. + repel * mix(.07, .22, m));
  vGlow = .62 + .38 * sin(aPhase + uTime * 1.4);
  vOpacity = uOpacity;
  // Drifting particles are lapacho petals: they keep a pink tint while the tree is a tree.
  vPetal = step(.001, aDrift) * (1. - m);
}`;

const TREE_FRAGMENT = /* glsl */ `
varying float vGlow, vOpacity, vDepth, vPetal;
void main() {
  float d = length(gl_PointCoord - .5);
  float c = smoothstep(.19, 0., d), h = smoothstep(.5, .08, d);
  vec3 nearCol = vec3(.12, .82, 1.), farCol = vec3(.018, .16, .72);
  vec3 col = mix(nearCol, farCol, vDepth);
  col = mix(col, vec3(.62, .97, 1.), c * .55);
  col = mix(col, vec3(1., .42, .78), vPetal * .85);
  float depthAlpha = mix(1., .48, vDepth);
  gl_FragColor = vec4(col, (c + h * .38) * vGlow * vOpacity * depthAlpha);
}`;

const REFLECTION_VERTEX = /* glsl */ `
attribute float aSize, aPhase, aDrift;
attribute vec3 aTarget, aSphere;
uniform float uTime, uMorph, uPixelRatio, uIntro;
varying float vFade, vGlint, vMorph;
void main() {
  float m = smoothstep(0., 1., uMorph);
  vMorph = m;
  float intro = smoothstep(0., 1., uIntro);
  vec3 p = mix(mix(aSphere, position, intro), aTarget, m);
  float wind = sin(uTime * .75 + p.y * 1.65 + aPhase) * (.018 + smoothstep(2.5, 7., p.y) * (1. - m) * .08);
  p.x += wind + aDrift * mod(uTime * .16 + aPhase, 6.);
  vec4 world = modelMatrix * vec4(p, 1.);
  float waterY = -.58;
  float sourceHeight = max(0., world.y - waterY);
  world.y = waterY - sourceHeight * .66;
  float breakup = sin(sourceHeight * 7.5 + world.x * 1.7 - uTime * 1.4 + aPhase) * (.025 + sourceHeight * .018) * mix(1., 1.55, m);
  world.x += breakup + sin(world.z * 3. + uTime * .55) * sourceHeight * .012;
  world.z += cos(world.x * 2.2 - uTime * .38 + aPhase) * sourceHeight * .008;
  vec4 mv = viewMatrix * world;
  gl_Position = projectionMatrix * mv;
  float distanceFade = exp(-sourceHeight * .22) * (1. - smoothstep(8., 11., sourceHeight));
  float bands = .38 + .62 * pow(.5 + .5 * sin(sourceHeight * 8. - uTime * 1.3 + aPhase * .15), 3.);
  vFade = distanceFade * bands;
  vGlint = .55 + .45 * sin(aPhase + uTime * .62);
  gl_PointSize = aSize * mix(.78, 1.416, m) * (.85 + vGlint * .2) * uPixelRatio * (26. / -mv.z);
}`;

const REFLECTION_FRAGMENT = /* glsl */ `
varying float vFade, vGlint, vMorph;
void main() {
  vec2 uv = gl_PointCoord - .5;
  float d = length(uv);
  float core = smoothstep(mix(.2, .11, vMorph), 0., d), halo = smoothstep(.5, mix(.055, .015, vMorph), d);
  float coreWeight = mix(1., .28, vMorph), haloWeight = mix(.38, .82, vMorph);
  vec3 treeCol = mix(vec3(.015, .28, .78), vec3(.12, .84, 1.), core + vGlint * .2);
  vec3 cubeCol = mix(vec3(.015, .18, .55), vec3(.06, .5, .88), halo);
  vec3 col = mix(treeCol, cubeCol, vMorph);
  float brightness = mix(.5, .27, vMorph);
  gl_FragColor = vec4(col, (core * coreWeight + halo * haloWeight) * vFade * brightness);
}`;

const WATER_VERTEX = /* glsl */ `
uniform float uTime, uMorph;
varying vec3 vP;
varying float vH;
float wave(vec2 p) {
  float r = length(p);
  return sin(r * 3.1 - uTime * 1.8) * .12 * exp(-r * .065) + sin(p.x * 1.35 + uTime * .7) * .045 + sin(p.y * 1.8 - uTime * .55) * .035;
}
void main() {
  vec3 p = position;
  float h = wave(p.xz);
  p.y += h;
  vP = p;
  vH = h;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
}`;

const WATER_FRAGMENT = /* glsl */ `
uniform float uTime;
varying vec3 vP;
varying float vH;
void main() {
  float e = .06;
  float hx = sin((length(vP.xz + vec2(e, 0.)) * 3.1) - uTime * 1.8) * .12;
  float hz = sin((length(vP.xz + vec2(0., e)) * 3.1) - uTime * 1.8) * .12;
  vec3 n = normalize(vec3(vH - hx, e, vH - hz));
  vec3 l = normalize(vec3(-.35, 1., .25));
  float spec = pow(max(dot(reflect(-l, n), normalize(vec3(0., 1., .6))), 0.), 36.);
  float wave = .5 + .5 * sin(length(vP.xz) * 4. - uTime * 1.7);
  float rings = pow(wave, 14.4);
  float halo = pow(wave, 5.5);
  float fade = exp(-length(vP.xz) * .1);
  float shimmer = pow(max(0., sin(vP.x * 2.8 + uTime * .85) * cos(vP.z * 4.2 - uTime * .62)), 18.) * fade;
  vec3 col = mix(vec3(.006, .028, .061), vec3(.022, .374, .792), rings * .5 + spec);
  col += vec3(.088, .605, 1.) * (shimmer * .3 + spec * .24 + halo * fade * .045);
  gl_FragColor = vec4(col, .48 + fade * .18 + rings * .11 + halo * fade * .025 + shimmer * .13);
}`;

const RIPPLE_VERTEX = /* glsl */ `
attribute float aAngle, aBand, aJitter, aSize, aPhase;
uniform float uTime, uPixelRatio;
varying float vAlpha, vSpark;
void main() {
  float cycle = mod(aBand * 2.25 + uTime * .48, 13.5);
  float r = .7 + cycle + aJitter;
  float angle = aAngle + sin(uTime * .12 + aPhase) * .012;
  vec3 p = vec3(cos(angle) * r, -.51, sin(angle) * r);
  p.y += sin(r * 3.1 - uTime * 1.8) * .105 * exp(-r * .06);
  float inner = smoothstep(.3, 1.6, cycle), outer = 1. - smoothstep(9.5, 13.5, cycle);
  float flick = .68 + .32 * sin(aPhase + uTime * .75);
  vAlpha = inner * outer * flick;
  vSpark = pow(flick, 3.);
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aSize * (1. + vSpark * .32) * uPixelRatio * (25. / -mv.z);
}`;

const RIPPLE_FRAGMENT = /* glsl */ `
varying float vAlpha, vSpark;
void main() {
  float d = length(gl_PointCoord - .5);
  float core = smoothstep(.18, 0., d), halo = smoothstep(.5, .06, d);
  vec3 col = mix(vec3(.015, .28, .9), vec3(.25, .92, 1.), core + vSpark * .2);
  gl_FragColor = vec4(col, (core + halo * .38) * vAlpha * .72);
}`;

const PLANE_VERTEX = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`;

const GLOW_FRAGMENT = /* glsl */ `
varying vec2 vUv;
uniform float uTime;
void main() {
  vec2 p = vUv - .5;
  float radial = exp(-dot(p * vec2(1.1, 1.45), p * vec2(1.1, 1.45)) * 8.);
  float mist = .86 + .14 * sin(uTime * .18 + vUv.y * 5.);
  gl_FragColor = vec4(.015, .22, .55, radial * mist * .2);
}`;

const SHAFT_FRAGMENT = /* glsl */ `
varying vec2 vUv;
void main() {
  float x = abs(vUv.x - .5) * 2.;
  float shaft = pow(max(0., 1. - x), 4.) * sin(vUv.y * 3.14159);
  gl_FragColor = vec4(.03, .42, .9, shaft * .055);
}`;

const STAR_VERTEX = /* glsl */ `
attribute float aSize, aPhase;
uniform float uTime, uPixelRatio;
varying float vGlow;
void main() {
  float twinkle = .5 + .5 * sin(aPhase + uTime * .34);
  vec4 mv = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aSize * 1.85 * (.86 + twinkle * .3) * uPixelRatio * (28. / -mv.z);
  vGlow = .42 + .58 * twinkle;
}`;

const STAR_FRAGMENT = /* glsl */ `
varying float vGlow;
void main() {
  float d = length(gl_PointCoord - .5);
  float core = smoothstep(.22, 0., d), halo = smoothstep(.5, .05, d);
  gl_FragColor = vec4(vec3(1.), (core + halo * .68) * vGlow);
}`;

const BOKEH_VERTEX = /* glsl */ `
attribute float aSize, aPhase;
uniform float uTime, uPixelRatio;
varying float vAlpha;
void main() {
  vec3 p = position;
  p.x += sin(uTime * .11 + aPhase) * .35;
  p.y += cos(uTime * .08 + aPhase) * .2;
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aSize * uPixelRatio * (18. / -mv.z);
  vAlpha = .035 + .025 * sin(uTime * .17 + aPhase);
}`;

const BOKEH_FRAGMENT = /* glsl */ `
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - .5);
  float a = smoothstep(.5, .05, d);
  gl_FragColor = vec4(.1, .55, 1., a * vAlpha);
}`;

const CHROMATIC_FRAGMENT = /* glsl */ `
uniform sampler2D tDiffuse;
uniform vec2 uResolution;
uniform float uStrength;
varying vec2 vUv;
void main() {
  vec2 center = vUv - .5;
  float radial = pow(clamp(length(center) * 1.75, 0., 1.), 1.2);
  vec2 direction = length(center) > .0001 ? normalize(center) : vec2(0.);
  vec2 offset = direction * (uStrength * radial) / uResolution;
  vec3 base = texture2D(tDiffuse, vUv).rgb;
  vec3 plusSample = texture2D(tDiffuse, vUv + offset).rgb;
  vec3 minusSample = texture2D(tDiffuse, vUv - offset).rgb;
  float plusLum = dot(plusSample, vec3(.299, .587, .114));
  float minusLum = dot(minusSample, vec3(.299, .587, .114));
  float spectralEdge = abs(plusLum - minusLum);
  vec3 fringeTint = mix(vec3(.015, .025, 1.), vec3(1., .012, .018), step(minusLum, plusLum));
  vec3 color = base + fringeTint * spectralEdge * 1.65;
  color.g = max(0., color.g - spectralEdge * .72);
  gl_FragColor = vec4(color, 1.);
}`;

/** Points sampled from the wordmark rendered to an offscreen canvas. */
function sampleWordmark(): THREE.Vector3[] {
  const w = 720;
  const h = 180;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];
  ctx.fillStyle = "#fff";
  ctx.font = "600 84px Geist, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(WORDMARK, w / 2, h / 2, w - 24);
  const data = ctx.getImageData(0, 0, w, h).data;
  const points: THREE.Vector3[] = [];
  for (let y = 0; y < h; y += 3) {
    for (let x = 0; x < w; x += 3) {
      if (data[(y * w + x) * 4 + 3] > 80) {
        points.push(new THREE.Vector3((x - w / 2) / 102.5, -(y - h / 2) / 102.5, 2.7));
      }
    }
  }
  return points;
}

export function createScene(canvas: HTMLCanvasElement): SceneHandle {
  const rand = Math.random;
  const mobile = innerWidth < 700;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x01040a);
  scene.fog = new THREE.FogExp2(0x020711, 0.036);

  const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 3.1, 17);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const chromatic = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      uResolution: { value: new THREE.Vector2(innerWidth, innerHeight) },
      uStrength: { value: 2 },
    },
    vertexShader: PLANE_VERTEX,
    fragmentShader: CHROMATIC_FRAGMENT,
  });
  composer.addPass(chromatic);

  const group = new THREE.Group();
  group.position.set(0, -0.38, 0);
  scene.add(group);

  const uniforms = {
    uTime: { value: 0 },
    uPixelRatio: { value: renderer.getPixelRatio() },
    uMorph: { value: 0 },
    uIntro: { value: 0 },
    uOpacity: { value: 1 },
    uPointer: { value: new THREE.Vector2(-1000, -1000) },
    uResolution: { value: new THREE.Vector2(innerWidth, innerHeight) },
    uHover: { value: 0 },
    uTreeRadius: { value: 170 },
    uCubeRadius: { value: 200 },
    uTreeSpread: { value: 0.056 },
    uCubeSpread: { value: 0.072 },
    uTreeCore: { value: 0.3 },
    uCubeCore: { value: 0.7 },
    uTreeRamp: { value: 1.2 },
    uCubeRamp: { value: 0.8 },
  };

  const additive = { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending } as const;

  // --- Tree particles -------------------------------------------------------
  const positions: number[] = [];
  const targets: number[] = [];
  const sizes: number[] = [];
  const phases: number[] = [];
  const drifts: number[] = [];
  const wordmark = sampleWordmark();

  /** Where particle `index` lands in the cube state: wordmark (1 in 4) or a cube face. */
  function cubeTarget(index: number): THREE.Vector3 {
    if (index % 4 === 0 && wordmark.length) {
      return wordmark[Math.floor(rand() * wordmark.length)]
        .clone()
        .add(new THREE.Vector3((rand() - 0.5) * 0.04, (rand() - 0.5) * 0.04, 0));
    }
    const half = 2.65;
    const p = new THREE.Vector3((rand() * 2 - 1) * half, (rand() * 2 - 1) * half, (rand() * 2 - 1) * half);
    const face = Math.floor(rand() * 6);
    const axis = Math.floor(face / 2);
    const sign = face % 2 ? 1 : -1;
    p.setComponent(axis, sign * half);
    // Push a third of the points onto an edge so the cube reads crisply.
    if (rand() < 0.34) {
      const edgeAxis = (axis + 1 + Math.floor(rand() * 2)) % 3;
      p.setComponent(edgeAxis, (rand() < 0.5 ? -1 : 1) * half);
    }
    return p;
  }

  function addPoint(x: number, y: number, z: number, size = 2, drift = 0) {
    positions.push(x, y, z);
    const t = cubeTarget(positions.length / 3);
    targets.push(t.x, t.y, t.z);
    sizes.push(size + 0.25);
    phases.push(rand() * 20);
    drifts.push(drift);
  }

  // Canopy: overlapping ellipsoids [x, y, z, rx, ry, rz].
  const canopy: [number, number, number, number, number, number][] = [
    [-2.5, 5.3, 0, 2.8, 1.7, 2.75],
    [-0.8, 6.35, 0.15, 2.7, 1.8, 2.8],
    [1.35, 6.2, -0.1, 2.8, 1.8, 2.85],
    [3, 5.1, 0.1, 2.45, 1.55, 2.4],
    [0, 4.85, 0, 3.9, 1.6, 3.2],
    [-3.7, 4.5, 0.2, 1.8, 1.25, 1.9],
    [0, 5.45, 1.75, 2.55, 1.6, 2.1],
    [0.25, 5.3, -1.8, 2.65, 1.55, 2.15],
  ];
  const perBlob = mobile ? 1820 : 3500;
  for (const [cx, cy, cz, rx, ry, rz] of canopy) {
    for (let i = 0; i < perBlob; i++) {
      const c = rand() * 2 - 1;
      const theta = rand() * Math.PI * 2;
      const u = Math.cbrt(rand());
      const s = Math.sqrt(1 - c * c);
      const x = cx + Math.cos(theta) * s * u * rx;
      const y = cy + c * u * ry;
      const z = cz + Math.sin(theta) * s * u * rz;
      const drift = x > 1.3 && rand() < 0.032 ? 0.1 + rand() * 0.2 : 0;
      addPoint(x, y, z, 1.2 + rand() * 2.6 + u * u * 1.3, drift);
    }
  }

  function branch(a: THREE.Vector3, b: THREE.Vector3, thickness: number, count: number) {
    const p = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      const r = rand();
      const w = (1 - r) * thickness + 0.07;
      p.lerpVectors(a, b, r);
      addPoint(p.x + (rand() - 0.5) * w, p.y + (rand() - 0.5) * w, p.z + (rand() - 0.5) * w, 1.2 + rand() * 1.7);
    }
  }
  const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

  branch(V(0, 0, 0), V(0, 3.8, 0), 1.7, 3600); // trunk

  const limbs: [number, number][] = [
    [-3.3, 5.3],
    [-1.7, 6],
    [-0.4, 6.5],
    [1.8, 6.2],
    [3.4, 5.25],
  ];
  limbs.forEach(([lx, ly], t) => {
    const mid = V(lx * 0.34, 3.5 + (t % 2) * 0.35, (t - 2) * 0.18);
    branch(V(0, 1.7, 0), mid, 0.8, 850);
    branch(mid, V(lx, ly, ((t % 2) - 0.5) * 0.6), 0.48, 900);
  });

  for (const side of [-1, 1]) {
    for (let e = 0; e < 4; e++) {
      const a = V((e - 1.5) * 0.34, 2.5 + e * 0.27, side * 0.18);
      const b = V((e - 1.5) * 0.62, 3.75 + e * 0.31, side * (1.25 + e * 0.32));
      const c = V((e - 1.5) * 1.02, 5.15 + e * 0.28, side * (3.05 + (e % 2) * 0.55));
      branch(a, b, 0.58, 620);
      branch(b, c, 0.34, 560);
      branch(c, V(c.x + (e % 2 ? -0.55 : 0.55), c.y + 0.48, c.z + side * 0.48), 0.16, 260);
    }
  }

  limbs.forEach(([lx, ly], t) => {
    for (let n = 0; n < 3; n++) {
      const a = V(lx * 0.62, ly - 0.72 + n * 0.18, (n - 1) * 0.32);
      const b = V(lx + (n - 1) * 0.72, ly + 0.25 + n * 0.36, (n - 1) * 0.85 + (t - 2) * 0.12);
      branch(a, b, 0.24, 430);
      branch(b, V(b.x + (n - 1) * 0.42, b.y + 0.42, b.z + (1 - n) * 0.26), 0.13, 230);
    }
  });

  // Starting shape for the intro: a loose sphere around the canopy.
  const spheres: number[] = [];
  for (let i = 0; i < positions.length / 3; i++) {
    const e = 1 - rand() * 2;
    const t = rand() * Math.PI * 2;
    const r = 3.15 * Math.cbrt(0.72 + rand() * 0.28);
    const s = Math.sqrt(1 - e * e);
    spheres.push(Math.cos(t) * s * r, 4.55 + e * r, Math.sin(t) * s * r);
  }

  const treeGeometry = new THREE.BufferGeometry();
  treeGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  treeGeometry.setAttribute("aTarget", new THREE.Float32BufferAttribute(targets, 3));
  treeGeometry.setAttribute("aSphere", new THREE.Float32BufferAttribute(spheres, 3));
  treeGeometry.setAttribute("aSize", new THREE.Float32BufferAttribute(sizes, 1));
  treeGeometry.setAttribute("aPhase", new THREE.Float32BufferAttribute(phases, 1));
  treeGeometry.setAttribute("aDrift", new THREE.Float32BufferAttribute(drifts, 1));

  const treeMaterial = new THREE.ShaderMaterial({
    ...additive,
    depthTest: false,
    uniforms,
    vertexShader: TREE_VERTEX,
    fragmentShader: TREE_FRAGMENT,
  });
  const tree = new THREE.Points(treeGeometry, treeMaterial);
  tree.renderOrder = 20;
  group.add(tree);

  const reflectionMaterial = new THREE.ShaderMaterial({
    ...additive,
    depthTest: false,
    uniforms: { uTime: uniforms.uTime, uMorph: uniforms.uMorph, uPixelRatio: uniforms.uPixelRatio, uIntro: uniforms.uIntro },
    vertexShader: REFLECTION_VERTEX,
    fragmentShader: REFLECTION_FRAGMENT,
  });
  const reflection = new THREE.Points(treeGeometry, reflectionMaterial);
  reflection.renderOrder = 4;
  group.add(reflection);

  // --- Water ----------------------------------------------------------------
  const waterGeometry = new THREE.PlaneGeometry(42, 26, mobile ? 120 : 220, mobile ? 80 : 140).rotateX(-Math.PI / 2);
  const waterMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: { uTime: uniforms.uTime, uMorph: uniforms.uMorph },
    vertexShader: WATER_VERTEX,
    fragmentShader: WATER_FRAGMENT,
  });
  const water = new THREE.Mesh(waterGeometry, waterMaterial);
  water.position.set(0, -0.66, 0);
  water.renderOrder = 0;
  scene.add(water);

  // --- Ripple sparks on the water ------------------------------------------
  const rippleCount = 2100;
  const rippleGeometry = new THREE.BufferGeometry();
  const angle = new Float32Array(rippleCount);
  const band = new Float32Array(rippleCount);
  const jitter = new Float32Array(rippleCount);
  const rippleSize = new Float32Array(rippleCount);
  const ripplePhase = new Float32Array(rippleCount);
  for (let i = 0; i < rippleCount; i++) {
    angle[i] = rand() * Math.PI * 2;
    band[i] = i % 6;
    jitter[i] = (rand() - 0.5) * 0.42;
    rippleSize[i] = (0.75 + rand() * 1.65) * 1.2;
    ripplePhase[i] = rand() * 20;
  }
  rippleGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(rippleCount * 3), 3));
  rippleGeometry.setAttribute("aAngle", new THREE.BufferAttribute(angle, 1));
  rippleGeometry.setAttribute("aBand", new THREE.BufferAttribute(band, 1));
  rippleGeometry.setAttribute("aJitter", new THREE.BufferAttribute(jitter, 1));
  rippleGeometry.setAttribute("aSize", new THREE.BufferAttribute(rippleSize, 1));
  rippleGeometry.setAttribute("aPhase", new THREE.BufferAttribute(ripplePhase, 1));
  const rippleMaterial = new THREE.ShaderMaterial({
    ...additive,
    depthTest: true,
    uniforms: { uTime: uniforms.uTime, uPixelRatio: uniforms.uPixelRatio },
    vertexShader: RIPPLE_VERTEX,
    fragmentShader: RIPPLE_FRAGMENT,
  });
  const ripples = new THREE.Points(rippleGeometry, rippleMaterial);
  ripples.frustumCulled = false; // positions are computed in the shader
  ripples.renderOrder = 3;
  scene.add(ripples);

  // --- Atmosphere: back glow and light shaft --------------------------------
  const glowGeometry = new THREE.PlaneGeometry(18, 12);
  const glowMaterial = new THREE.ShaderMaterial({
    ...additive,
    depthTest: false,
    uniforms: { uTime: uniforms.uTime },
    vertexShader: PLANE_VERTEX,
    fragmentShader: GLOW_FRAGMENT,
  });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  glow.position.set(0, 3.5, -3.5);
  glow.renderOrder = -2;
  scene.add(glow);

  const shaftGeometry = new THREE.PlaneGeometry(4.5, 12);
  const shaftMaterial = new THREE.ShaderMaterial({
    ...additive,
    depthTest: false,
    vertexShader: PLANE_VERTEX,
    fragmentShader: SHAFT_FRAGMENT,
  });
  const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
  shaft.position.set(0, 2.6, -2.8);
  shaft.renderOrder = -1;
  scene.add(shaft);

  // --- Stars ----------------------------------------------------------------
  const starPos: number[] = [];
  const starSize: number[] = [];
  const starPhase: number[] = [];
  for (let i = 0; i < 950; i++) {
    starPos.push((rand() - 0.5) * 34, 1 + rand() * 16, -5 - rand() * 13);
    starSize.push(0.45 + rand() * 1.25);
    starPhase.push(rand() * 20);
  }
  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starPos, 3));
  starGeometry.setAttribute("aSize", new THREE.Float32BufferAttribute(starSize, 1));
  starGeometry.setAttribute("aPhase", new THREE.Float32BufferAttribute(starPhase, 1));
  const starMaterial = new THREE.ShaderMaterial({
    ...additive,
    depthTest: true,
    uniforms: { uTime: uniforms.uTime, uPixelRatio: uniforms.uPixelRatio },
    vertexShader: STAR_VERTEX,
    fragmentShader: STAR_FRAGMENT,
  });
  const stars = new THREE.Points(starGeometry, starMaterial);
  stars.renderOrder = 1;
  scene.add(stars);

  // --- Foreground bokeh -----------------------------------------------------
  const bokehPos: number[] = [];
  const bokehSize: number[] = [];
  const bokehPhase: number[] = [];
  for (let i = 0; i < 42; i++) {
    bokehPos.push((rand() - 0.5) * 24, -1 + rand() * 11, 5 + rand() * 4);
    bokehSize.push(10 + rand() * 24);
    bokehPhase.push(rand() * 20);
  }
  const bokehGeometry = new THREE.BufferGeometry();
  bokehGeometry.setAttribute("position", new THREE.Float32BufferAttribute(bokehPos, 3));
  bokehGeometry.setAttribute("aSize", new THREE.Float32BufferAttribute(bokehSize, 1));
  bokehGeometry.setAttribute("aPhase", new THREE.Float32BufferAttribute(bokehPhase, 1));
  const bokehMaterial = new THREE.ShaderMaterial({
    ...additive,
    depthTest: false,
    uniforms: { uTime: uniforms.uTime, uPixelRatio: uniforms.uPixelRatio },
    vertexShader: BOKEH_VERTEX,
    fragmentShader: BOKEH_FRAGMENT,
  });
  const bokeh = new THREE.Points(bokehGeometry, bokehMaterial);
  bokeh.renderOrder = 30;
  scene.add(bokeh);

  // --- Interaction and loop -------------------------------------------------
  let progress = 0;
  let pointerX = 0;
  let pointerY = 0;
  let spin = 0;
  let paused = false;
  let frame = 0;
  let frameCallback: ((time: number) => void) | null = null;
  const clock = new THREE.Clock();

  const onPointerMove = (event: PointerEvent) => {
    pointerX = event.clientX / innerWidth - 0.5;
    pointerY = event.clientY / innerHeight - 0.5;
    uniforms.uPointer.value.set(event.clientX, innerHeight - event.clientY);
    uniforms.uHover.value = 1;
  };
  const onPointerLeave = () => {
    uniforms.uHover.value = 0;
  };
  const onResize = () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    composer.setSize(innerWidth, innerHeight);
    chromatic.uniforms.uResolution.value.set(innerWidth, innerHeight);
    uniforms.uPixelRatio.value = renderer.getPixelRatio();
    uniforms.uResolution.value.set(innerWidth, innerHeight);
  };
  addEventListener("pointermove", onPointerMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onPointerLeave);
  addEventListener("resize", onResize);

  function tick() {
    frame = requestAnimationFrame(tick);
    const time = clock.getElapsedTime();
    frameCallback?.(time);
    if (paused) return;

    const morph = clamp01((progress - 0.54) / 0.34);
    // Once the cube has fully formed it keeps turning slowly; unwind when scrolling back.
    if (morph > 0.995) spin += 0.0018;
    if (morph < 0.9 && spin >= Math.PI * 2) {
      const turns = Math.floor(spin / (Math.PI * 2));
      spin -= turns * Math.PI * 2;
      group.rotation.y -= turns * Math.PI * 2;
    }
    if (morph < 0.5) spin = 0;

    uniforms.uTime.value = time;
    uniforms.uMorph.value = morph;
    group.position.y = -0.38 + morph * 3.9;
    group.scale.setScalar(1 - morph * 0.15);

    const targetY = pointerX * 0.12 * (1 - morph) + morph * Math.PI * 4 + morph * 0.55 + spin * smoothstep(0.9, 1, morph);
    group.rotation.y += (targetY - group.rotation.y) * 0.035;
    group.rotation.x += (pointerY * 0.035 * (1 - morph) + morph * 0.34 - group.rotation.x) * 0.03;
    group.rotation.z += (morph * 0.08 - group.rotation.z) * 0.03;

    const pulse = Math.sin(morph * Math.PI);
    chromatic.uniforms.uStrength.value = 1.4 + pulse * 3.15;
    // Portrait screens: pull back as the cube forms so it fits the narrow frame.
    const portraitPullback = camera.aspect < 1 ? (1 - camera.aspect) * 14 * morph : 0;
    camera.position.z = 17 + portraitPullback - progress * 0.7 - pulse * 0.182 + Math.sin(time * 0.34) * 0.11;
    camera.position.y = 3.1 + Math.sin(time * 0.21) * 0.045;
    camera.lookAt(0, 3.2, 0);

    composer.render();
  }
  tick();

  return {
    setProgress(value) {
      progress = clamp01(value);
    },
    setIntro(value) {
      uniforms.uIntro.value = clamp01(value);
    },
    onFrame(cb) {
      frameCallback = cb;
    },
    setPaused(value) {
      paused = value;
    },
    dispose() {
      cancelAnimationFrame(frame);
      removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      removeEventListener("resize", onResize);
      for (const g of [treeGeometry, waterGeometry, rippleGeometry, glowGeometry, shaftGeometry, starGeometry, bokehGeometry]) g.dispose();
      for (const m of [treeMaterial, reflectionMaterial, waterMaterial, rippleMaterial, glowMaterial, shaftMaterial, starMaterial, bokehMaterial]) m.dispose();
      composer.dispose();
      renderer.dispose();
    },
  };
}
