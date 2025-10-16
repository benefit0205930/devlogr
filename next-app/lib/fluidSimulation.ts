type GL = WebGL2RenderingContext

interface Pointer {
  id: number
  x: number
  y: number
  dx: number
  dy: number
  down: boolean
  color: [number, number, number]
}

interface FluidConfig {
  simResolution: number
  dyeResolution: number
  densityDissipation: number
  velocityDissipation: number
  pressureIterations: number
  curl: number
  splatRadius: number
  splatForce: number
  forceScale: number
  colorUpdateSpeed: number
}

const defaultConfig: FluidConfig = {
  simResolution: 128,
  dyeResolution: 512,
  densityDissipation: 0.98,
  velocityDissipation: 0.99,
  pressureIterations: 30,
  curl: 30,
  splatRadius: 0.25,
  splatForce: 6000,
  forceScale: 1.2,
  colorUpdateSpeed: 5,
}

interface GLProgram {
  program: WebGLProgram
  uniformLocations: Record<string, WebGLUniformLocation>
}

interface FBO {
  width: number
  height: number
  framebuffer: WebGLFramebuffer
  texture: WebGLTexture
}

interface DoubleFBO {
  read: FBO
  write: FBO
  swap: () => void
}

const baseVertexShader = `#version 300 es
layout (location = 0) in vec2 aPosition;
out vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`

const clearShader = `#version 300 es
precision highp float;
out vec4 fragColor;
uniform sampler2D uTexture;
uniform float value;
in vec2 vUv;
void main() {
  vec3 tex = texture(uTexture, vUv).rgb;
  fragColor = vec4(tex * value, 1.0);
}`

const copyShader = `#version 300 es
precision highp float;
out vec4 fragColor;
uniform sampler2D uTexture;
in vec2 vUv;
void main() {
  fragColor = texture(uTexture, vUv);
}`

const splatShader = `#version 300 es
precision highp float;
out vec4 fragColor;
uniform sampler2D uTarget;
uniform vec2 point;
uniform vec3 color;
uniform float radius;
in vec2 vUv;
void main() {
  float dist = distance(vUv, point);
  float influence = exp(-dist * dist / radius);
  vec3 base = texture(uTarget, vUv).xyz;
  fragColor = vec4(base + color * influence, 1.0);
}`

const advectionShader = `#version 300 es
precision highp float;
out vec4 fragColor;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform float dt;
uniform float dissipation;
uniform vec2 texelSize;
in vec2 vUv;
void main() {
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
  vec4 result = texture(uSource, coord);
  fragColor = result * dissipation;
}`

const divergenceShader = `#version 300 es
precision highp float;
out vec4 fragColor;
uniform sampler2D uVelocity;
uniform vec2 texelSize;
in vec2 vUv;
void main() {
  float l = texture(uVelocity, vUv - vec2(texelSize.x, 0.0)).x;
  float r = texture(uVelocity, vUv + vec2(texelSize.x, 0.0)).x;
  float b = texture(uVelocity, vUv - vec2(0.0, texelSize.y)).y;
  float t = texture(uVelocity, vUv + vec2(0.0, texelSize.y)).y;
  float div = 0.5 * (r - l + t - b);
  fragColor = vec4(div, 0.0, 0.0, 1.0);
}`

const curlShader = `#version 300 es
precision highp float;
out vec4 fragColor;
uniform sampler2D uVelocity;
uniform vec2 texelSize;
in vec2 vUv;
void main() {
  float l = texture(uVelocity, vUv - vec2(texelSize.x, 0.0)).y;
  float r = texture(uVelocity, vUv + vec2(texelSize.x, 0.0)).y;
  float b = texture(uVelocity, vUv - vec2(0.0, texelSize.y)).x;
  float t = texture(uVelocity, vUv + vec2(0.0, texelSize.y)).x;
  float c = r - l - (t - b);
  fragColor = vec4(c, 0.0, 0.0, 1.0);
}`

