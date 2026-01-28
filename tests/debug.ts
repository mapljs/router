import { createNode, insertItem, type Node } from '@mapl/router/tree/node';

export const logNode = (node: Node, spaces = '') => {
  console.log(spaces + '- ' + (node[1] === null ? node[0] : node[0] + '!'));
  spaces += '  ';

  if (node[2] !== null)
    for (
      let i = 0,
        children = Object.values(node[2]);
      i < children.length;
      i++
    )
      logNode(children[i], spaces);

  if (node[3] !== null) {
    console.log(spaces + (node[3][1] === null ? '- *' : '- *!'));
    if (node[3][0] !== null)
      logNode(node[3][0], spaces + '  ');
  }

  if (node[4] !== null)
    console.log(spaces + '- **');
}

let root = createNode('/');
{
  insertItem(root, '/a/b', 0);
  insertItem(root, '/a/c', 0);
  insertItem(root, '/a/*', 0);
  insertItem(root, '/a/b/*', 0);
  insertItem(root, '/a/b/**', 0);
  insertItem(root, '/a/**', 0);
  insertItem(root, '/**', 0);
  logNode(root);
}
