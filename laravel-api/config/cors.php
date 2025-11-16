<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    // TODO: 本番環境のAPI配置が決まったら、allowed_originsを環境変数ベースで見直す
    'allowed_origins' => ['http://localhost:3000'], // Next.js 開発サーバー
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
