const config = require('@rubensworks/eslint-config');

module.exports = config([
  {
    files: [ '**/*.ts' ],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: [ './tsconfig.eslint.json' ],
      },
    },
  },
  {
    files: [ 'scripts/**/*.ts' ],
    rules: {
      'import/no-nodejs-modules': 'off',
      'no-sync': 'off',
      'ts/no-unsafe-assignment': 'off',
    },
  },
]);
