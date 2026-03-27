import { $ } from 'bun';
import { LIB } from '../lib/constants.ts';

$`cd ${LIB} && npm publish --access=public --otp=${process.argv.at(2) ?? prompt('OTP:')}`;
