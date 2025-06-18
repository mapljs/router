import type { Subject } from '../cases.js';

import * as mapl from './mapl/_.js';
import * as hono from './hono/_.js';
import * as koa from './koa.js';
import * as rou3 from './rou3/_.js';
import * as trek from './trek.js';

const FILTERS = {
  includeSubject: (name) => true,
} satisfies Record<string, (name: string) => boolean>;

const ALL: Record<string, Subject> = {
  mapl_jit: mapl.jit,
  mapl_tree: mapl.tree,
  mapl_regexp: mapl.regexp,

  hono_regexp: hono.regexp,
  hono_tree: hono.trie,

  koa_tree: koa.tree,

  rou3_jit: rou3.jit,
  rou3_tree: rou3.tree,

  trek_tree: trek.tree,
};

// Sort into categories
const categories: {
  [K in string]?: Record<string, Subject[keyof Subject] & {}>;
} = {};

for (const name in ALL) {
  const subject = ALL[name];
  if (FILTERS.includeSubject(name))
    for (const cat in subject) (categories[cat] ??= {})[name] = subject[cat];
}

export default categories;
