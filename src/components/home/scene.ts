// The home-page scene: 10,000 wireframe pyramids whose positions are simulated on
// the GPU. They build a brain on load, follow the scroll, burst into a floating
// field and finally regroup as the map of Paraguay.
//
// three is pinned to 0.149.0: the material patches below replace shader chunks
// (`output_fragment`, `project_vertex`) by their r149 names.
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { Pass, FullScreenQuad } from "three/examples/jsm/postprocessing/Pass.js";
import { VignetteShader } from "three/examples/jsm/shaders/VignetteShader.js";
import * as G from "./shaders";

const SHAPES_URL = "/brain/shapes.bin";
const SHAPES = 2;
const N = 10000;

type Uniform = { id: string; type: string; value: unknown };
type DepthUniforms = Record<string, { type: string; value: unknown }>;
type Vec2 = { x: number; y: number };

const clamp = (e: number, t: number, n: number) => Math.min(Math.max(e, t), n);
const map = (e: number, t: number, n: number, i: number, r: number) => ((e - t) / (n - t)) * (r - i) + i;
/** Linear ramp from `a` to `b` while `e` goes from `from` to `to`, held outside. */
const ramp = (e: number, from: number, to: number, a: number, b: number) =>
  clamp(map(e, from, to, a, b), Math.min(a, b), Math.max(a, b));
const visibleAt = (cam: THREE.PerspectiveCamera, depth: number) => {
  const h = 2 * Math.tan((cam.fov * Math.PI) / 360) * Math.abs(depth);
  return { width: h * cam.aspect, height: h };
};

/** A big triangle with its own orthographic camera, used for the simulation passes. */
function fullscreen(material: THREE.Material) {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-0.5, -0.5, 1.5, -0.5, -0.5, 1.5]), 2));
  g.setAttribute("uv", new THREE.BufferAttribute(new Float32Array([0, 0, 2, 0, 0, 2]), 2));
  const mesh = new THREE.Mesh(g, material);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 1);
  mesh.frustumCulled = false;
  scene.add(mesh);
  return { mesh, scene, camera };
}

function pingPong(w: number, h: number, type: THREE.TextureDataType) {
  const o = {
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type,
    depthBuffer: false,
    stencilBuffer: false,
    generateMipmaps: false,
  };
  const p = {
    read: new THREE.WebGLRenderTarget(w, h, o),
    write: new THREE.WebGLRenderTarget(w, h, o),
    swap() {
      const r = p.read;
      p.read = p.write;
      p.write = r;
    },
  };
  return p;
}

function inject(shader: THREE.Shader, uniforms: Uniform[]) {
  for (const u of uniforms) {
    shader.uniforms[u.id] = u;
    shader.vertexShader = `uniform ${u.type} ${u.id};\n` + shader.vertexShader;
    shader.fragmentShader = `uniform ${u.type} ${u.id};\n` + shader.fragmentShader;
  }
}

/** Depth material for the bokeh pass, sharing the vertex transform of the visible material. */
function depthMaterial(uniforms: DepthUniforms, patch: (s: THREE.Shader) => void) {
  let vs = `varying vec2 vUv;\nvarying float vViewZDepth;\nvoid main(){\n  #include <begin_vertex>\n  #include <project_vertex>\n  vViewZDepth=-mvPosition.z;\n  vUv=uv;\n}`;
  let fs = `varying float vViewZDepth;\nvarying vec2 vUv;\nvoid main(){\n${G.DEPTH_FRAGMENT}\n}`;
  uniforms.u_near = { type: "float", value: 0.1 };
  uniforms.u_far = { type: "float", value: 13 };
  for (const k in uniforms) {
    vs = `uniform ${uniforms[k].type} ${k};\n` + vs;
    fs = `uniform ${uniforms[k].type} ${k};\n` + fs;
  }
  const m = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: uniforms as Record<string, THREE.IUniform>,
    vertexShader: vs,
    fragmentShader: fs,
  });
  m.onBeforeCompile = patch;
  return m;
}

