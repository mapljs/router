import type { Subject } from '../cases.js';

import * as mapl from './mapl.js';
import * as hono from './hono.js';
import * as koa from './koa.js';
import * as rou3 from './rou3.js';
import * as trek from './trek.js';

const FILTERS = {
  include: (name, subject) => true
} satisfies Record<string, (name: string, o: Subject) => boolean>;

const ALL: Record<string, Subject> = {
  mapl_jit: mapl.jit,
  mapl_tree: mapl.tree,

  hono_regexp: hono.regexp,
  hono_tree: hono.trie,

  koa_tree: koa.tree,

  rou3_jit: rou3.jit,
  rou3_tree: rou3.tree,

  trek_tree: trek.tree
};

// Sort into categories
const categories: {
  [K in string]?: Record<string, Subject[keyof Subject] & {}>;
} = {};

for (const name in ALL) {
  const subject = ALL[name];
  if (FILTERS.include(name, subject))
    for (const cat in subject) (categories[cat] ??= {})[name] = subject[cat];
}

export default categories;
