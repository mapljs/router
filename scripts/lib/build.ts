import { basename, dirname, join } from 'node:path';
import {
  readFileSync,
  rmSync,
  writeFileSync,
  symlinkSync,
  unlinkSync as fsUnlinkSync,
  mkdirSync,
} from 'node:fs';

import { minifySync, type JsMinifyOptions } from '@swc/core';
import { transformSync, type TransformOptions } from 'oxc-transform';

import pkg from '../../package.json';

import { LIB, NODE_MODULES, ROOT, SOURCE } from './constants.ts';
import { fmt } from './fmt.ts';

import { build as CONFIG } from '../config.ts';

type Evaluate<T> = { [K in keyof T]: T[K] } & {};

//
// CONFIG
//
export interface Config {
  /**
   * Transform options.
   */
  transform: TransformOptions;

  /**
   * Minify options.
   */
  minify: JsMinifyOptions;

  /**
   * File patterns to build.
   */
  files: string[];

  /**
   * File patterns to symlink.
   */
  symlinks: string[];
}

//
// MAIN
//
export const buildSourceSync = (
  dev: boolean,
  pathFromSource: string,
  exports: Record<string, string | Record<string, string>>,
) => {
  let time = Bun.nanoseconds();

  const fullPath = join(SOURCE, pathFromSource);
  try {
    const pathNoExt = pathFromSource.slice(0, pathFromSource.lastIndexOf('.') >>> 0);
    const pathName = basename(pathNoExt);
    const pathDir = dirname(pathNoExt);

    const transformed = transformSync(
      pathFromSource,
      readFileSync(fullPath, { encoding: 'utf8' }),
      CONFIG.transform,
    );

    const hasCode = transformed.code && transformed.code.trim() !== 'export {};';
    const hasDecl = transformed.declaration && transformed.declaration.trim() !== 'export {};';

    // Faster than trying a syscall and fail
    try {
      mkdirSync(join(LIB, pathDir), { recursive: true });
    } catch {}

    (dev || hasCode) &&
      writeFileSync(
        join(LIB, pathNoExt + '.js'),
        dev ? transformed.code : minifySync(transformed.code, CONFIG.minify).code,
      );
    (dev || hasDecl) && writeFileSync(join(LIB, pathNoExt + '.d.ts'), transformed.declaration!);

    if (hasCode || hasDecl) {
      const isRuntimeKey = pathName.startsWith('_');

      let exportPath =
        pathName === 'index' || isRuntimeKey // Runtime key
          ? dirname(pathNoExt)
          : pathNoExt;
      exportPath === '.' || exportPath.startsWith('./') || (exportPath = './' + exportPath);

      const sourcePath = './' + pathNoExt + (hasCode ? '.js' : '.d.ts');

      if (isRuntimeKey) {
        const runtimeKey = pathName.slice(1);

        if (typeof exports[exportPath] === 'string') {
          console.error(`Change ${exportPath}/index to ${exportPath}/_default instead!`);
          process.exit(1);
        } else
          // @ts-ignore
          (exports[exportPath] ??= {})[runtimeKey] = sourcePath;
      } else exports[exportPath] = sourcePath;
    }
  } finally {
    time = Bun.nanoseconds() - time;
    console.log(fmt.success('+ ' + fmt.relativePath(fullPath)) + ': ' + fmt.duration(time));
  }
};

export const linkSync = (file: string) => {
  const fromFile = join(ROOT, file);
  const toFile = join(LIB, file);

  if (file.includes('/'))
    try {
      mkdirSync(dirname(toFile), { recursive: true });
    } catch {}

  let time = Bun.nanoseconds();
  try {
    symlinkSync(fromFile, toFile);
  } catch (e) {
    if ((e as ErrnoException).code !== 'EEXIST') {
      console.error(e);
      process.exit(1);
    }
  }
  time = Bun.nanoseconds() - time;

  console.log(
    fmt.success(`+ ${fmt.relativePath(toFile)} <-- ${fmt.relativePath(fromFile)}`) +
      ': ' +
      fmt.duration(time),
  );
};

export const unlinkSync = (file: string) => {
  const fromFile = join(ROOT, file);
  const toFile = join(LIB, file);

  let time = Bun.nanoseconds();
  fsUnlinkSync(toFile);
  time = Bun.nanoseconds() - time;

  console.log(
    fmt.error(`- ${fmt.relativePath(fromFile)} -> ${fmt.relativePath(toFile)}`) +
      ': ' +
      fmt.duration(time),
  );
};

export const removeSourceSync = (
  pathFromSource: string,
  exports: Record<string, string | Record<string, string>>,
) => {
  let time = Bun.nanoseconds();

  try {
    const pathNoExt = pathFromSource.slice(0, pathFromSource.lastIndexOf('.') >>> 0);
    const pathName = basename(pathNoExt);

    let hasCode: boolean;
    try {
      rmSync(join(LIB, pathNoExt + '.js'));
      hasCode = true;
    } catch {
      hasCode = false;
    }

    let hasDecl: boolean;
    try {
      rmSync(join(LIB, pathNoExt + '.d.ts'));
      hasDecl = true;
    } catch {
      hasDecl = false;
    }

    if (hasCode || hasDecl) {
      const isRuntimeKey = pathName.startsWith('_');

      const exportPath =
        pathName === 'index' || isRuntimeKey // Runtime key
          ? dirname(pathNoExt)
          : pathNoExt;

      if (isRuntimeKey && Object.keys(exports[exportPath]).length > 1) {
        const runtimeKey = pathName.slice(1);
        // @ts-ignore
        delete exports[exportPath][runtimeKey];
      } else delete exports[exportPath];
    }
  } finally {
    time = Bun.nanoseconds() - time;
    console.log(
      fmt.error('- ' + fmt.relativePath(join(SOURCE, pathFromSource))) + ':',
      fmt.duration(time),
    );
  }
};

// @ts-ignore
pkg.exports = {};
// @ts-ignore
pkg.devDependencies = pkg.trustedDependencies = pkg.scripts = pkg.imports = void 0;
export const LIB_PKG: Evaluate<
  Omit<
    typeof pkg,
    'devDependencies' | 'trustedDependencies' | 'scripts' | 'imports' | 'exports'
  > & { exports: Record<string, string | Record<string, string>> }
> = pkg as any;

const LIB_PACKAGE_JSON = join(LIB, 'package.json');
export const updatePackageJson = () => {
  writeFileSync(LIB_PACKAGE_JSON, JSON.stringify(LIB_PKG));
};

export const initLib = () => {
  try {
    rmSync(LIB, { recursive: true });
  } catch {}
  mkdirSync(LIB, { recursive: true });
};
