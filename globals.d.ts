import * as consts from './src/constants.js';

// Zero-cost constants at runtime
declare global {
  const constants: typeof consts;
}
