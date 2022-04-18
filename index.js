import {promisify} from 'node:util';
import crypto from 'node:crypto';
import {createStringGenerator, createAsyncStringGenerator} from './core.js';

const randomBytesAsync = promisify(crypto.randomBytes);

const cryptoRandomString = createStringGenerator((byteLength, type, length) => crypto.randomBytes(byteLength).toString(type).slice(0, length), crypto.randomBytes);
cryptoRandomString.async = createAsyncStringGenerator(async (byteLength, type, length) => {
	const buffer = await randomBytesAsync(byteLength);
	return buffer.toString(type).slice(0, length);
}, randomBytesAsync);

export default cryptoRandomString;
