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
    ],
];