const vorticityShader = `#version 300 es
precision highp float;
out vec4 fragColor;
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;
uniform vec2 texelSize;
in vec2 vUv;
void main() {
  float left = texture(uCurl, vUv - vec2(texelSize.x, 0.0)).x;
  float right = texture(uCurl, vUv + vec2(texelSize.x, 0.0)).x;
  float bottom = texture(uCurl, vUv - vec2(0.0, texelSize.y)).x;
  float top = texture(uCurl, vUv + vec2(0.0, texelSize.y)).x;
  vec2 force = vec2(abs(top) - abs(bottom), abs(right) - abs(left));
  float len = length(force) + 1e-5;
  force = curl * force / len;
  vec2 vel = texture(uVelocity, vUv).xy;
  vel += force * texture(uCurl, vUv).x * dt;
  fragColor = vec4(vel, 0.0, 1.0);
}`

const pressureShader = `#version 300 es
precision highp float;
out vec4 fragColor;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
uniform vec2 texelSize;
in vec2 vUv;
void main() {
  float l = texture(uPressure, vUv - vec2(texelSize.x, 0.0)).x;
  float r = texture(uPressure, vUv + vec2(texelSize.x, 0.0)).x;
  float b = texture(uPressure, vUv - vec2(0.0, texelSize.y)).x;
  float t = texture(uPressure, vUv + vec2(0.0, texelSize.y)).x;
  float c = texture(uDivergence, vUv).x;
  float pressure = (l + r + b + t - c) * 0.25;
  fragColor = vec4(pressure, 0.0, 0.0, 1.0);
}`

const gradientSubtractShader = `#version 300 es
precision highp float;
out vec4 fragColor;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
uniform vec2 texelSize;
in vec2 vUv;
void main() {
  float l = texture(uPressure, vUv - vec2(texelSize.x, 0.0)).x;
  float r = texture(uPressure, vUv + vec2(texelSize.x, 0.0)).x;
  float b = texture(uPressure, vUv - vec2(0.0, texelSize.y)).x;
  float t = texture(uPressure, vUv + vec2(0.0, texelSize.y)).x;
  vec2 gradient = vec2(r - l, t - b) * 0.5;
  vec2 velocity = texture(uVelocity, vUv).xy - gradient;
  fragColor = vec4(velocity, 0.0, 1.0);
}`

const displayShader = `#version 300 es
precision highp float;
out vec4 fragColor;
uniform sampler2D uTexture;
uniform float exposure;
in vec2 vUv;
void main() {
  vec3 color = texture(uTexture, vUv).rgb;
  color = vec3(1.0) - exp(-color * exposure);
  fragColor = vec4(color, 1.0);
}`

type RAF = {
  cancel: () => void
}

function createPointerTemplate(id = -1): Pointer {
  return {
    id,
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    down: false,
    color: [30 / 255, 136 / 255, 229 / 255],
  }
}

interface SimulationController {
  destroy: () => void
}

