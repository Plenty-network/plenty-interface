// eslint-disable-next-line no-undef
const isDev = process.env.NODE_ENV === 'development';

// * Add common rules here
const commonRules = {
  'linebreak-style': ['error', 'unix'],
  quotes: ['error', 'single'],
  semi: ['error', 'always'],
  'prefer-const': [
    'error',
    {
      destructuring: 'any',
      ignoreReadBeforeAssign: false,
    },
  ],
  eqeqeq: ['error', 'always', { null: 'ignore' }],
  'no-var': 'error',
  'no-unused-vars': 'error',
};

// * Add custom prod rules here
const prodRules = { ...commonRules };

// * Add custom dev rules here
const devRules = {
  ...commonRules,
  'no-unused-vars': 'warn',
};

// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ['react'],
  rules: isDev ? devRules : prodRules,
};
