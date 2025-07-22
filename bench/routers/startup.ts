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
      warmup_samples: 0,
      max_samples: 1,
    });

    results.push({
      name,
      ns: res.avg,
    });
  }

  results.sort((a, b) => a.ns - b.ns);
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
