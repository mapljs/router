import { PATH } from '@mapl/router/constants';
import { compileRouter as compileRouterContent, type Router } from '@mapl/router/index';

export default function compileRouter(root: Router): (path: string) => any {
  const contentBuilder = [] as string[];
  const externalValues = [] as any[];
  compileRouterContent(root, contentBuilder, (item) => contentBuilder.push(`return f${externalValues.push(item)};`));

  // eslint-disable-next-line
  return Function(
    ...externalValues.map((_, i) => 'f' + (i + 1)),
    `return (${PATH})=>{${contentBuilder.join('')}return null;}`
  )(...externalValues);
}