export function initializeFluidSimulation(
  canvas: HTMLCanvasElement,
  options: Partial<FluidConfig> = {}
): SimulationController {
  const config = { ...defaultConfig, ...options }

  // WebGL2のサポートチェック
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    powerPreference: 'high-performance',
  }) as GL | null

  if (!gl) {
    // WebGL1へのフォールバックを試みる
    const gl1 = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (gl1) {
      throw new Error(
        'WebGL2 がサポートされていません。このブラウザはWebGL1のみ対応しています。最新のブラウザへのアップデートをお勧めします。'
      )
    }
    throw new Error('WebGL がサポートされていません。別のブラウザをお試しください。')
  }

  const ext = gl.getExtension('EXT_color_buffer_float')
  if (!ext) {
    throw new Error('半精度テクスチャの拡張が有効ではありません')
  }

  const pointers: Pointer[] = [createPointerTemplate()]

  let velocity: DoubleFBO | undefined
  let density: DoubleFBO | undefined
  let pressure: DoubleFBO | undefined
  let divergence: FBO | undefined
  let curl: FBO | undefined

  const programs = {
    copy: createProgram(gl, baseVertexShader, copyShader),
    clear: createProgram(gl, baseVertexShader, clearShader),
    advection: createProgram(gl, baseVertexShader, advectionShader),
    splat: createProgram(gl, baseVertexShader, splatShader),
    divergence: createProgram(gl, baseVertexShader, divergenceShader),
    curl: createProgram(gl, baseVertexShader, curlShader),
    vorticity: createProgram(gl, baseVertexShader, vorticityShader),
    pressure: createProgram(gl, baseVertexShader, pressureShader),
    gradientSubtract: createProgram(gl, baseVertexShader, gradientSubtractShader),
    display: createProgram(gl, baseVertexShader, displayShader),
  }

  const quadVao = createFullscreenTriangle(gl)

  let activeProgram: WebGLProgram | null = null
  const bindProgram = (program: GLProgram) => {
    if (activeProgram === program.program) return
    gl.useProgram(program.program)
    activeProgram = program.program
  }

  const blit = (target: WebGLFramebuffer | null, program: GLProgram) => {
    gl.bindVertexArray(quadVao)
    bindProgram(program)
    gl.bindFramebuffer(gl.FRAMEBUFFER, target)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    gl.bindVertexArray(null)
  }

  const setUniform1f = (program: GLProgram, name: string, value: number) => {
    const location = program.uniformLocations[name]
    if (!location) return
    bindProgram(program)
    gl.uniform1f(location, value)
  }

  const setUniform2f = (program: GLProgram, name: string, x: number, y: number) => {
    const location = program.uniformLocations[name]
    if (!location) return
    bindProgram(program)
    gl.uniform2f(location, x, y)
  }

  const setUniform3f = (program: GLProgram, name: string, x: number, y: number, z: number) => {
    const location = program.uniformLocations[name]
    if (!location) return
    bindProgram(program)
    gl.uniform3f(location, x, y, z)
  }

  const setUniformTexture = (
    program: GLProgram,
    name: string,
    texture: WebGLTexture,
    unit: number
  ) => {
    const location = program.uniformLocations[name]
    if (!location) return
    bindProgram(program)
    gl.uniform1i(location, unit)
    gl.activeTexture(gl.TEXTURE0 + unit)
    gl.bindTexture(gl.TEXTURE_2D, texture)
  }

  const resize = () => {
    const width = canvas.clientWidth * window.devicePixelRatio
    const height = canvas.clientHeight * window.devicePixelRatio
    if (canvas.width === width && canvas.height === height) return
    canvas.width = width
    canvas.height = height
    gl.viewport(0, 0, width, height)

    const simW = getResolution(config.simResolution, width)
    const simH = getResolution(config.simResolution, height)
    const dyeW = getResolution(config.dyeResolution, width)
    const dyeH = getResolution(config.dyeResolution, height)

    velocity = createDoubleFBO(gl, simW, simH, gl.RG16F, gl.RG, gl.HALF_FLOAT)
    density = createDoubleFBO(gl, dyeW, dyeH, gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT)
    pressure = createDoubleFBO(gl, simW, simH, gl.R16F, gl.RED, gl.HALF_FLOAT)
    divergence = createFBO(gl, simW, simH, gl.R16F, gl.RED, gl.HALF_FLOAT)
    curl = createFBO(gl, simW, simH, gl.R16F, gl.RED, gl.HALF_FLOAT)

    gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.read.framebuffer)
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.framebuffer)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.bindFramebuffer(gl.FRAMEBUFFER, density.read.framebuffer)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.bindFramebuffer(gl.FRAMEBUFFER, density.write.framebuffer)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.bindFramebuffer(gl.FRAMEBUFFER, pressure.read.framebuffer)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.bindFramebuffer(gl.FRAMEBUFFER, pressure.write.framebuffer)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }

  resize()

  const applySplat = (
    x: number,
    y: number,
    dx: number,
    dy: number,
    color: [number, number, number]
  ) => {
    if (!velocity || !density) return

    gl.viewport(0, 0, velocity.read.width, velocity.read.height)
    setUniformTexture(programs.splat, 'uTarget', velocity.read.texture, 0)
    setUniform2f(programs.splat, 'point', x, y)
    setUniform3f(
      programs.splat,
      'color',
      dx * config.splatForce * config.forceScale,
      dy * config.splatForce * config.forceScale,
      0
    )
    setUniform1f(programs.splat, 'radius', config.splatRadius)
    blit(velocity.write.framebuffer, programs.splat)
    velocity.swap()

    gl.viewport(0, 0, density.read.width, density.read.height)
    setUniformTexture(programs.splat, 'uTarget', density.read.texture, 0)
    setUniform2f(programs.splat, 'point', x, y)
    setUniform3f(programs.splat, 'color', color[0], color[1], color[2])
    setUniform1f(programs.splat, 'radius', config.splatRadius)
    blit(density.write.framebuffer, programs.splat)
    density.swap()
  }

  let lastTime = performance.now()
  let randomAccumulator = 0

  const pointerEvents = createPointerHandlers(canvas, pointers, config.colorUpdateSpeed)

  let raf: RAF | null = null

  const frame = () => {
    const now = performance.now()
    const delta = Math.min((now - lastTime) / 1000, 0.016)
    lastTime = now

    if (!velocity || !density || !pressure || !divergence || !curl) {
      raf = requestAnimationFramePolyfill(frame)
      return
    }

    gl.viewport(0, 0, velocity.read.width, velocity.read.height)

    setUniformTexture(programs.curl, 'uVelocity', velocity.read.texture, 0)
    setUniform2f(programs.curl, 'texelSize', 1 / velocity.read.width, 1 / velocity.read.height)
    blit(curl.framebuffer, programs.curl)

    setUniformTexture(programs.vorticity, 'uVelocity', velocity.read.texture, 0)
    setUniformTexture(programs.vorticity, 'uCurl', curl.texture, 1)
    setUniform2f(programs.vorticity, 'texelSize', 1 / velocity.read.width, 1 / velocity.read.height)
    setUniform1f(programs.vorticity, 'curl', config.curl)
    setUniform1f(programs.vorticity, 'dt', delta)
    blit(velocity.write.framebuffer, programs.vorticity)
    velocity.swap()

    setUniformTexture(programs.divergence, 'uVelocity', velocity.read.texture, 0)
    setUniform2f(
      programs.divergence,
      'texelSize',
      1 / velocity.read.width,
      1 / velocity.read.height
    )
    blit(divergence.framebuffer, programs.divergence)

    gl.viewport(0, 0, pressure.read.width, pressure.read.height)

    gl.bindFramebuffer(gl.FRAMEBUFFER, pressure.write.framebuffer)
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    for (let i = 0; i < config.pressureIterations; i += 1) {
      setUniformTexture(programs.pressure, 'uPressure', pressure.read.texture, 0)
      setUniformTexture(programs.pressure, 'uDivergence', divergence.texture, 1)
      setUniform2f(
        programs.pressure,
        'texelSize',
        1 / pressure.read.width,
        1 / pressure.read.height
      )
      blit(pressure.write.framebuffer, programs.pressure)
      pressure.swap()
    }

    gl.viewport(0, 0, velocity.read.width, velocity.read.height)
    setUniformTexture(programs.gradientSubtract, 'uPressure', pressure.read.texture, 0)
    setUniformTexture(programs.gradientSubtract, 'uVelocity', velocity.read.texture, 1)
    setUniform2f(
      programs.gradientSubtract,
      'texelSize',
      1 / velocity.read.width,
      1 / velocity.read.height
    )
    blit(velocity.write.framebuffer, programs.gradientSubtract)
    velocity.swap()

    setUniformTexture(programs.advection, 'uVelocity', velocity.read.texture, 0)
    setUniformTexture(programs.advection, 'uSource', velocity.read.texture, 1)
    setUniform1f(programs.advection, 'dt', delta)
    setUniform1f(programs.advection, 'dissipation', config.velocityDissipation)
    setUniform2f(programs.advection, 'texelSize', 1 / velocity.read.width, 1 / velocity.read.height)
    blit(velocity.write.framebuffer, programs.advection)
    velocity.swap()

    gl.viewport(0, 0, density.read.width, density.read.height)
    setUniformTexture(programs.advection, 'uVelocity', velocity.read.texture, 0)
    setUniformTexture(programs.advection, 'uSource', density.read.texture, 1)
    setUniform1f(programs.advection, 'dt', delta)
    setUniform1f(programs.advection, 'dissipation', config.densityDissipation)
    setUniform2f(programs.advection, 'texelSize', 1 / density.read.width, 1 / density.read.height)
    blit(density.write.framebuffer, programs.advection)
    density.swap()

    pointers.forEach((pointer) => {
      if (!pointer.down && pointer.dx === 0 && pointer.dy === 0) return
      applySplat(pointer.x, pointer.y, pointer.dx, pointer.dy, pointer.color)
      pointer.dx = 0
      pointer.dy = 0
    })

    randomAccumulator += delta
    if (randomAccumulator >= 1.4) {
      randomAccumulator = 0
      const x = Math.random()
      const y = Math.random()
      const color = hslToRgb(Math.random(), 0.85, 0.55)
      const dx = (Math.random() - 0.5) * 0.2
      const dy = (Math.random() - 0.5) * 0.2
      applySplat(x, y, dx, dy, color)
    }

    gl.viewport(0, 0, canvas.width, canvas.height)
    setUniformTexture(programs.display, 'uTexture', density.read.texture, 0)
    setUniform1f(programs.display, 'exposure', 1.8)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    blit(null, programs.display)

    raf = requestAnimationFramePolyfill(frame)
  }

  raf = requestAnimationFramePolyfill(frame)

  const observer = new ResizeObserver(resize)
  observer.observe(canvas)

  const cleanup = () => {
    if (raf) raf.cancel()
    observer.disconnect()
    pointerEvents.dispose()
    gl.deleteVertexArray(quadVao)
    if (velocity) {
      destroyFBO(gl, velocity.read)
      destroyFBO(gl, velocity.write)
    }
    if (density) {
      destroyFBO(gl, density.read)
      destroyFBO(gl, density.write)
    }
    if (pressure) {
      destroyFBO(gl, pressure.read)
      destroyFBO(gl, pressure.write)
    }
    if (divergence) {
      destroyFBO(gl, divergence)
    }
    if (curl) {
      destroyFBO(gl, curl)
    }
  }

  return {
    destroy: cleanup,
  }
}

