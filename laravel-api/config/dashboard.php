<?php

return [
    'cta_variants' => [
        'worker' => [
            'default' => [
                'experimentKey' => 'worker-default-2025q4',
                'primary' => [
                    'label' => '案件を探す',
                    'href' => '/projects',
                ],
                'secondary' => [
                    'label' => '案件を登録する',
                    'href' => '/projects/create',
                ],
            ],
            'holiday' => [
                'experimentKey' => 'worker-holiday-2025q4',
                'primary' => [
                    'label' => '軽めのタスクを始める',
                    'href' => '/tasks?filter=quick-win',
                ],
                'secondary' => [
                    'label' => 'おすすめ案件を見る',
                    'href' => '/projects?sort=recommended',
                ],
            ],
            'firstVisit' => [
                'experimentKey' => 'worker-first-visit-2025q4',
                'primary' => [
                    'label' => 'プロフィールを完成させる',
                    'href' => '/profile/setup',
                ],
                'secondary' => [
                    'label' => '活用ハンドブックを読む',
                    'href' => '/guides/get-started',
                ],
            ],
        ],
        'client' => [
            'default' => [
                'experimentKey' => 'client-default-2025q4',
                'primary' => [
                    'label' => '応募状況を確認する',
                    'href' => '/client/projects',
                ],
                'secondary' => [
                    'label' => '新しい案件を作成する',
                    'href' => '/projects/create',
                ],
            ],
            'holiday' => [
                'experimentKey' => 'client-holiday-2025q4',
                'primary' => [
                    'label' => '進行中の案件を確認する',
                    'href' => '/client/projects?status=in_progress',
                ],
                'secondary' => [
                    'label' => 'レビュー待ちを確認する',
                    'href' => '/client/projects?status=completed',
                ],
            ],
            'firstVisit' => [
                'experimentKey' => 'client-first-visit-2025q4',
                'primary' => [
                    'label' => '案件作成を始める',
                    'href' => '/projects/create',
                ],
                'secondary' => [
                    'label' => '掲載ガイドを読む',
                    'href' => '/guides/client-project-posting',
                ],
            ],
        ],
    ],
    'support_resources' => [
        'worker' => [
            [
                'id' => 'support-1',
                'title' => '提案が通りやすくなるプロフィール改善ガイド',
                'description' => '自己紹介と実績にフォーカスした、検索ヒット率を上げるテキストテンプレを紹介。',
                'href' => '/guides/profile-boost',
                'category' => 'guide',
            ],
            [
                'id' => 'support-2',
                'title' => 'リモート案件の進め方ウェビナー（録画視聴）',
                'description' => 'コミュニケーション術とスケジュール管理のコツをまとめたセッション。',
                'href' => '/webinars/remote-collaboration',
                'category' => 'webinar',
            ],
            [
                'id' => 'support-3',
                'title' => '支払いサイクルとトラブル対応 FAQ',
                'description' => '報酬の入金タイミングや遅延時の対処法など、よくある質問を整理。',
                'href' => '/support/faq/payment',
                'category' => 'faq',
            ],
        ],
        'client' => [
            [
                'id' => 'client-support-1',
                'title' => '応募対応がスムーズになるテンプレ返信集',
                'description' => '初回返信・辞退連絡など、よく使うメッセージテンプレートをまとめています。',
                'href' => '/support/templates/applicant-replies',
                'category' => 'guide',
            ],
            [
                'id' => 'client-support-2',
                'title' => '効果的な案件掲載チェックリスト',
                'description' => '募集要項の書き方と審査のポイントを5分で確認できます。',
                'href' => '/guides/client-project-checklist',
                'category' => 'webinar',
            ],
            [
                'id' => 'client-support-3',
                'title' => '支払い・契約に関するFAQ',
                'description' => '契約締結から支払い処理までのよくある質問にお答えします。',
                'href' => '/support/faq/client-payment',
                'category' => 'faq',
            ],
        ],
    ],
];
