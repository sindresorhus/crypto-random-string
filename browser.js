/* eslint-env browser */
import {createStringGenerator, createAsyncStringGenerator} from './core.js';

const toHex = uInt8Array => uInt8Array.map(byte => byte.toString(16).padStart(2, '0')).join('');

const decoder = new TextDecoder('utf8');
const toBase64 = uInt8Array => btoa(decoder.decode(uInt8Array));

// `crypto.getRandomValues` throws an error if too much entropy is requested at once. (https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues#exceptions)
const maxEntropy = 65_536;

function getRandomValues(byteLength) {
	const generatedBytes = [];

	while (byteLength > 0) {
		const bytesToGenerate = Math.min(byteLength, maxEntropy);
		generatedBytes.push(crypto.getRandomValues(new Uint8Array({length: bytesToGenerate})));
		byteLength -= bytesToGenerate;
	}

	const result = new Uint8Array(generatedBytes.reduce((sum, {byteLength}) => sum + byteLength, 0));
	let currentIndex = 0;

	for (const bytes of generatedBytes) {
		result.set(bytes, currentIndex);
		currentIndex += bytes.byteLength;
	}

	return result;
}

function specialRandomBytes(byteLength, type, length) {
	const generatedBytes = getRandomValues(byteLength);
	const convert = type === 'hex' ? toHex : toBase64;

	return convert(generatedBytes).slice(0, length);
}

export default createStringGenerator(specialRandomBytes, getRandomValues);
export const cryptoRandomStringAsync = createAsyncStringGenerator(specialRandomBytes, getRandomValues);
