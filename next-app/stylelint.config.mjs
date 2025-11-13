const config = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-tailwindcss',
  ],
  ignoreFiles: [
    '**/node_modules/**',
    '**/.next/**',
    '**/build/**',
  ],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'layer',
          'variants',
          'responsive',
          'screen',
          'theme',
        ],
      },
    ],
  },
};

export default config;
