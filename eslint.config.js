import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    '**/*.md',
  ],
  rules: {
    'no-console': 'off', // Allow console statements
    'no-irregular-whitespace': 'off', // 全角スペースを許可
    'vue/no-irregular-whitespace': 'off', // 全角スペースを許可
  },
})
