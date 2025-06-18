See example output of `@mapl/router`.
```sh
# Installed dependencies
cd .. && bun i && cd snapshots

# Build examples
bun snap
```

To build a snapshot for a list of routes, add to [index.ts](./index.ts):
```ts
write('Snapshot name', {
  GET: {
    '/example': 0,
    '/api/hello': 1,
    // Other routes...
  },
  POST: {
    '/json': 2,
    // Other routes...
  },
  // Other methods...
})
```
