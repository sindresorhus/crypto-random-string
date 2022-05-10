/* eslint-env browser */
import {createStringGenerator, createAsyncStringGenerator} from './core.js';

const toHex = uInt8Array => [...uInt8Array].map(byte => byte.toString(16).padStart(2, '0')).join('');
const toBase64 = uInt8Array => btoa(String.fromCodePoint(...uInt8Array));

// `crypto.getRandomValues` throws an error if too much entropy is requested at once. (https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues#exceptions)
const maxEntropy = 65_536;

function getRandomValues(byteLength) {
	const generatedBytes = new Uint8Array(byteLength);

	for (let totalGeneratedBytes = 0; totalGeneratedBytes < byteLength; totalGeneratedBytes += maxEntropy) {
		generatedBytes.set(
			crypto.getRandomValues(new Uint8Array(Math.min(maxEntropy, byteLength - totalGeneratedBytes))),
			totalGeneratedBytes,
		);
	}

	return generatedBytes;
}

function specialRandomBytes(byteLength, type, length) {
	const generatedBytes = getRandomValues(byteLength);
	const convert = type === 'hex' ? toHex : toBase64;

	return convert(generatedBytes).slice(0, length);
}

export default createStringGenerator(specialRandomBytes, getRandomValues);
export const cryptoRandomStringAsync = createAsyncStringGenerator(specialRandomBytes, getRandomValues);