/** A wireframe-style pyramid: four triangular faces, each reduced to a thin frame. */
function pyramidGeometry() {
  const apex = new THREE.Vector3(0, 0.66, 0);
  const base = [0, 1, 2].map((i) => {
    const a = (i / 3) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(a) * 0.58, -0.33, Math.sin(a) * 0.58);
  });
  const faces = [
    [apex, base[0], base[1]],
    [apex, base[1], base[2]],
    [apex, base[2], base[0]],
    [base[0], base[2], base[1]],
  ];
  const inset = 0.8;
  const pos: number[] = [];
  for (const f of faces) {
    const c = new THREE.Vector3().add(f[0]).add(f[1]).add(f[2]).multiplyScalar(1 / 3);
    const inner = f.map((v) => c.clone().lerp(v, inset));
    for (let i = 0; i < 3; i++) {
      const j = (i + 1) % 3;
      for (const v of [f[i], f[j], inner[j], f[i], inner[j], inner[i]]) pos.push(v.x, v.y, v.z);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pos), 3));
  g.setAttribute("uv", new THREE.BufferAttribute(new Float32Array((pos.length / 3) * 2), 2));
  return g;
}

type ShapeData = {
  position: THREE.DataTexture;
  scale: THREE.DataTexture;
  color: THREE.DataTexture;
  /** Positions quantised to 8 bits per shape, used to rank the cones. */
  bytes: Uint8Array[];
};

/** Unpacks shapes.bin (see scripts/build-brain-data.mjs) into 200×200 textures, one shape per quadrant. */
function unpackShapes(buffer: ArrayBuffer): ShapeData {
  const pos = new Uint16Array(buffer, 0, SHAPES * N * 3);
  const col = new Uint8Array(buffer, SHAPES * N * 6, SHAPES * N * 3);
  const scl = new Uint8Array(buffer, SHAPES * N * 9, SHAPES * N);
  const P = new Float32Array(200 * 200 * 4);
  const C = new Uint8Array(200 * 200 * 4);
  const S = new Uint8Array(200 * 200 * 4);
  const bytes = Array.from({ length: SHAPES }, () => new Uint8Array(N * 4));
  for (let q = 0; q < 4; q++) {
    const s = Math.min(q, SHAPES - 1);
    const ox = (q % 2) * 100;
    const oy = Math.floor(q / 2) * 100;
    for (let i = 0; i < N; i++) {
      const t = ((oy + Math.floor(i / 100)) * 200 + ox + (i % 100)) * 4;
      const o = (s * N + i) * 3;
      for (let a = 0; a < 3; a++) {
        P[t + a] = pos[o + a] / 65535;
        C[t + a] = col[o + a];
        if (q === s) bytes[s][i * 4 + a] = pos[o + a] >> 8;
      }
      P[t + 3] = 1;
      C[t + 3] = 255;
      S[t] = scl[s * N + i];
      S[t + 3] = 255;
    }
  }
  const make = (data: Float32Array | Uint8Array, type: THREE.TextureDataType) => {
    const t = new THREE.DataTexture(data as BufferSource, 200, 200, THREE.RGBAFormat, type);
    t.minFilter = t.magFilter = THREE.NearestFilter;
    t.generateMipmaps = false;
    t.needsUpdate = true;
    return t;
  };
  return {
    position: make(P, THREE.FloatType),
    scale: make(S, THREE.UnsignedByteType),
    color: make(C, THREE.UnsignedByteType),
    bytes,
  };
}

class BokehPass extends Pass {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderTargetDepth: THREE.WebGLRenderTarget;
  private materialDepth: THREE.MeshDepthMaterial;
  private uniforms: Record<string, THREE.IUniform>;
  private fsQuad: FullScreenQuad;
  private old = new THREE.Color();
  private saved = new Map<THREE.Mesh, THREE.Material | THREE.Material[]>();

