import { useEffect, useRef } from 'react'

import { initializeFluidSimulation } from '@/lib/fluidSimulation'

const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    canvas.style.touchAction = 'none'

    let cleanup: (() => void) | undefined
    try {
      const controller = initializeFluidSimulation(canvas, {
        dyeResolution: 768,
        simResolution: 256,
        splatRadius: 0.15,
        curl: 35,
      })
      cleanup = () => controller.destroy()
    } catch (error) {
      console.error('Fluid simulation initialization failed', error)
    }

    return () => {
      cleanup?.()
    }
  }, [])

  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden={true} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-24 text-center text-white">
        <span className="rounded-full bg-white/10 px-6 py-2 text-sm font-semibold uppercase tracking-[0.4em] text-white/90 backdrop-blur">
          Next-Gen AI Studio
        </span>
        <h1 className="text-balance text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
          Webと現実を溶かす、
          <span className="text-blue-300">流体的なAI体験</span>
        </h1>
        <p className="text-balance text-lg text-white/80 sm:text-xl md:max-w-3xl">
          Devlogrは創造性と最先端AIを融合させた革新的な開発パートナー。WebGLによる流体シミュレーションが描くダイナミックなステージで、次のアイデアを共に形にしよう。
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#projects"
            className="rounded-full bg-white px-8 py-3 text-base font-semibold text-gray-900 shadow-xl shadow-white/10 transition hover:-translate-y-1 hover:bg-blue-100"
          >
            プロジェクトを見る
          </a>
          <a
            href="#contact"
            className="rounded-full border border-white/60 px-8 py-3 text-base font-semibold text-white transition hover:-translate-y-1 hover:border-white hover:bg-white/10"
          >
            パートナーシップ相談
          </a>
        </div>

        <div className="mt-12 grid w-full gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur">
            <p className="text-sm uppercase tracking-[0.2em] text-white/60">AI R&amp;D</p>
            <p className="mt-3 text-lg font-semibold">
              生成AIを核とした共同研究で、未来の製品体験を設計。
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur">
            <p className="text-sm uppercase tracking-[0.2em] text-white/60">Fluid Design</p>
            <p className="mt-3 text-lg font-semibold">
              流体的なUIとデータビジュアライゼーションでブランド価値を増幅。
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur">
            <p className="text-sm uppercase tracking-[0.2em] text-white/60">Trusted Platform</p>
            <p className="mt-3 text-lg font-semibold">
              堅牢なセキュリティとDevOpsでスケーラブルなAIインフラを構築。
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
