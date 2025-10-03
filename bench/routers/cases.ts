import { format, list, rand } from './utils.ts';

// List cases
const CASES = 50;
const FORMAT = (id: number, params: string[]) =>
  params.length === 0 ? '' + id : `${id}: ${params.join(' - ')}`;

interface Case {
  routes: {
    [K in 'GET' | 'POST' | 'PUT' | 'DELETE' | '' | (string & {})]?: Record<
      string,
      number
    >;
  };
  fallbacks: {
    [K in 'GET' | 'POST' | 'PUT' | 'DELETE' | '' | (string & {})]?: string[];
  };
}

const cases = {
  'basic-api': {
    routes: {
      GET: {
        '/user': 0,
        '/user/comments': 1,
        '/user/avatar': 2,
        '/user/lookup/username/*': 3,
        '/user/lookup/email/*': 4,
        '/event/*': 5,
        '/event/*/comments': 6,
        '/map/*/events': 7,
        '/status': 8,
        '/very/deeply/nested/route/hello/there': 9,
      },
      POST: {
        '/event/*/comment': 10,
      },
    },
    fallbacks: {
      GET: [
        '/',
        '/users',
        '/user/lookup',
        '/map/events',
        '/very/deeply/nested/route/hello',
        `/event/${rand.string(5)}/comment`,
      ],
      PUT: ['/', '/users', '/user/lookup', '/map/events'],
      DELETE: ['/', '/users', '/user/lookup', '/map/events'],
      OPTIONS: ['/', '/users', '/user/lookup', '/map/events'],
      PATCH: ['/', '/users', '/user/lookup', '/map/events'],
    },
  },
} satisfies Record<string, Case>;

export type CaseName = keyof typeof cases;

// Generate case tests
export interface Test {
  method: string;
  path: string;
  expected: string;
}

export interface CaseTests {
  routes: Record<string, Test[]>;
  fallbacks: Test[];
}

const generateTests = (c: Case): CaseTests => {
  const store: Record<string, Test[]> = {};

  for (const method in c.routes) {
    const patterns = c.routes[method];
    for (const pat in patterns) {
      store[`${method} ${pat}`] = list(CASES, () => {
        const res = rand.path(pat);
        return {
          method,
          path: res.path,
          expected: FORMAT(patterns[pat], res.params),
        };
      });
    }
  }

  return {
    routes: store,
    fallbacks: Object.entries(c.fallbacks)
      .flatMap(([method, paths]) =>
        paths.map((path): Test => ({ method, path, expected: '' })),
      ),
  };
};

export const allTests = Object.fromEntries(
  Object.entries(cases).map(([key, val]) => [key, generateTests(val)]),
);

export type Handler = (method: string, path: string) => string;

// Validate a handler
export const validate = (
  label: string,
  fn: Handler,
  caseTests: CaseTests,
): boolean => {
  console.log(format.header(label) + ':');
  let res = true;

  const matchTest = (test: Test) => {
    let payload: any;
    try {
      payload = fn(test.method, test.path);
      if (payload === test.expected) return;
    } catch (e) {
      payload = e;
    }

    console.log(
      `    ${format.header(label)} failed test`,
      format.name(`${test.method} ${test.path}`),
    );
    console.log('    expected:', format.success(test.expected));
    console.log('    found:', format.error(payload));
    res = false;
  };

  for (const name in caseTests.routes) {
    console.log(`  Match ${format.name(name)}`);
    for (const test of caseTests.routes[name]) matchTest(test);
  }

  for (const test of caseTests.fallbacks) {
    console.log(`  Not match ${format.name(`${test.method} ${test.path}`)}`);
    matchTest(test);
  }

  console.log();

  return res;
};

// Test subject
export type Subject = {
  [K in CaseName]?: () => Handler;
};
