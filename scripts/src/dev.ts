import { watch } from 'chokidar';

import { ROOT, SOURCE } from '../lib/constants.ts';
import {
  buildSourceSync,
  linkSync,
  modifyPackageJson,
  removeSourceSync,
  unlinkSync,
} from '../lib/build.ts';
import { testTargets } from '../lib/test.ts';
import { matchesGlobs } from '../lib/fs.ts';

import { build as BUILD_CONFIG } from '../config.ts';
import { globSync } from 'node:fs';

// Link files
for (const path of globSync(BUILD_CONFIG.symlinks, {
  cwd: ROOT,
}))
  linkSync(path);

//
// BUILD
//
{
  const modifiers = {
    exports: {},
    devDependencies: undefined,
    scripts: undefined,
    imports: undefined,
  };
  watch('.', {
    ignored: (path, stats) => !!stats?.isFile() && !matchesGlobs(path, BUILD_CONFIG.files),
    cwd: SOURCE,
    interval: 100,
  })
    .on('add', (path) => {
      buildSourceSync(true, path, modifiers.exports);
      modifyPackageJson(modifiers);
    })
    .on('change', (path) => {
      buildSourceSync(true, path, {});
    })
    .on('unlink', (path) => {
      removeSourceSync(path, modifiers.exports);
      modifyPackageJson(modifiers);
    })
    .on('error', (e) => {
      console.error(e);
    });
}

testTargets(true);
