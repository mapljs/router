import categories from './src/_.js';
import { now } from 'mitata/src/lib.mjs';
import { format } from './utils.js';

const exec = new Function(
  'n',
  'f',
  '"use strict";var a=n();f()("GET","/");var b=n();return b-a',
);

for (const key in categories) {
  console.log(format.header(key) + ':');

  const results = Object.entries(categories[key])
    .map(([name, handler]) => ({
      name,
      ns: exec(now, handler),
    }))
    .sort((a, b) => a.ns - b.ns);

  const baseline = results[0].ns;

  for (let i = 0; i < results.length; i++) {
    const res = results[i].ns;
    console.log(
      `  ${format.name(results[i].name)}: ${format.time(res)}${
        i === 0 ? '' : ` - ${format.multiplier(res / baseline)} slower`
      }`,
    );
  }

  console.log();
}
