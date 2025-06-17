This benchmark measures different routers matching performance and startup time.
```sh
# Install dependencies & build mapl
cd ../.. && bun i && bun task build && cd bench/routers

# Startup bench
bun startup

# Performance bench
bun perf
```

To add a router, create a file in [src](./src) with the following content:
```ts
import type { Subject } from "../cases.js";

export default {
  [testCaseName]: (): (method: string, path: string) => {
    // Return a handler
  }
} satisfies Subject;
```

Import the exported object and add to `ALL` dictionary in [src/index.ts](./src/index.ts).
```ts
import router from './router-file.ts';

const ALL = {
  ...previousRouters,
  [routerName]: router
};
```

The handler return value must match the format below
```ts
f() => '' // No matching routes
f(id) => `${id}` // Match static route
f(id, params) => `${id}: ${params.join(' - ')}` // Match dynamic routes
```

Route id for each test cases are in [cases.ts](./cases.ts#L16).
`*` means capturing current segment (param) and `**` means capturing all segments from the current position (wildcard).

To filter out tests, see the list of filters in [cases.ts](./cases.ts#L9).