  constructor(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    o: { width: number; height: number; focalDepth: number; focalLength: number; fstop: number; maxblur: number },
  ) {
    super();
    this.scene = scene;
    this.camera = camera;
    this.renderTargetDepth = new THREE.WebGLRenderTarget(o.width, o.height, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
    });
    this.materialDepth = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, blending: THREE.NoBlending });
    this.uniforms = {
      tColor: { value: null },
      tDepth: { value: this.renderTargetDepth.texture },
      textureWidth: { value: o.width },
      textureHeight: { value: o.height },
      focalDepth: { value: o.focalDepth },
      focalLength: { value: o.focalLength },
      fstop: { value: o.fstop },
      maxblur: { value: o.maxblur },
      threshold: { value: 0.5 },
      gain: { value: 0 },
      bias: { value: 0 },
      fringe: { value: 0.7 },
      znear: { value: camera.near },
      zfar: { value: camera.far },
      dithering: { value: 1e-4 },
    };
    const material = new THREE.ShaderMaterial({
      defines: { RINGS: 4, SAMPLES: 6 },
      uniforms: this.uniforms,
      vertexShader: G.BOKEH_VERTEX,
      fragmentShader: G.BOKEH_FRAGMENT,
    });
    this.needsSwap = true;
    this.fsQuad = new FullScreenQuad(material);
  }

  setSize(w: number, h: number) {
    this.uniforms.textureWidth.value = w;
    this.uniforms.textureHeight.value = h;
    this.renderTargetDepth.setSize(w, h);
  }

  render(renderer: THREE.WebGLRenderer, writeBuffer: THREE.WebGLRenderTarget, readBuffer: THREE.WebGLRenderTarget) {
    this.scene.traverse((e) => {
      const mesh = e as THREE.Mesh;
      if (!mesh.isMesh) return;
      this.saved.set(mesh, mesh.material);
      mesh.material = mesh.customDepthMaterial ?? this.materialDepth;
    });
    renderer.getClearColor(this.old);
    const alpha = renderer.getClearAlpha();
    const autoClear = renderer.autoClear;
    renderer.autoClear = false;
    renderer.setClearColor(0);
    renderer.setClearAlpha(1);
    renderer.setRenderTarget(this.renderTargetDepth);
    renderer.clear();
    renderer.render(this.scene, this.camera);
    this.uniforms.tColor.value = readBuffer.texture;
    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
      this.fsQuad.render(renderer);
    } else {
      renderer.setRenderTarget(writeBuffer);
      renderer.clear();
      this.fsQuad.render(renderer);
    }
    this.saved.forEach((material, mesh) => {
      mesh.material = material;
    });
    this.saved.clear();
    renderer.setClearColor(this.old);
    renderer.setClearAlpha(alpha);
    renderer.autoClear = autoClear;
  }
}

/** The pyramids that float in front of everything. */
class FrontCones extends THREE.Object3D {
  private mouseTarget: Vec2 = { x: 0, y: 0 };
  private uniforms: Uniform[];
  private depthUniforms: DepthUniforms;