function createProgram(gl: GL, vertexSource: string, fragmentSource: string): GLProgram {
  const program = gl.createProgram()
  if (!program) {
    throw new Error('プログラムの生成に失敗しました')
  }

  const vShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource)
  const fShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource)

  gl.attachShader(program, vShader)
  gl.attachShader(program, fShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program)
    gl.deleteProgram(program)
    gl.deleteShader(vShader)
    gl.deleteShader(fShader)
    throw new Error(`シェーダーのリンクに失敗しました: ${info}`)
  }

  gl.deleteShader(vShader)
  gl.deleteShader(fShader)

  const uniformLocations: Record<string, WebGLUniformLocation> = {}

  const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number
  for (let i = 0; i < uniformCount; i += 1) {
    const info = gl.getActiveUniform(program, i)
    if (!info) continue
    const location = gl.getUniformLocation(program, info.name)
    if (location) {
      uniformLocations[info.name] = location
    }
  }

  return { program, uniformLocations }
}

function compileShader(gl: GL, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)
  if (!shader) {
    throw new Error('シェーダーの生成に失敗しました')
  }
  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(`シェーダーのコンパイルに失敗しました: ${info}`)
  }

  return shader
}

function createFullscreenTriangle(gl: GL) {
  const vao = gl.createVertexArray()
  if (!vao) {
    throw new Error('頂点配列の作成に失敗しました')
  }
  gl.bindVertexArray(vao)

  const buffer = gl.createBuffer()
  if (!buffer) {
    throw new Error('バッファの作成に失敗しました')
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  const vertices = new Float32Array([-1, -1, 3, -1, -1, 3])
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

  gl.bindVertexArray(null)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)
  return vao
}

