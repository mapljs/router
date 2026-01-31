export type Node<T = unknown> = [
  part: string,
  store: T | null,
  children: Node<T>[] | null,
  params: ParamNode<T> | null,
  wildcardStore: T | null,
];

export type ParamNode<T = unknown> = [child: Node<T> | null, store: T | null];

// Implementations
export const isEmptyNode = (node: Node<any>): boolean =>
  node[1] === null && node[2] === null && node[3] === null && node[4] === null;

// Fast path for inserting new branch
export const insertNewBranch = <T>(
  root: Node<T>,
  path: string,
  currentIdx: number,
  value: T,
): void => {
  let startIdx = currentIdx;
  currentIdx = path.indexOf('*', startIdx);

  while (currentIdx > -1) {
    // Add previous path part
    if (startIdx < currentIdx) {
      const nextNode: Node<T> = [
        path.slice(startIdx, currentIdx),
        null,
        null,
        null,
        null,
      ];

      (root[2] ??= [])[path.charCodeAt(startIdx)] = nextNode;
      root = nextNode;
    }

    // ends with **
    if (
      currentIdx + 2 === path.length &&
      path.charCodeAt(currentIdx + 1) === 42
    ) {
      root[4] = value;
      return;
    }

    // ends with *
    if (currentIdx + 1 === path.length) {
      root[3] = [null, value];
      return;
    }

    // */other/part
    const nextNode: Node<T> = ['/', null, null, null, null];
    root[3] = [nextNode, null];
    root = nextNode;

    // Skip */
    startIdx = currentIdx + 2;
    currentIdx = path.indexOf('*', startIdx);
  }

  (root[2] ??= [])[path.charCodeAt(startIdx)] = [
    path.slice(startIdx),
    value,
    null,
    null,
    null,
  ];
};

// insertToRoot(root, 1 path, 1, value)
// always start checking from index 1 instead of 0
export const insert = <T>(
  root: Node<T>,
  partIdx: number,
  path: string,
  pathIdx: number,
  value: T,
): void => {
  let part = root[0];

  while (pathIdx < path.length) {
    const pathChar = path.charCodeAt(pathIdx);

    // * or **
    if (pathChar === 42) {
      // .../**
      if (
        pathIdx + 2 === path.length &&
        path.charCodeAt(pathIdx + 1) === 42
      ) {
        root[4] = value;
        return;
      }

      if (root[3] === null) {
        insertNewBranch(root, path, pathIdx, value);
        return;
      }

      // .../*
      if (pathIdx + 1 === path.length) {
        root[3][1] = value;
        return;
      }

      // .../*/...
      root = root[3][0]! ??= ['/', null, null, null, null];

      partIdx = 1;
      // Always a root node
      part = '/';

      pathIdx += 2;
    }

    // (path) is longer than (currentPart)
    else if (partIdx === part.length) {
      const children = root[2];

      // Add new children
      if (children === null) {
        insertNewBranch(root, path, pathIdx, value);
        return;
      }

      const nextNode = children[pathChar];
      if (nextNode == null) {
        insertNewBranch(root, path, pathIdx, value);
        return;
      }

      // Move to next child node
      root = nextNode;

      partIdx = 1;
      part = root[0];

      pathIdx++;
    }

    // Split the node
    else if (pathChar !== part.charCodeAt(partIdx)) {
      // Split the old path
      const children: Node<T>[2] = [];
      children[part.charCodeAt(partIdx)] = [
        part.slice(partIdx),
        root[1],
        root[2],
        root[3],
        root[4],
      ];

      root[0] = part.slice(0, partIdx);
      root[2] = children;
      root[1] = root[3] = root[4] = null;

      insertNewBranch(root, path, pathIdx, value);
      return;
    }

    // Check next char
    else {
      partIdx++;
      pathIdx++;
    }
  }

  // End of path string but not node part string
  if (partIdx < part.length) {
    // Split the old path
    const children: Node<T>[2] = [];
    children[part.charCodeAt(partIdx)] = [
      part.slice(partIdx),
      root[1],
      root[2],
      root[3],
      root[4],
    ];

    root[0] = part.slice(0, partIdx);
    root[2] = children;

    // Doesnt need to set root[1] to null bcuz it will later be set
    root[3] = root[4] = null;
  };

  root[1] = value;
};