  constructor(geometry: THREE.BufferGeometry, camera: THREE.PerspectiveCamera, private mobile: boolean) {
    super();
    const count = 250;
    const g = geometry.clone();
    const U: Uniform[] = [
      { id: "u_time", type: "float", value: 0 },
      { id: "u_scale", type: "float", value: 1 },
      { id: "u_resolution", type: "vec2", value: new THREE.Vector2() },
      { id: "u_mouse", type: "vec2", value: new THREE.Vector2() },
    ];
    this.uniforms = U;
    const head = "varying vec4 v_color;\nattribute vec4 a_color;\nattribute vec4 a_angle;\nattribute vec4 a_param;\n" + G.MAP + G.ROTATION;
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, side: THREE.DoubleSide });
    material.onBeforeCompile = (s) => {
      inject(s, U);
      s.vertexShader = (head + s.vertexShader)
        .replace("#include <project_vertex>", G.FRONT_VERTEX)
        .replace("#include <worldpos_vertex>", G.WORLDPOS);
      s.fragmentShader = ("varying vec4 v_color;\n" + s.fragmentShader).replace("#include <output_fragment>", G.FRONT_FRAGMENT);
    };
    const mesh = new THREE.InstancedMesh(g, material, count);
    mesh.frustumCulled = false;
    const mat = new THREE.Matrix4();
    const p = new THREE.Vector3();
    const q = new THREE.Quaternion();
    const sc = new THREE.Vector3();
    const col = new Float32Array(4 * count);
    const ang = new Float32Array(4 * count);
    const par = new Float32Array(4 * count);
    const palette = [
      [93, 57, 154],
      [186, 136, 43],
      [40, 116, 100],
      [164, 148, 175],
    ];
    for (let i = 0; i < count; i++) {
      const f = mobile ? 0.075 : 0.05;
      p.set(2 * Math.random() - 1, 2 * Math.random() - 1, 9 * Math.random());
      sc.set(f, f, f);
      mat.compose(p, q, sc);
      mesh.setMatrixAt(i, mat);
      const c = palette[i % 4];
      col.set([c[0] / 255, c[1] / 255, c[2] / 255, Math.random()], 4 * i);
      ang.set([2 * Math.random() - 1, 2 * Math.random() - 1, 2 * Math.random() - 1, 2 * Math.random() - Math.PI], 4 * i);
      par.set([Math.random(), Math.random(), Math.random(), Math.random()], 4 * i);
    }
    g.setAttribute("a_param", new THREE.InstancedBufferAttribute(par, 4));
    g.setAttribute("a_color", new THREE.InstancedBufferAttribute(col, 4));
    g.setAttribute("a_angle", new THREE.InstancedBufferAttribute(ang, 4));
    this.depthUniforms = {
      u_time: { type: "float", value: 0 },
      u_scale: { type: "float", value: 1 },
      u_resolution: { type: "vec2", value: new THREE.Vector2() },
      u_mouse: { type: "vec2", value: new THREE.Vector2() },
    };
    mesh.customDepthMaterial = depthMaterial(this.depthUniforms, (s) => {
      s.vertexShader = (head + s.vertexShader).replace("#include <project_vertex>", G.FRONT_VERTEX);
    });
    this.add(mesh);
    this.resize(camera);
  }

  onMousemove(m: Vec2) {
    this.mouseTarget = { x: m.x, y: m.y };
  }

  resize(camera: THREE.PerspectiveCamera) {
    const s = visibleAt(camera, 9.9);
    (this.uniforms[2].value as THREE.Vector2).set(s.width, s.height);
    (this.depthUniforms.u_resolution.value as THREE.Vector2).set(s.width, s.height);
  }

  update(t: number, e: number) {
    this.uniforms[0].value = t;
    this.depthUniforms.u_time.value = t;
    for (const m of [this.uniforms[3].value as THREE.Vector2, this.depthUniforms.u_mouse.value as THREE.Vector2]) {
      m.x += (0.25 * this.mouseTarget.x - m.x) * 0.1;
      m.y += (0.25 * this.mouseTarget.y - m.y) * 0.1;
    }
    if (this.mobile) {
      const tx = ramp(e, 0, 1, 2, -5) + ramp(e, 1.25, 1.5, 0, 5) - ramp(e, 2.7, 3, 0, 5);
      this.position.x += (0.25 * tx - this.position.x) * 0.1;
    }
  }
}

/** The 10,000 cones. */
class Cones extends THREE.Object3D {
  private nb: number;
  private factor: number;
  private hasRendered = false;
  private easing = 0.1;
  private mTg: Vec2 = { x: 0, y: 0 };
  private mPr: Vec2 = { x: 0, y: 0 };
  private mDelta: Vec2 = { x: 0, y: 0 };
  private baseRotationY = -0.25 * Math.PI;
  private u: Uniform[];
  private du: DepthUniforms = {};
  private fboPos: ReturnType<typeof pingPong>;
  private fboSpring: ReturnType<typeof pingPong>;
  private simPos: ReturnType<typeof fullscreen>;
  private simSpring: ReturnType<typeof fullscreen>;
  private started = 0;
  readonly disposables: { dispose(): void }[] = [];

