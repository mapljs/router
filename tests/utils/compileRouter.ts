import { PATH } from '@mapl/router/constants';
import buildRouter from '@mapl/router/compile';

import type { Router } from '@mapl/router/index';

// eslint-disable-next-line
export default (root: Router): (path: string) => any =>
  // eslint-disable-next-line
  Function(`return (${PATH})=>{${buildRouter(root)}return null;}`)();
