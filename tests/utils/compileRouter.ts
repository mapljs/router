import { PATH } from '@mapl/router/constants';
import { compileRouter as compileRouterContent, type Router } from '@mapl/router/index';

// eslint-disable-next-line
export default (root: Router): (path: string) => any =>
  // eslint-disable-next-line
  Function(`return (${PATH})=>{${compileRouterContent(root)}return null;}`)();
