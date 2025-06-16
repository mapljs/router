import { validate, allTests, type Test } from './cases.js';
import categories from './src/index.js';
import { bench, do_not_optimize, run, summary } from 'mitata';

for (const cat in categories) {
  const testCases = allTests[cat];
  const handlers = categories[cat];

  // Validation
  const validHandlers: {
    [k: string]: ReturnType<(typeof categories)[string][string]>
  } = {};

  for (const name in handlers) {
    const fn = handlers[name]();
    if (validate(name, fn, testCases))
      validHandlers[name] = fn;
  }

  // Register for tests
  for (const testRoute in testCases.routes)
    summary(() => {
      for (const name in validHandlers)
        bench(`${cat}: ${testRoute} - ${name}`, function* () {
          const fn = validHandlers[name];

          yield {
            [0]: () => testCases.routes[testRoute],
            bench: (tests: Test[]) => {
              for (let i = 0; i < tests.length; i++)
                do_not_optimize(fn(tests[i].method, tests[i].path));
            }
          }
        });
    });
}

run();
