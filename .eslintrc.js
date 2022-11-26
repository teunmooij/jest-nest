/* eslint-env node */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    'ecmaVersion': 2020, // Allows for the parsing of modern ECMAScript features
    'sourceType': 'module', // Allows for the use of imports
    'ecmaFeatures': {},
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/no-namespace': 0,
  },
  env: {
    'node': true,
    'jest': true,
    'jasmine': true,
  },
  plugins: ['sort-class-members', 'jest'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from @typescript-eslint/eslint-plugin
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
};
