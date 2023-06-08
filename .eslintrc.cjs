module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react-refresh', 'simple-import-sort', '@typescript-eslint'],
  rules: {
    'react-refresh/only-export-components': 'warn',
    'no-duplicate-imports': 2, // 禁止重复导入
    'simple-import-sort/imports': 'error', // import排序 npm包需在引入最顶部排序规则
    complexity: ['error', 10], // 代码圈复杂度
    'no-var': 2, // 使用let和const
    'prefer-const': 2, // 不会变的变量使用const
    quotes: ['error', 'single'], // 强制使用一致的反勾号、双引号或单引号
    'jsx-quotes': 0, // 强制在 JSX 属性中使用一致的单引号或双引号
    'spaced-comment': 2, // 要求或禁止在注释前有空白 (space 或 tab)
    'max-len': ['error', { code: 120 }], // 强制行的最大长度
  },
}
