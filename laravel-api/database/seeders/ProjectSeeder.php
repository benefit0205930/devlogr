<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first() ?? User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // カテゴリと技術スタックのマッピング
        $categories = [
            'WEB_DEVELOPMENT' => ['REACT', 'VUE', 'NEXTJS', 'TYPESCRIPT', 'NODEJS', 'LARAVEL', 'PHP'],
            'MOBILE_APP' => ['REACT_NATIVE', 'FLUTTER', 'SWIFT', 'KOTLIN', 'ANDROID', 'IOS'],
            'AI_ML' => ['PYTHON', 'TENSORFLOW', 'PYTORCH', 'PANDAS', 'NUMPY', 'JUPYTER'],
            'DESIGN' => ['HTML_CSS', 'TAILWIND'],
            'VIDEO' => [],
            'WRITING' => [],
            'MARKETING' => [],
            'DATA_ANALYSIS' => ['PYTHON', 'PANDAS', 'NUMPY', 'ELASTICSEARCH'],
            'GAME' => [],
            'BLOCKCHAIN' => ['NODEJS', 'PYTHON', 'GO'],
            'CLOUD' => ['AWS', 'GCP', 'AZURE', 'DOCKER', 'KUBERNETES', 'TERRAFORM'],
            'SECURITY' => ['PYTHON', 'GO', 'RUST'],
        ];

        $projects = [
            // Web開発系
            [
                'title' => 'ECサイトのフロントエンド開発',
                'description' => 'Next.js + TypeScriptを使用したECサイトのフロントエンド開発をお願いします。デザインはFigmaで提供します。',
                'category' => 'WEB_DEVELOPMENT',
                'technologies' => ['NEXTJS', 'TYPESCRIPT', 'TAILWIND'],
                'budget_min' => 300000,
                'budget_max' => 500000,
                'deadline' => now()->addDays(60),
                'estimated_duration' => '2ヶ月',
                'application_count' => rand(5, 20),
                'status' => 'open',
            ],
            [
                'title' => 'SaaS管理画面のリニューアル',
                'description' => 'React + TypeScriptで既存の管理画面をリニューアル。REST API連携あり。',
                'category' => 'WEB_DEVELOPMENT',
                'technologies' => ['REACT', 'TYPESCRIPT', 'NODEJS'],
                'budget_min' => 500000,
                'budget_max' => 800000,
                'deadline' => now()->addDays(90),
                'estimated_duration' => '3ヶ月',
                'application_count' => rand(10, 25),
                'status' => 'open',
            ],
            [
                'title' => 'Laravel APIサーバー構築',
                'description' => 'Laravel 11でREST APIサーバーを構築。MySQL、Redis使用。',
                'category' => 'WEB_DEVELOPMENT',
                'technologies' => ['LARAVEL', 'PHP', 'MYSQL', 'REDIS'],
                'budget_min' => 400000,
                'budget_max' => 600000,
                'deadline' => now()->addDays(45),
                'estimated_duration' => '1.5ヶ月',
                'application_count' => rand(3, 15),
                'status' => 'open',
            ],
            [
                'title' => 'Vue.jsでのダッシュボード開発',
                'description' => 'Vue 3 + Composition APIでデータ可視化ダッシュボードを開発。',
                'category' => 'WEB_DEVELOPMENT',
                'technologies' => ['VUE', 'TYPESCRIPT', 'NODEJS'],
                'budget_min' => 250000,
                'budget_max' => 400000,
                'deadline' => now()->addDays(30),
                'estimated_duration' => '1ヶ月',
                'application_count' => rand(5, 18),
                'status' => 'open',
            ],
            [
                'title' => 'WordPressカスタムテーマ開発',
                'description' => 'コーポレートサイト用のWordPressカスタムテーマ開発。',
                'category' => 'WEB_DEVELOPMENT',
                'technologies' => ['WORDPRESS', 'PHP', 'JAVASCRIPT'],
                'budget_min' => 150000,
                'budget_max' => 250000,
                'deadline' => now()->addDays(20),
                'estimated_duration' => '3週間',
                'application_count' => rand(8, 20),
                'status' => 'open',
            ],

            // モバイルアプリ系
            [
                'title' => 'SNSアプリのiOS/Android開発',
                'description' => 'Flutter使用。Firebase連携、プッシュ通知機能あり。',
                'category' => 'MOBILE_APP',
                'technologies' => ['FLUTTER', 'FIREBASE'],
                'budget_min' => 600000,
                'budget_max' => 1000000,
                'deadline' => now()->addDays(90),
                'estimated_duration' => '3ヶ月',
                'application_count' => rand(2, 10),
                'status' => 'open',
            ],
            [
                'title' => 'ヘルスケアアプリ開発（iOS）',
                'description' => 'SwiftUIでヘルスケア系iOSアプリ開発。HealthKit連携必須。',
                'category' => 'MOBILE_APP',
                'technologies' => ['SWIFT', 'IOS'],
                'budget_min' => 800000,
                'budget_max' => 1200000,
                'deadline' => now()->addDays(120),
                'estimated_duration' => '4ヶ月',
                'application_count' => rand(1, 5),
                'status' => 'open',
            ],
            [
                'title' => 'React Nativeでマッチングアプリ',
                'description' => 'React Nativeでのマッチングアプリ開発。チャット機能実装。',
                'category' => 'MOBILE_APP',
                'technologies' => ['REACT_NATIVE', 'TYPESCRIPT', 'FIREBASE'],
                'budget_min' => 700000,
                'budget_max' => 1000000,
                'deadline' => now()->addDays(75),
                'estimated_duration' => '2.5ヶ月',
                'application_count' => rand(3, 12),
                'status' => 'open',
            ],

            // AI・機械学習系
            [
                'title' => '画像認識AIモデル開発',
                'description' => 'TensorFlow/PyTorchで商品画像の自動分類モデル構築。',
                'category' => 'AI_ML',
                'technologies' => ['PYTHON', 'TENSORFLOW', 'PYTORCH'],
                'budget_min' => 500000,
                'budget_max' => 800000,
                'deadline' => now()->addDays(60),
                'estimated_duration' => '2ヶ月',
                'application_count' => rand(2, 8),
                'status' => 'open',
            ],
            [
                'title' => 'チャットボットの自然言語処理改善',
                'description' => 'GPT APIを使用したチャットボットの精度向上。',
                'category' => 'AI_ML',
                'technologies' => ['PYTHON', 'FASTAPI'],
                'budget_min' => 400000,
                'budget_max' => 600000,
                'deadline' => now()->addDays(45),
                'estimated_duration' => '1.5ヶ月',
                'application_count' => rand(5, 15),
                'status' => 'open',
            ],
            [
                'title' => 'レコメンドエンジン構築',
                'description' => 'scikit-learnで協調フィルタリングベースのレコメンドエンジン構築。',
                'category' => 'AI_ML',
                'technologies' => ['PYTHON', 'SCIKIT_LEARN', 'PANDAS'],
                'budget_min' => 600000,
                'budget_max' => 900000,
                'deadline' => now()->addDays(90),
                'estimated_duration' => '3ヶ月',
                'application_count' => rand(3, 10),
                'status' => 'open',
            ],

            // デザイン系
            [
                'title' => '企業ロゴ・ブランディングデザイン',
                'description' => 'スタートアップ企業のロゴおよびブランドガイドライン作成。',
                'category' => 'DESIGN',
                'technologies' => [],
                'budget_min' => 100000,
                'budget_max' => 200000,
                'deadline' => now()->addDays(21),
                'estimated_duration' => '3週間',
                'application_count' => rand(15, 35),
                'status' => 'open',
            ],
            [
                'title' => 'LPデザイン（Figma納品）',
                'description' => 'SaaS製品のランディングページデザイン。Figmaで納品。',
                'category' => 'DESIGN',
                'technologies' => [],
                'budget_min' => 80000,
                'budget_max' => 150000,
                'deadline' => now()->addDays(14),
                'estimated_duration' => '2週間',
                'application_count' => rand(20, 40),
                'status' => 'open',
            ],
            [
                'title' => 'UIデザインシステム構築',
                'description' => 'Tailwind CSSベースのデザインシステム構築。',
                'category' => 'DESIGN',
                'technologies' => ['TAILWIND', 'HTML_CSS'],
                'budget_min' => 200000,
                'budget_max' => 350000,
                'deadline' => now()->addDays(40),
                'estimated_duration' => '1ヶ月',
                'application_count' => rand(10, 25),
                'status' => 'open',
            ],

            // データ分析系
            [
                'title' => 'EC売上データ分析・可視化',
                'description' => 'Pythonで売上データの分析とダッシュボード作成。',
                'category' => 'DATA_ANALYSIS',
                'technologies' => ['PYTHON', 'PANDAS', 'JUPYTER'],
                'budget_min' => 250000,
                'budget_max' => 400000,
                'deadline' => now()->addDays(30),
                'estimated_duration' => '1ヶ月',
                'application_count' => rand(5, 15),
                'status' => 'open',
            ],
            [
                'title' => 'ログ分析基盤構築（Elasticsearch）',
                'description' => 'ElasticsearchとKibanaでログ分析基盤を構築。',
                'category' => 'DATA_ANALYSIS',
                'technologies' => ['ELASTICSEARCH', 'PYTHON'],
                'budget_min' => 400000,
                'budget_max' => 600000,
                'deadline' => now()->addDays(60),
                'estimated_duration' => '2ヶ月',
                'application_count' => rand(2, 8),
                'status' => 'open',
            ],

            // クラウド・インフラ系
            [
                'title' => 'AWS環境構築・Terraform化',
                'description' => 'ECS/RDS/S3などをTerraformでIaC化。',
                'category' => 'CLOUD',
                'technologies' => ['AWS', 'TERRAFORM', 'DOCKER'],
                'budget_min' => 500000,
                'budget_max' => 800000,
                'deadline' => now()->addDays(45),
                'estimated_duration' => '1.5ヶ月',
                'application_count' => rand(3, 10),
                'status' => 'open',
            ],
            [
                'title' => 'Kubernetes環境構築',
                'description' => 'GKEでマイクロサービス環境を構築。CI/CD構築含む。',
                'category' => 'CLOUD',
                'technologies' => ['GCP', 'KUBERNETES', 'DOCKER', 'GITHUB_ACTIONS'],
                'budget_min' => 600000,
                'budget_max' => 1000000,
                'deadline' => now()->addDays(60),
                'estimated_duration' => '2ヶ月',
                'application_count' => rand(2, 7),
                'status' => 'open',
            ],

            // 急募案件（期限短め）
            [
                'title' => '【急募】LP修正対応',
                'description' => 'WordPressのLP修正。デザイン変更とフォーム改修。',
                'category' => 'WEB_DEVELOPMENT',
                'technologies' => ['WORDPRESS', 'PHP', 'JAVASCRIPT'],
                'budget_min' => 50000,
                'budget_max' => 100000,
                'deadline' => now()->addDays(5),
                'estimated_duration' => '1週間',
                'application_count' => rand(10, 30),
                'status' => 'open',
            ],
            [
                'title' => '【急募】React バグ修正',
                'description' => 'Reactアプリの緊急バグ修正。3件のバグ対応。',
                'category' => 'WEB_DEVELOPMENT',
                'technologies' => ['REACT', 'TYPESCRIPT'],
                'budget_min' => 80000,
                'budget_max' => 120000,
                'deadline' => now()->addDays(3),
                'estimated_duration' => '3日',
                'application_count' => rand(8, 20),
                'status' => 'open',
            ],

            // 低予算案件
            [
                'title' => 'HTML/CSSコーディング（簡易LP）',
                'description' => 'デザインカンプからのHTML/CSSコーディング。レスポンシブ対応。',
                'category' => 'WEB_DEVELOPMENT',
                'technologies' => ['HTML_CSS', 'JAVASCRIPT'],
                'budget_min' => 30000,
                'budget_max' => 50000,
                'deadline' => now()->addDays(10),
                'estimated_duration' => '1週間',
                'application_count' => rand(20, 50),
                'status' => 'open',
            ],
            [
                'title' => 'バナーデザイン5種類',
                'description' => 'ECサイト用のバナーデザイン5種類制作。',
                'category' => 'DESIGN',
                'technologies' => [],
                'budget_min' => 20000,
                'budget_max' => 40000,
                'deadline' => now()->addDays(7),
                'estimated_duration' => '1週間',
                'application_count' => rand(25, 60),
                'status' => 'open',
            ],

            // 高単価案件
            [
                'title' => '【高単価】大規模SaaSフルスタック開発',
                'description' => 'Next.js + Laravel + AWSで大規模SaaS構築。要件定義から参画。',
                'category' => 'WEB_DEVELOPMENT',
                'technologies' => ['NEXTJS', 'LARAVEL', 'AWS', 'DOCKER', 'MYSQL'],
                'budget_min' => 1500000,
                'budget_max' => 2500000,
                'deadline' => now()->addDays(180),
                'estimated_duration' => '6ヶ月',
                'application_count' => rand(1, 5),
                'status' => 'open',
            ],
            [
                'title' => '【高単価】AI搭載チャットシステム開発',
                'description' => 'GPT-4を活用したエンタープライズ向けチャットシステム。',
                'category' => 'AI_ML',
                'technologies' => ['PYTHON', 'FASTAPI', 'REACT', 'AWS'],
                'budget_min' => 2000000,
                'budget_max' => 3000000,
                'deadline' => now()->addDays(150),
                'estimated_duration' => '5ヶ月',
                'application_count' => rand(1, 3),
                'status' => 'open',
            ],

            // その他カテゴリ
            [
                'title' => 'プロモーション動画編集',
                'description' => '商品紹介動画の編集。After Effects使用。',
                'category' => 'VIDEO',
                'technologies' => [],
                'budget_min' => 100000,
                'budget_max' => 200000,
                'deadline' => now()->addDays(20),
                'estimated_duration' => '2週間',
                'application_count' => rand(10, 25),
                'status' => 'open',
            ],
            [
                'title' => 'SEO記事執筆（5記事）',
                'description' => 'IT系ブログのSEO記事執筆。各3000文字以上。',
                'category' => 'WRITING',
                'technologies' => [],
                'budget_min' => 50000,
                'budget_max' => 80000,
                'deadline' => now()->addDays(14),
                'estimated_duration' => '2週間',
                'application_count' => rand(15, 40),
                'status' => 'open',
            ],
            [
                'title' => 'SNSマーケティング支援',
                'description' => 'Instagram/Twitter運用代行。月間30投稿。',
                'category' => 'MARKETING',
                'technologies' => [],
                'budget_min' => 80000,
                'budget_max' => 120000,
                'deadline' => now()->addDays(30),
                'estimated_duration' => '1ヶ月',
                'application_count' => rand(20, 50),
                'status' => 'open',
            ],
        ];

        foreach ($projects as $project) {
            Project::create(array_merge($project, ['user_id' => $user->id]));
        }

        // 追加で20件ランダム生成
        for ($i = 0; $i < 20; $i++) {
            $categoryKeys = array_keys($categories);
            $category = $categoryKeys[array_rand($categoryKeys)];
            $techs = $categories[$category];

            Project::create([
                'title' => 'プロジェクト ' . ($i + 31),
                'description' => 'これは自動生成されたプロジェクト説明です。',
                'category' => $category,
                'technologies' => count($techs) > 0
                    ? array_slice($techs, 0, rand(1, min(3, count($techs))))
                    : [],
                'budget_min' => rand(5, 100) * 10000,
                'budget_max' => rand(10, 200) * 10000,
                'deadline' => now()->addDays(rand(7, 180)),
                'estimated_duration' => rand(1, 12) . 'ヶ月',
                'application_count' => rand(0, 50),
                'status' => ['open', 'in_progress', 'completed'][rand(0, 2)],
                'user_id' => $user->id,
            ]);
        }
    }
}
