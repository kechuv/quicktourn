/** @type { import("eslint").Linter.Config } */
module.exports = {
  root: true,
  plugins: [
    '@stylistic',
  ],
  extends: [
    'eslint:recommended',
    'plugin:svelte/recommended',
    'plugin:@stylistic/recommended-extends',
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
    extraFileExtensions: [
      '.svelte',
    ],
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  rules: {
    'no-console': [
      'error',
      {
        allow: [
          'warn',
          'error',
        ],
      },
    ],
    'eqeqeq': [
      'error',
    ],
    'max-depth': [
      'error',
      3,
    ],
    'max-params': [
      'error',
      3,
    ],
    'complexity': [
      'error',
      5,
    ],
    '@stylistic/array-bracket-newline': [
      'error',
      {
        minItems: 1,
      },
    ],
    '@stylistic/array-element-newline': [
      'error',
      {
        minItems: 1,
      },
    ],
    '@stylistic/function-call-argument-newline': [
      'error',
      'consistent',
    ],
    '@stylistic/function-paren-newline': [
      'error',
      'multiline',
    ],
    '@stylistic/indent': [
      'error',
      2,
    ],
    '@stylistic/linebreak-style': [
      'error',
      'unix',
    ],
    '@stylistic/max-statements-per-line': [
      'error',
    ],
    '@stylistic/multiline-ternary': [
      'error',
      'always',
    ],
    '@stylistic/newline-per-chained-call': [
      'error',
    ],
    '@stylistic/no-multi-spaces': [
      'error',
    ],
    '@stylistic/no-multiple-empty-lines': [
      'error',
    ],
    '@stylistic/no-trailing-spaces': [
      'error',
    ],
    '@stylistic/object-curly-newline': [
      'error',
    ],
    '@stylistic/object-property-newline': [
      'error',
    ],
    '@stylistic/operator-linebreak': [
      'error',
      'before',
    ],
    '@stylistic/quotes': [
      'error',
      'single',
    ],
    '@stylistic/semi': [
      'error',
      'always',
    ],
    '@stylistic/space-before-function-paren': [
      'error',
      'never',
    ],
    '@stylistic/spaced-comment': [
      'error',
    ],
  },
};
