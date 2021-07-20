import { FunctionParser } from 'firebase-backend';

if (process.env.FUNCTIONS_EMULATOR) {
  console.log('We are running emulators locally.');

}

exports = new FunctionParser(__dirname, exports).exports;