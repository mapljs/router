import { cloneNode, createParamNode, resetNode, visitNode, type Node, type ParamNode } from './node';

// Merge nodes with the same first character
export function mergeNode(target: Node, source: Node): void {
  const targetPath = target[0];
  const sourcePath = source[0];

  // Quick comparison
  if (targetPath === sourcePath) {
    mergeNodeProps(target, source);
    return;
  }

  const targetPathLen = targetPath.length;
  const sourcePathLen = sourcePath.length;
  const minLen = targetPathLen < sourcePathLen ? targetPathLen : sourcePathLen;

  // Check when prefix ends
  for (let i = 1; i < minLen; i++) {
    if (targetPath.charCodeAt(i) !== sourcePath.charCodeAt(i)) {
      // Split the target into two paths
      const children: Node[2] = {};
      children[targetPath.charCodeAt(i)] = cloneNode(target, targetPath.slice(i));
      children[sourcePath.charCodeAt(i)] = cloneNode(source, sourcePath.slice(i));

      resetNode(target, targetPath.substring(0, i), children);
      return;
    }
  }

  // Source path continues
  if (minLen === targetPathLen) {
    const nextNode = cloneNode(source, sourcePath.slice(targetPathLen));
    const pathId = sourcePath.charCodeAt(targetPathLen);

    // Source becomes target children
    if (target[2] === null) {
      const children: Node[2] = {};
      children[pathId] = nextNode;
      target[2] = children;
    } else {
      const children = target[2];

      if (typeof children[pathId] === 'undefined')
        children[pathId] = nextNode;
      else
        mergeNode(children[pathId], nextNode);
    }
  } else {
    // Slice the target node
    const children: Node[2] = {};
    children[targetPath.charCodeAt(sourcePathLen)] = cloneNode(target, targetPath.slice(sourcePathLen));
    resetNode(target, sourcePath, children);

    // Merge the upper node with source
    mergeNodeProps(target, source);
  }
}

export function mergeNodeWithPrefix(target: Node, source: Node, prefix: string): void {
  if (prefix.charCodeAt(prefix.length - 1) === 42) {
    const endNode = visitNode(target, prefix.substring(0, prefix.length - 1));

    // Assign parameter node correctly
    if (endNode[3] === null)
      endNode[3] = createParamNode(source);
    else {
      // Source is a root node and source has a store
      // Then move the store to endNode
      if (source[0].length === 1 && source[1] !== null) {
        endNode[3][1] = source[1];

        // Replace with a clone
        source = cloneNode(source, source[0]);
        source[1] = null;
      }

      if (endNode[3][0] === null)
        endNode[3][0] = source;
      else
        mergeNode(endNode[3][0], source);
    }
  } else
    mergeNode(visitNode(target, prefix), source);
}

// Merge parameter node properties
export function mergeParamNode(target: ParamNode, source: ParamNode): void {
  // Overwrite store
  if (source[1] !== null)
    target[1] = source[1];

  if (source[0] !== null) {
    if (target[0] === null)
      target[0] = source[0];
    else
      mergeNode(target[0], source[0]);
  }
}

// Merge properties of two nodes
export function mergeNodeProps(target: Node, source: Node): void {
  // Overwrite store
  if (source[1] !== null)
    target[1] = source[1];

  // Merge children nodes
  if (source[2] !== null) {
    if (target[2] === null)
      target[2] = source[2];
    else {
      const targetChildren = target[2];
      const sourceChildren = source[2];

      for (const key in sourceChildren) {
        if (typeof targetChildren[key] === 'undefined')
          targetChildren[key] = sourceChildren[key];
        else
          mergeNode(targetChildren[key], sourceChildren[key]);
      }
    }
  }

  // Merge parameter nodes
  if (source[3] !== null) {
    if (target[3] === null)
      target[3] = source[3];
    else
      mergeParamNode(target[3], source[3]);
  }

  // Overwrite wildcard store
  if (source[4] !== null)
    target[4] = source[4];
}
