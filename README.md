# `@mapl/router`

A fast compiled radix tree router.

```ts
import {
  PARAMS,
  PATHNAME,
  PATHNAME_LEN,
  compileNode,
  type RouterCompilerState,
} from "@mapl/router/tree/compiler";
import { createNode, insertItem } from "@mapl/router/tree/node";
import { getExternalKeys, getContent } from "@mapl/compiler";

// Initialize the root node
const root = createNode("/");

// Add some routes
insertItem(root, "/", 0);
insertItem(root, "/user/*", 1);
insertItem(root, "/**", 2);

// Initialize the compiler state
const state: RouterCompilerState<any> = {
  contentBuilder: [],
  declarationBuilders: [],
  localVarCount: 0,
  externalValues: [],

  // Same args as compileNode except the first one
  compileItem: (item, state) => {
    state.contentBuilder.push(`return f${state.externalValues.length};`);
    state.externalValues.push(item);
  },
};

// Compile from root node
compileNode(root, state, false, false, 0, "");

// Create the match function using the result state
const match = Function(
  ...getExternalKeys(state),
  `return (${PATHNAME},${PARAMS})=>{const ${PATHNAME_LEN}=${PATHNAME}.length;${getContent(state)}}`,
)(...state.externalValues);

// Example usage
const res0 = match("/", []);
res0; // 0

const params1 = [];
const res1 = match("/user/0", params1);
params1; // ['0']
res1; // 1

const params2 = [];
const res2 = match("/navigate/to/about", params2);
params2; // ['navigate/to/about']
res2; // 2
```