  constructor(
    private renderer: THREE.WebGLRenderer,
    data: ShapeData,
    geometry: THREE.BufferGeometry,
    camera: THREE.PerspectiveCamera,
    private mobile: boolean,
  ) {
    super();
    const nb = (this.nb = mobile ? 7000 : N);
    const factor = (this.factor = mobile ? 2.5 : 4.35);
    this.position.set(0, -1.19, 0);

    // Rank the cones by height and by side, so the build-up, the explosion and
    // the regrouping ripple across the shape instead of happening all at once.
    const rank = (buf: Uint8Array, k: number, dir: number) => {
      const a = Array.from({ length: N }, (_, j) => ({ v: buf[4 * j + k], index: j, order: 0 }));
      a.sort((x, y) => dir * (x.v - y.v));
      a.forEach((x, i) => (x.order = i));
      a.sort((x, y) => x.index - y.index);
      return a;
    };
    const [brain, paraguay] = data.bytes;
    const topDown = rank(brain, 1, -1);
    const bottomUp = rank(brain, 1, 1);
    const leftRight = rank(paraguay, 0, 1);
    const tex = () => {
      const d = new THREE.DataTexture(new Float32Array(4 * N), 100, 100, THREE.RGBAFormat, THREE.FloatType);
      d.minFilter = d.magFilter = THREE.NearestFilter;
      d.generateMipmaps = false;
      return d;
    };
    const tParams = tex();
    const tParams2 = tex();
    const tParams3 = tex();
    for (let i = 0; i < nb; i++) {
      const sign = i % 2 === 0 ? 1 : -1;
      tParams.image.data.set([sign * Math.random(), Math.floor(i / 100) / 200 + 0.0025, topDown[i].order, 2e-4 * Math.random() - 1e-4], 4 * i);
      tParams2.image.data.set([leftRight[i].order, 0, 0, bottomUp[i].order], 4 * i);
      tParams3.image.data.set([1 + 5 * Math.random(), 2 * Math.random() - 1, map(brain[4 * i], 0, 256, -1, 1), 0], 4 * i);
    }
    tParams.needsUpdate = tParams2.needsUpdate = tParams3.needsUpdate = true;

    const ftype = mobile ? THREE.HalfFloatType : THREE.FloatType;
    this.fboPos = pingPong(200, 200, ftype);
    this.fboSpring = pingPong(200, 200, ftype);
    const delay = mobile ? 25e-6 : 5e-4;
    const common = () => ({
      t_params: { value: tParams },
      t_params2: { value: tParams2 },
      t_position: { value: data.position },
      u_show: { value: 0 },
      u_length: { value: nb },
      u_explode: { value: 0 },
      u_factor: { value: factor },
      u_progress: { value: 0 },
      u_rendered: { value: 0 },
    });
    this.simPos = fullscreen(
      new THREE.RawShaderMaterial({
        uniforms: { ...common(), t_velocity: { value: null }, t_oPos: { value: null } },
        vertexShader: G.SIM_VERTEX,
        fragmentShader: G.SIM_POS,
      }),
    );
    this.simSpring = fullscreen(
      new THREE.RawShaderMaterial({
        uniforms: {
          ...common(),
          t_params3: { value: tParams3 },
          t_oTarget: { value: null },
          t_oVelocity: { value: null },
          u_spring: { value: 0.006 },
          u_friction: { value: 0.892 },
          u_delay: { value: delay },
        },
        vertexShader: G.SIM_VERTEX,
        fragmentShader: G.SIM_SPRING,
      }),
    );

    const g = geometry.clone();
    const U: Uniform[] = (this.u = [
      { id: "t_scale", type: "sampler2D", value: data.scale },
      { id: "t_color", type: "sampler2D", value: data.color },
      { id: "t_simulation", type: "sampler2D", value: null },
      { id: "u_time", type: "float", value: 0 },
      { id: "u_scale", type: "float", value: mobile ? 1.2 : 1.55 },
      { id: "u_amplitude", type: "float", value: 0.619 },
      { id: "u_colorFactor", type: "float", value: 1.3 },
      { id: "u_mouse", type: "vec2", value: new THREE.Vector2() },
      { id: "u_resolution", type: "vec2", value: new THREE.Vector2() },
      { id: "u_resolution2", type: "vec2", value: new THREE.Vector2() },
      { id: "u_offset", type: "vec3", value: new THREE.Vector3() },
      { id: "u_rotation", type: "vec3", value: new THREE.Vector3() },
      { id: "u_explode", type: "float", value: 0 },
      { id: "u_progress", type: "float", value: 0 },
      { id: "u_progress2", type: "float", value: 0 },
      { id: "u_delta", type: "vec2", value: new THREE.Vector2() },
      { id: "u_mobileRotation", type: "float", value: mobile ? Math.PI : 0 },
    ]);
    const head =
      "varying float v_hover;\nvarying vec3 v_pos;\nvarying vec2 v_id;\nattribute vec2 a_id;\nattribute vec4 a_random;\n" +
      G.ROTATION +
      G.SNOISE;
    const material = new THREE.MeshBasicMaterial({ transparent: true, side: THREE.DoubleSide });
    material.onBeforeCompile = (sh) => {
      inject(sh, U);
      sh.vertexShader = (head + sh.vertexShader)
        .replace("#include <project_vertex>", G.CONE_VERTEX)
        .replace("#include <worldpos_vertex>", G.WORLDPOS);
      sh.fragmentShader = ("varying float v_hover;\nvarying vec2 v_id;\nvarying vec3 v_pos;\n" + sh.fragmentShader).replace(
        "#include <output_fragment>",
        G.CONE_FRAGMENT,
      );
    };
    const mesh = new THREE.InstancedMesh(g, material, nb);
    mesh.frustumCulled = false;
    const mat = new THREE.Matrix4().compose(new THREE.Vector3(), new THREE.Quaternion(), new THREE.Vector3(0.1, 0.1, 0.1));
    const rnd = new Float32Array(4 * nb);
    const id = new Float32Array(2 * nb);
    for (let i = 0; i < nb; i++) {
      mesh.setMatrixAt(i, mat);
      id[2 * i] = (i % 100) / 200 + 0.0025;
      id[2 * i + 1] = Math.floor(i / 100) / 200 + 0.0025;
      rnd.set(
        [(i % 2 === 0 ? 1 : -1) * Math.random(), 0.8 * Math.random() + 0.2, mobile ? 0.5 * Math.random() : 0.5 * Math.random() + 0.5, 0],
        4 * i,
      );
    }
    g.setAttribute("a_id", new THREE.InstancedBufferAttribute(id, 2));
    g.setAttribute("a_random", new THREE.InstancedBufferAttribute(rnd, 4));
    for (const u of U) this.du[u.id] = { type: u.type, value: u.value };
    mesh.customDepthMaterial = depthMaterial(this.du, (sh) => {
      sh.vertexShader = (head + sh.vertexShader).replace("#include <project_vertex>", G.CONE_VERTEX);
    });
    this.add(mesh);
    this.resize(camera);
    this.disposables.push(
      g, material, mesh.customDepthMaterial, tParams, tParams2, tParams3,
      this.fboPos.read, this.fboPos.write, this.fboSpring.read, this.fboSpring.write,
      this.simPos.mesh.material as THREE.Material, this.simSpring.mesh.material as THREE.Material,
    );
  }

