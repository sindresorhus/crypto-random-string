// TODO: When targeting Node.js 16, remove `cryptoRandomStringAsync` and use `crypto.webcrypto.getRandomValues` to interop with the browser code.
// TODO: Later, when targeting Node.js 18, only use the browser code
import {promisify} from 'node:util';
import {randomBytes} from 'node:crypto';
import {createStringGenerator, createAsyncStringGenerator} from './core.js';

const randomBytesAsync = promisify(randomBytes);

export default createStringGenerator((byteLength, type, length) => randomBytes(byteLength).toString(type).slice(0, length), size => new Uint8Array(randomBytes(size)));
export const cryptoRandomStringAsync = createAsyncStringGenerator(async (byteLength, type, length) => {
	const buffer = await randomBytesAsync(byteLength);
	return buffer.toString(type).slice(0, length);
}, async size => new Uint8Array(await randomBytesAsync(size)));
