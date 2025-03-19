A fast radix tree router.

# Patterns

`@mapl/router` supports two basic patterns:

```ts
'/*/info' // Capture the value of a segment
'/**' // Capture everything after the slash
```

## Limitation
Patterns cannot include quotes and escape characters.
