import type { Subject } from '../cases.ts';

import * as mapl from './mapl/_.ts';
import * as hono from './hono/_.ts';
import * as koa from './koa.ts';
import * as rou3 from './rou3/_.ts';
import * as trek from './trek.ts';

const FILTERS = {
  includeSubject: (name) => true,
} satisfies Record<string, (name: string) => boolean>;

const ALL: Record<string, Subject> = {
  mapl_jit: mapl.jit,
  mapl_tree: mapl.tree,
  mapl_regexp: mapl.regexp,

  hono_regexp: hono.regexp,
  hono_tree: hono.trie,
  hono_pattern: hono.pattern,

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
