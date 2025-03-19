import { PATH } from '@mapl/router/constants';
import buildRouter from '@mapl/router/compile';

import type { Router } from '@mapl/router';
import type { Compiler } from '@mapl/router/tree/compiler';

// eslint-disable-next-line
export default (root: Router<string>, compile: Compiler): (path: string) => any =>
  // eslint-disable-next-line
  Function(`return (${PATH})=>{${buildRouter(root, compile, 0)}return null;}`)();