  private uni<T>(id: string) {
    return this.u.find((u) => u.id === id)!.value as T;
  }
  private set(id: string, v: unknown) {
    this.u.find((u) => u.id === id)!.value = v;
    this.du[id].value = v;
  }
  private ease(id: string, target: number, k: number) {
    this.set(id, this.uni<number>(id) + (target - this.uni<number>(id)) * k);
  }

  onMousemove(m: Vec2) {
    this.mTg = { x: m.x, y: m.y };
    const lim = this.mobile ? 0.1 : 2;
    this.mDelta.x = clamp(50 * (this.mTg.x - this.mPr.x), -lim, lim);
    this.mDelta.y = clamp(50 * (this.mTg.y - this.mPr.y), -lim, lim);
    this.mPr = { x: m.x, y: m.y };
  }
  onPointerdown(m: Vec2) {
    this.mTg = { ...m };
    this.mPr = { ...m };
    this.mDelta = { x: 0, y: 0 };
  }
  onMouseleave() {
    this.mDelta = { x: 0, y: 0 };
  }

  resize(camera: THREE.PerspectiveCamera) {
    const a = visibleAt(camera, 10);
    const b = visibleAt(camera, 6.5);
    this.uni<THREE.Vector2>("u_resolution").set(a.width, a.height);
    this.uni<THREE.Vector2>("u_resolution2").set(b.width, b.height);
  }

