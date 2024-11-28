import { PATH } from '@mapl/router/constants';
import { compileRouter as compileRouterContent, type Router } from '@mapl/router/index';

export default function compileRouter(root: Router): (path: string) => any {
  const contentBuilder = [] as string[];
  compileRouterContent(root, contentBuilder);

  // eslint-disable-next-line
  return Function(`return (${PATH})=>{${contentBuilder.join('')}return null;}`)();
}
