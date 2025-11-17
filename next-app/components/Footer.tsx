import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Devlogr</h3>
            <p className="text-sm text-gray-600">開発者のための案件共有プラットフォーム</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">サービス</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/projects" className="text-sm text-gray-600 hover:text-gray-900">
                  案件一覧
                </Link>
              </li>
              <li>
                <Link href="/projects/create" className="text-sm text-gray-600 hover:text-gray-900">
                  案件を投稿
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">リソース</h4>
            <ul className="space-y-2">
              <li>
                {/* TODO: ドキュメントページを実装したらリンク先を差し替える */}
                <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                  ドキュメント
                </Link>
              </li>
              <li>
                {/* TODO: ブログページを実装したらリンク先を差し替える */}
                <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                  ブログ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">法的情報</h4>
            <ul className="space-y-2">
              <li>
                {/* TODO: プライバシーポリシーを実装したらリンク先を差し替える */}
                <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                {/* TODO: 利用規約を実装したらリンク先を差し替える */}
                <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                  利用規約
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Devlogr. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
