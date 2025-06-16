import type { Subject } from '../cases.js';

import * as mapl from './mapl.js';
import * as hono from './hono.js';
import * as koa from './koa.js';
import trek from './trek.js';

const ALL: Record<string, Subject> = {
  mapl_jit: mapl.jit,
  mapl_tree: mapl.tree,
  hono_regexp: hono.regexp,
  hono_trie: hono.trie,
  koa_tree: koa.tree,
  trek,
};

// Sort into categories
const categories: {
  [K in string]?: Record<string, Subject[keyof Subject] & {}>;
} = {};

for (const name in ALL) {
  const subject = ALL[name];
  for (const cat in subject) (categories[cat] ??= {})[name] = subject[cat];
}

export default categories;
