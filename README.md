A fast radix tree router.

# Patterns
`@mapl/router` supports two basic patterns:

```ts
'/*/info' // Capture the value of a segment
'/**' // Capture everything after the slash
```

# Usage
These links mentioned below only works on [Github](https://github.com/mapljs/router).

See [jit.ts](./bench/routers/src/mapl/jit.ts) for jit compilation usage.

You can view example compiler outputs in [snapshots](./snapshots).

For jitless examples see:
- [regexp.ts](./bench/routers/src/mapl/regexp.ts): A RegExp router based on `@mapl/router` tree structure.
- [tree.ts](./bench/routers/src/mapl/tree.ts): A jitless tree router based on `@mapl/router` tree structure.

# Benchmark
See [./bench/routers](./bench/routers) guide for routers benchmarking.
