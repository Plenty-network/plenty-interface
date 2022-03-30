// eslint-disable-next-line no-undef
const isDev = process.env.NODE_ENV === 'development';

// * Add common rules here
const mainRules = {
  'linebreak-style': 0,
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
  'no-unused-vars': ['error', { varsIgnorePattern: '^_' }],
  'react/react-in-jsx-scope': 'off',
  // TODO Add this rule
  // 'no-console': ['error', { allow: ['warn', 'error'] }],
};

// * Add custom dev rules here
const devRules = {
  ...mainRules,
  'no-unused-vars': ['warn', { varsIgnorePattern: '^_' }],
  // 'no-console': ['warn', { allow: ['warn', 'error'] }],
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
  rules: isDev ? devRules : mainRules,
};
