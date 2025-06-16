import type { Subject } from '../cases.js';

import { jit as maplJit, radix as maplRadix } from './mapl.js';
import { regexp as honoRegexp } from './hono.js';

const ALL: Record<string, Subject> = {
  mapl_jit: maplJit,
  mapl: maplRadix,
  hono_regexp: honoRegexp,
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
