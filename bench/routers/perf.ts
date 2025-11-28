import { validate, allTests, type Test } from './cases.ts';
import categories from './src/_.ts';
import { writeFileSync } from 'node:fs';
import { bench, do_not_optimize, run, summary } from 'mitata';
import { RUNTIME } from './utils.ts';

for (const cat in categories) {
  console.log('Category:', cat);
  console.log();

  const testCases = allTests[cat];
  const handlers = categories[cat];

  // Validation
  const validHandlers: {
    [k: string]: ReturnType<((typeof categories)[string] & {})[string]>;
  } = {};

  for (const name in handlers) {
    const fn = handlers[name]();
    if (validate(name, fn, testCases)) validHandlers[name] = fn;
  }

  // Register for tests
  for (const testRoute in testCases.routes)
    summary(() => {
      for (const name in validHandlers)
        bench(`${name} - ${testRoute}`, function* () {
          const fn = validHandlers[name];

          yield {
            [0]: () => testCases.routes[testRoute].map((route) => {
              const req = new Request('http://localhost:3000' + route.path, { method: route.method });
              const url = req.url;
              const pathStart = url.indexOf('/', 12);
              const pathEnd = url.indexOf('?', pathStart + 1);

              return {
                method: req.method,
                path: pathEnd === -1 ? url.slice(pathStart) : url.slice(pathStart, pathEnd)
              }
            }),
            bench: (tests: Test[]) => {
              for (let i = 0; i < tests.length; i++)
                do_not_optimize(fn(tests[i].method, tests[i].path));
            },
          };
        });
    });
}

{
  // Formatting stuff
  const createUnitFormat = (units: string[]) => (n: number) => {
    let i = 0;
    while (n >= 1000 && i < units.length - 1) {
      i++;
      n /= 1000;
    }
    return n.toFixed(2) + units[i];
  };

  const time = createUnitFormat(['ns', 'µs', 'ms', 's']);
  const byte = createUnitFormat(['b', 'kb', 'mb', 'gb']);

  // Parse raw results
  const results = (await run()).benchmarks.map(
    (bench) =>
      ({
        name: bench.alias,
        runs: bench.runs.map(({ stats }) => ({
          // Need sorting first before formatting
          avg: stats!.avg,
          p99: time(stats!.p99),
          p999: time(stats!.p999),
          mem: stats!.heap && byte(stats!.heap.avg),
        })),
      }) as const,
  );

  // Sort by categories
  const catResults: Record<string, any[]> = {};
  for (const res of results) {
    const [name, route] = res.name.split(' - ', 2);
    (catResults[route] ??= []).push({
      name,
      ...res.runs[0],
    });
  }

  // Format avg after sort
  for (const name in catResults)
    for (const item of catResults[name].sort((a, b) => a.avg - b.avg))
      item.avg = time(item.avg);

  writeFileSync(
    'results_' + RUNTIME + '.json',
    JSON.stringify(catResults, null, 2),
  );
}
