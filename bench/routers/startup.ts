import categories from './src/_.js';
import { measure } from 'mitata/src/lib.mjs';
import { format } from './utils.js';

for (const key in categories) {
  const results: { name: string; ns: number }[] = [];
  console.log(format.header(key) + ':');

  const handlers = categories[key];
  for (const name in handlers) {
    const fn = handlers[name];

    const res = await measure(() => fn()('GET', '/'), {
      inner_gc: true,
      warmup_samples: 1,
      max_samples: 3,
    });

    results.push({
      name,
      ns: res.avg,
    });
  }

  results.sort((a, b) => a.ns - b.ns);

  const fastestNs = results[0].ns;
  console.log(`  ${format.name(results[0].name)}: ${format.time(fastestNs)}`);

  for (let i = 1; i < results.length; i++) {
    const { name, ns } = results[i];
    console.log(
      `    ${format.multiplier((ns / fastestNs).toFixed(2) + 'x')} faster than ${format.name(name)}: ${format.time(ns)}`,
    );
  }

  console.log();
}