function createFBO(
  gl: GL,
  width: number,
  height: number,
  internalFormat: number,
  format: number,
  type: number
): FBO {
  const texture = gl.createTexture()
  if (!texture) {
    throw new Error('テクスチャの作成に失敗しました')
  }
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, type, null)

  const framebuffer = gl.createFramebuffer()
  if (!framebuffer) {
    throw new Error('フレームバッファの作成に失敗しました')
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)

  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
    throw new Error('フレームバッファが完全ではありません')
  }

  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.bindTexture(gl.TEXTURE_2D, null)

  return { width, height, framebuffer, texture }
}

function createDoubleFBO(
  gl: GL,
  width: number,
  height: number,
  internalFormat: number,
  format: number,
  type: number
): DoubleFBO {
  const fbo1 = createFBO(gl, width, height, internalFormat, format, type)
  const fbo2 = createFBO(gl, width, height, internalFormat, format, type)
  return {
    read: fbo1,
    write: fbo2,
    swap() {
      const temp = this.read
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(this as any).read = this.write
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(this as any).write = temp
    },
  }
}

function destroyFBO(gl: GL, fbo: FBO) {
  gl.deleteFramebuffer(fbo.framebuffer)
  gl.deleteTexture(fbo.texture)
}

function getResolution(base: number, target: number) {
  const ratio = target / base
  if (ratio < 1) return Math.max(1, Math.floor(base * ratio))
  return Math.floor(target / ratio)
}

