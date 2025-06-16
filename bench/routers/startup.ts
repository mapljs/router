import categories from './src/index.js';
import { now } from 'mitata/src/lib.mjs';
import { do_not_optimize } from 'mitata/src/lib.mjs';
import { format } from './utils.js';

for (const key in categories) {
  const results: { name: string, ns: number }[] = [];
  console.log('Startup time:', key);

  const handlers = categories[key];
  for (const name in handlers) {
    const fn = handlers[name];

    let start = now();
    do_not_optimize(fn());
    start = now() - start;

    results.push({ name, ns: start });
  }

  results.sort((a, b) => a.ns - b.ns);
  for (let i = 0; i < results.length; i++)
    console.log(`${i + 1}. ${results[i].name}: ${format.time(results[i].ns)}`);

  console.log();
}
