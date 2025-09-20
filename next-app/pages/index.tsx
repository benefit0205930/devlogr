import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Header />

      <main className="flex-1">
        <Hero />

        <section id="projects" className="bg-black py-24">
          <div className="container mx-auto px-6">
            <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">注目のAIプロジェクト</h2>
              <p className="mt-4 text-lg text-white/70">
                研究開発、プロダクトローンチ、体験設計。スタートアップからエンタープライズまで、私たちはAIの社会実装を共に推進します。
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {[
                {
                  title: 'Aurora Mesh',
                  description: '生成AIと空間コンピューティングを融合した臨場感あるリテール体験。',
                },
                {
                  title: 'NeuroFlux',
                  description: 'リアルタイム脳波解析から感情トーンを抽出し、UIを自律変化。',
                },
                {
                  title: 'Sonic Pulse',
                  description:
                    '音声LLMとマルチモーダル翻訳で国境を越えたナレッジシェアリングを実現。',
                },
              ].map((project) => (
                <div
                  key={project.title}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur transition"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-blue-400/20 opacity-0 transition group-hover:opacity-100" />
                  <div className="relative flex h-full flex-col">
                    <h3 className="text-2xl font-semibold">{project.title}</h3>
                    <p className="mt-4 text-base text-white/70">{project.description}</p>
                    <button className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-blue-200 transition hover:translate-x-1">
                      詳細を見る
                      <span aria-hidden>→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="bg-gradient-to-b from-blue-900 via-black to-black py-24">
          <div className="container mx-auto grid gap-12 px-6 lg:grid-cols-[2fr,1fr]">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">Co-create the future</h2>
              <p className="mt-4 text-lg text-white/70">
                アイデア検証、PoC、プロダクトグロース。どんなフェーズでも、私たちのAIエンジニアとデザインチームが伴走します。
              </p>
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <p className="text-sm uppercase tracking-[0.25em] text-white/60">Consulting</p>
                  <p className="mt-3 font-semibold">戦略設計とデータ基盤の構築でAI導入を加速。</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <p className="text-sm uppercase tracking-[0.25em] text-white/60">Product</p>
                  <p className="mt-3 font-semibold">
                    UI/UX、MLOps、継続的ABテストまでフルサポート。
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <h3 className="text-xl font-semibold">最短2営業日でキックオフ</h3>
              <p className="mt-4 text-sm text-white/70">
                案件共有プラットフォームDevlogrに登録すると、専任コンシェルジュがプロジェクト設計をサポートします。
              </p>
              <a
                href="/auth/register"
                className="mt-8 inline-flex w-full justify-center rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
              >
                無料で相談する
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