  /** `t` in seconds; `e` is the scroll progress (0 hero · 1 second panel · 2–2.6 field · 3 map). */
  update(t: number, e: number, instant: boolean) {
    this.set("u_time", t);
    const sp = (this.simPos.mesh.material as THREE.RawShaderMaterial).uniforms;
    const ss = (this.simSpring.mesh.material as THREE.RawShaderMaterial).uniforms;

    // Build-up: 3 s, linear; the base rotation eases out alongside it.
    if (!this.started) this.started = t;
    const k = instant ? 1 : Math.min(1, (t - this.started) / 3);
    sp.u_show.value = ss.u_show.value = k;
    this.rotation.y = this.baseRotationY * (1 - k) * (1 - k);

    // Rotation
    // A three-quarter view for the second panel; back to the front for the map.
    const ry = ramp(e, 0, 1, 0, -0.3 * Math.PI) + ramp(e, 2.7, 3, 0, 0.3 * Math.PI);
    const R = this.uni<THREE.Vector3>("u_rotation");
    const slow = 0.75 * this.easing;
    R.y += (ry - R.y) * slow;

    // Mouse
    this.mDelta.x += (0 - this.mDelta.x) * this.easing;
    this.mDelta.y += (0 - this.mDelta.y) * this.easing;
    const M = this.uni<THREE.Vector2>("u_mouse");
    const D = this.uni<THREE.Vector2>("u_delta");
    M.x += (this.mTg.x - M.x) * slow;
    M.y += (this.mTg.y - M.y) * slow;
    D.x += (this.mDelta.x - D.x) * slow;
    D.y += (this.mDelta.y - D.y) * slow;

    // Offset, explosion, radius and shape follow the scroll
    let tx: number, ty: number, ex: number, pr: number;
    let fa: number | null = null;
    let p2: number | null = null;
    if (this.mobile) {
      tx = ramp(e, 0, 1, 1.5, 0) + 0.052 * M.x;
      ty = 2;
      ex = ramp(e, 1.4, 1.7, 0, 1) - ramp(e, 2.7, 3, 0, 1);
      pr = ramp(e, 2.7, 3, 0, 1);
    } else {
      tx = ramp(e, 0, 1, 3, -4.5) + ramp(e, 1.25, 1.5, 0.905, 5) - ramp(e, 2.8, 3, 0.905, 3);
      ty = ramp(e, 2.7, 3, 0, 0.5);
      ex = ramp(e, 1.1, 2.2, 0, 1) - ramp(e, 2.8, 3, 0, 1);
      fa = this.factor + ramp(e, 0, 1, 0, 1) - ramp(e, 1.25, 1.5, 0, 1);
      pr = ramp(e, 2.7, 3, 0, 1);
      p2 = ramp(e, 0, 1, 0, 1) - ramp(e, 2.7, 3, 0, 1);
    }
    const E = this.easing;
    this.ease("u_explode", ex, E);
    // The exploded field sits behind text, so it is dimmed while it is a backdrop.
    this.set("u_colorFactor", 1.3 - 0.62 * this.uni<number>("u_explode"));
    sp.u_explode.value += (ex - sp.u_explode.value) * E;
    ss.u_explode.value += (ex - ss.u_explode.value) * E;
    if (fa !== null) {
      sp.u_factor.value += (fa - sp.u_factor.value) * E;
      ss.u_factor.value += (fa - ss.u_factor.value) * E;
    }
    this.ease("u_progress", pr, E);
    sp.u_progress.value += (pr - sp.u_progress.value) * E;
    ss.u_progress.value += (pr - ss.u_progress.value) * E;
    if (p2 !== null) this.ease("u_progress2", p2, E);
    const O = this.uni<THREE.Vector3>("u_offset");
    O.x += (tx - O.x) * E;
    O.y += (ty - O.y) * E;
    this.simulate();
  }

  private simulate() {
    const r = this.renderer;
    const sp = (this.simPos.mesh.material as THREE.RawShaderMaterial).uniforms;
    const ss = (this.simSpring.mesh.material as THREE.RawShaderMaterial).uniforms;
    if (this.hasRendered) {
      ss.t_oTarget.value = this.fboPos.read.texture;
      r.setRenderTarget(this.fboSpring.write);
      r.render(this.simSpring.scene, this.simSpring.camera);
      this.fboSpring.swap();
      ss.t_oVelocity.value = this.fboSpring.read.texture;
      sp.t_velocity.value = this.fboSpring.read.texture;
      r.setRenderTarget(this.fboPos.write);
      r.render(this.simPos.scene, this.simPos.camera);
      this.fboPos.swap();
      sp.t_oPos.value = this.fboPos.read.texture;
      this.set("t_simulation", this.fboPos.read.texture);
    } else {
      r.setRenderTarget(this.fboPos.write);
      r.render(this.simPos.scene, this.simPos.camera);
      this.fboPos.swap();
      sp.t_oPos.value = this.fboPos.read.texture;
      this.set("t_simulation", this.fboPos.read.texture);
      r.setRenderTarget(this.fboSpring.write);
      r.render(this.simSpring.scene, this.simSpring.camera);
      this.fboSpring.swap();
      ss.t_oVelocity.value = this.fboSpring.read.texture;
      sp.u_rendered.value = 1;
      ss.u_rendered.value = 1;
      this.hasRendered = true;
    }
    r.setRenderTarget(null);
  }
}

export type SceneHandle = { dispose(): void };

