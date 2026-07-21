import {uint8ArrayToBase64, uint8ArrayToHex} from 'uint8array-extras';

// `crypto.getRandomValues` throws an error if too much entropy is requested at once. (https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues#exceptions)
const maxBytesPerRequest = 65_536;

// Each character is picked with a single `Uint16` selector value, so a character set cannot be larger than the range of one.
const maxCharacterSetSize = 0x1_00_00;

function fillWithRandomValues(typedArray) {
	const maxElementsPerRequest = maxBytesPerRequest / typedArray.BYTES_PER_ELEMENT;

	for (let offset = 0; offset < typedArray.length; offset += maxElementsPerRequest) {
		// `TypedArray#subarray` clamps the end index and shares the underlying buffer, so this fills the array in place without any copying.
		crypto.getRandomValues(typedArray.subarray(offset, offset + maxElementsPerRequest));
	}

	return typedArray;
}

const randomBytes = byteLength => fillWithRandomValues(new Uint8Array(byteLength));

const generateForCustomCharacters = (length, characters) => {
	// Generating entropy is faster than complex math operations, so we use the simplest way
	const characterCount = characters.length;
	const validSelectorCount = Math.floor(maxCharacterSetSize / characterCount) * characterCount; // Using values at or above this will ruin distribution when using modular division
	// Generating a bit more than required, adjusted for how many values we expect to discard, so we usually only need one pass
	const entropyLength = Math.ceil(1.1 * length * (maxCharacterSetSize / validSelectorCount));
	let string = '';
	let stringLength = 0;

	while (stringLength < length) {
		const entropy = fillWithRandomValues(new Uint16Array(entropyLength));

		for (let index = 0; index < entropyLength; index++) {
			const entropyValue = entropy[index];

			if (entropyValue < validSelectorCount) { // Skip values which will ruin distribution when using modular division
				string += characters[entropyValue % characterCount];
				stringLength++;

				if (stringLength === length) {
					return string;
				}
			}
		}
	}

	return string;
};

const characterSets = new Map([
	['url-safe', [...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~']],
	['numeric', [...'0123456789']],
	['distinguishable', [...'CDEHKMPRTUWXY012458']],
	['ascii-printable', [...'!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~']],
	['alphanumeric', [...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789']],
]);

const allowedTypes = new Set(['hex', 'base64', ...characterSets.keys()]);

export default function cryptoRandomString({length, type, characters}) {
	if (!Number.isSafeInteger(length) || length < 0) {
		throw new TypeError('Expected `length` to be a non-negative integer');
	}

	if (type !== undefined && characters !== undefined) {
		throw new TypeError('Expected either `type` or `characters`');
	}

	if (characters !== undefined) {
		if (typeof characters !== 'string') {
			throw new TypeError('Expected `characters` to be a string');
		}

		// Spread to keep characters outside the Basic Multilingual Plane, like emoji, intact.
		const customCharacterSet = [...characters];

		if (customCharacterSet.length === 0) {
			throw new TypeError('Expected `characters` to contain at least 1 character');
		}

		if (customCharacterSet.length > maxCharacterSetSize) {
			throw new TypeError(`Expected \`characters\` to contain at most ${maxCharacterSetSize} characters, got ${customCharacterSet.length}`);
		}

		return generateForCustomCharacters(length, customCharacterSet);
	}

	if (type !== undefined && !allowedTypes.has(type)) {
		throw new TypeError(`Unknown type: ${type}`);
	}

	const characterSet = characterSets.get(type);

	if (characterSet !== undefined) {
		return generateForCustomCharacters(length, characterSet);
	}

	if (type === 'base64') {
		return uint8ArrayToBase64(randomBytes(Math.ceil(length * 0.75))).slice(0, length); // Needs 0.75 bytes of entropy per character
	}

	return uint8ArrayToHex(randomBytes(Math.ceil(length * 0.5))).slice(0, length); // Needs 0.5 bytes of entropy per character
}
