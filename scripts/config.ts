import * as constants from '../src/constants.ts';

export const test: import('./lib/test.ts').Config = {
  bun: {
    args: {
      randomize: true,
      smol: true,
      'no-clear-screen': true,
    },
  },

  node: {
    disabled: true,
    args: {
      'test-isolation': 'none',
    },
  },
};

export const build: import('./lib/build.ts').Config = {
  files: ['**/*.ts'],
  symlinks: ['README.md', 'LICENSE'],

  transform: {
    sourceType: 'module',
    typescript: {
      rewriteImportExtensions: true,
      declaration: {
        stripInternal: true,
      },
    },
    define: Object.fromEntries(
      Object.entries(constants).map(
        (entry) => (
          (entry[0] = 'constants.' + entry[0]), (entry[1] = JSON.stringify(entry[1]) as any), entry
        ),
      ),
    ),
    lang: 'ts',
  },
  minify: {
    compress: {
      module: true,
      defaults: false,
      dead_code: true,
      const_to_let: true,
      conditionals: true,
      booleans: true,
      drop_debugger: true,
      evaluate: true,
      join_vars: true,
      inline: 3,
      passes: 3,
    },
    mangle: false,
    module: true,
  },
};