export type SceneOptions = {
  /** Scroll progress, already measured by the page. */
  getProgress: () => number;
  /** Skip the build-up animation (prefers-reduced-motion). */
  instant?: boolean;
};

export async function createScene(canvas: HTMLCanvasElement, { getProgress, instant = false }: SceneOptions): Promise<SceneHandle> {
  const mobile = innerWidth <= 820;
  const response = await fetch(SHAPES_URL);
  if (!response.ok) throw new Error(`shapes.bin: ${response.status}`);
  const data = unpackShapes(await response.arrayBuffer());

  const renderer = new THREE.WebGLRenderer({
    alpha: false,
    antialias: false,
    canvas,
    powerPreference: "high-performance",
    stencil: false,
  });
  renderer.setPixelRatio(mobile ? Math.min(devicePixelRatio, 2) : 1);
  renderer.setSize(innerWidth, innerHeight, false);
  const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 30);
  camera.position.set(0, 0, 10);
  const scene = new THREE.Scene();
  const geometry = pyramidGeometry();

  // Dotted grain just in front of the camera
  const retina = devicePixelRatio >= 2;
  const grainUniforms = {
    u_show: { value: 1 },
    u_alpha: { value: retina ? 0.138 : 0.149 },
    u_bright: { value: retina ? 0.185 : 0.252 },
    u_scale: { value: retina ? 1.072 : 1.366 },
    u_time: { value: 0 },
  };
  const grainMaterial = new THREE.RawShaderMaterial({
    uniforms: grainUniforms,
    transparent: true,
    vertexShader: G.SIM_VERTEX,
    fragmentShader: G.GRAIN_FRAGMENT,
  });
  const grain = fullscreen(grainMaterial).mesh;
  grain.customDepthMaterial = new THREE.MeshBasicMaterial({ opacity: 0, transparent: true });
  grain.position.set(0, 0, 9.6);
  scene.add(grain);

  const cones = new Cones(renderer, data, geometry, camera, mobile);
  scene.add(cones);
  const front = new FrontCones(geometry, camera, mobile);
  front.position.set(0, 0, 0.1);
  scene.add(front);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.4, 1, 0.159);
  composer.addPass(bloom);
  const bokeh = new BokehPass(scene, camera, {
    focalDepth: 0.125,
    focalLength: 27,
    fstop: 2509,
    maxblur: 10,
    width: innerWidth,
    height: innerHeight,
  });
  if (!mobile) composer.addPass(bokeh);
  const vignette = new ShaderPass(VignetteShader);
  vignette.uniforms.offset.value = 0.3;
  vignette.uniforms.darkness.value = 4;
  composer.addPass(vignette);

  const m: Vec2 = { x: 0, y: 0 };
  const point = (ev: PointerEvent) => {
    m.x = 2 * (ev.clientX / innerWidth - 0.5);
    m.y = -2 * (ev.clientY / innerHeight - 0.5);
  };
  const onMove = (ev: PointerEvent) => {
    point(ev);
    cones.onMousemove(m);
    front.onMousemove(m);
  };
  const onDown = (ev: PointerEvent) => {
    point(ev);
    cones.onPointerdown(m);
  };
  const onLeave = () => cones.onMouseleave();
  const onResize = () => {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    cones.resize(camera);
    front.resize(camera);
    composer.setSize(innerWidth, innerHeight);
    bokeh.setSize(innerWidth, innerHeight);
  };
  addEventListener("pointermove", onMove, { passive: true });
  addEventListener("pointerdown", onDown, { passive: true });
  document.addEventListener("pointerleave", onLeave);
  addEventListener("resize", onResize);

  let raf = 0;
  const frame = (ms: number) => {
    raf = requestAnimationFrame(frame);
    const t = ms / 1000;
    camera.rotation.y += 0.1 * (-0.075 * m.x - camera.rotation.y);
    camera.rotation.x += 0.1 * (0.05 * m.y - camera.rotation.x);
    grainUniforms.u_time.value = t;
    const e = getProgress();
    cones.update(t, e, instant);
    front.update(t, e);
    composer.render();
  };
  raf = requestAnimationFrame(frame);

  return {
    dispose() {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onLeave);
      removeEventListener("resize", onResize);
      cones.disposables.forEach((d) => d.dispose());
      [data.position, data.scale, data.color, geometry, grainMaterial].forEach((d) => d.dispose());
      renderer.dispose();
    },
  };
}
