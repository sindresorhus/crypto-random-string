import {promisify} from 'node:util';
import crypto from 'node:crypto';
import {createStringGenerator, createAsyncStringGenerator} from './core.js';

const randomBytesAsync = promisify(crypto.randomBytes);

export default createStringGenerator((byteLength, type, length) => crypto.randomBytes(byteLength).toString(type).slice(0, length), size => new Uint8Array(crypto.randomBytes(size)));
export const cryptoRandomStringAsync = createAsyncStringGenerator(async (byteLength, type, length) => {
	const buffer = await randomBytesAsync(byteLength);
	return buffer.toString(type).slice(0, length);
}, async size => new Uint8Array(await randomBytesAsync(size)));
