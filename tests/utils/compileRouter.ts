import { PATH } from '@mapl/router/constants';
import buildRouter from '@mapl/router/path/compiler';

import type { Router } from '@mapl/router/path';

// eslint-disable-next-line
export default (root: Router<string>): ((path: string) => any) =>
  // eslint-disable-next-line
  Function(`return (${PATH})=>{${buildRouter(root, 0)}}`)();
