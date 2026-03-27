import { rmSync, mkdirSync, globSync } from 'node:fs';

import { LIB, ROOT, SOURCE } from '../lib/constants.ts';
import { buildSourceSync, linkSync, modifyPackageJson } from '../lib/build.ts';
import { build as CONFIG } from '../config.ts';

//
// MAIN
//
try {
  rmSync(LIB, { recursive: true });
} catch {}
mkdirSync(LIB, { recursive: true });

// Link files
for (const path of globSync(CONFIG.symlinks, {
  cwd: ROOT,
}))
  linkSync(path);

// Build files and add exports to lib/package.json
const modifiers = {
  exports: {},
  devDependencies: undefined,
  scripts: undefined,
  imports: undefined,
};
for (const path of globSync(CONFIG.files, {
  cwd: SOURCE,
}))
  buildSourceSync(false, path, modifiers.exports);
modifyPackageJson(modifiers);