function createPointerHandlers(
  canvas: HTMLCanvasElement,
  pointers: Pointer[],
  colorUpdateSpeed: number
) {
  const pointerById = new Map<number, Pointer>()

  const updatePointerColor = (pointer: Pointer) => {
    const t = performance.now() / 1000
    const hue = (pointer.id * 30 + t * colorUpdateSpeed) % 360
    const color = hslToRgb(hue / 360, 0.8, 0.5)
    pointer.color = color
  }

  const pointerDown = (id: number, x: number, y: number) => {
    let pointer = pointerById.get(id)
    if (!pointer) {
      pointer = createPointerTemplate(id)
      pointerById.set(id, pointer)
      pointers.push(pointer)
    }
    pointer.down = true
    pointer.x = x
    pointer.y = y
    pointer.dx = 0
    pointer.dy = 0
    updatePointerColor(pointer)
  }

  const pointerMove = (id: number, x: number, y: number) => {
    const pointer = pointerById.get(id)
    if (!pointer) return
    pointer.dx = x - pointer.x
    pointer.dy = y - pointer.y
    pointer.x = x
    pointer.y = y
  }

  const pointerUp = (id: number) => {
    const pointer = pointerById.get(id)
    if (!pointer) return
    pointer.down = false
    pointer.dx = 0
    pointer.dy = 0
  }

  const getRelativePosition = (clientX: number, clientY: number) => {
    const rect = canvas.getBoundingClientRect()
    const x = (clientX - rect.left) / rect.width
    const y = 1 - (clientY - rect.top) / rect.height
    return { x, y }
  }

  const onPointerDown = (event: PointerEvent) => {
    const { x, y } = getRelativePosition(event.clientX, event.clientY)
    pointerDown(event.pointerId, x, y)
  }

  const onPointerMove = (event: PointerEvent) => {
    if (!pointerById.has(event.pointerId)) return
    const { x, y } = getRelativePosition(event.clientX, event.clientY)
    pointerMove(event.pointerId, x, y)
  }

  const onPointerUp = (event: PointerEvent) => {
    pointerUp(event.pointerId)
  }

  const onMouseLeave = () => {
    pointerById.forEach((pointer) => {
      pointer.down = false
    })
  }

  canvas.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  canvas.addEventListener('pointerleave', onMouseLeave)

  return {
    dispose() {
      canvas.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointerleave', onMouseLeave)
      pointerById.clear()
      pointers.length = 0
    },
  }
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) {
    return [l, l, l]
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t
    if (tt < 0) tt += 1
    if (tt > 1) tt -= 1
    if (tt < 1 / 6) return p + (q - p) * 6 * tt
    if (tt < 1 / 2) return q
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6
    return p
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const r = hue2rgb(p, q, h + 1 / 3)
  const g = hue2rgb(p, q, h)
  const b = hue2rgb(p, q, h - 1 / 3)
  return [r, g, b]
}

function requestAnimationFramePolyfill(callback: FrameRequestCallback): RAF {
  const id = window.requestAnimationFrame(callback)
  return {
    cancel() {
      window.cancelAnimationFrame(id)
    },
  }
}
