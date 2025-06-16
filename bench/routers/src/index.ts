import type { Subject } from "../cases.js";

import mapl from "./mapl.js";
const ALL: Record<string, Subject> = {
  mapl
};

// Sort into categories
const categories: {
  [K in string]?: Record<string, Subject[keyof Subject] & {}>
} = {};

for (const name in ALL) {
  const subject = ALL[name];
  for (const cat in subject)
    (categories[cat] ??= {})[name] = subject[cat];
}

export default categories;
