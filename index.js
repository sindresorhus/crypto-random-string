const toHex = uInt8Array => [...uInt8Array].map(byte => byte.toString(16).padStart(2, '0')).join('');
const toBase64 = uInt8Array => btoa(String.fromCodePoint(...uInt8Array));

// `crypto.getRandomValues` throws an error if too much entropy is requested at once. (https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues#exceptions)
const maxEntropy = 65_536;

function randomBytes(byteLength) {
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
	const generatedBytes = randomBytes(byteLength);
	const convert = type === 'hex' ? toHex : toBase64;

	return convert(generatedBytes).slice(0, length);
}

const urlSafeCharacters = [...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~'];
const numericCharacters = [...'0123456789'];
const distinguishableCharacters = [...'CDEHKMPRTUWXY012458'];
const asciiPrintableCharacters = [...'!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'];
const alphanumericCharacters = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'];

const readUInt16LE = (uInt8Array, offset) => uInt8Array[offset] + (uInt8Array[offset + 1] << 8); // eslint-disable-line no-bitwise

const generateForCustomCharacters = (length, characters) => {
	// Generating entropy is faster than complex math operations, so we use the simplest way
	const characterCount = characters.length;
	const maxValidSelector = (Math.floor(0x1_00_00 / characterCount) * characterCount) - 1; // Using values above this will ruin distribution when using modular division
	const entropyLength = 2 * Math.ceil(1.1 * length); // Generating a bit more than required so chances we need more than one pass will be really low
	let string = '';
	let stringLength = 0;

	while (stringLength < length) { // In case we had many bad values, which may happen for character sets of size above 0x8000 but close to it
		const entropy = randomBytes(entropyLength);
		let entropyPosition = 0;

		while (entropyPosition < entropyLength && stringLength < length) {
			const entropyValue = readUInt16LE(entropy, entropyPosition);
			entropyPosition += 2;
			if (entropyValue > maxValidSelector) { // Skip values which will ruin distribution when using modular division
				continue;
			}

			string += characters[entropyValue % characterCount];
			stringLength++;
		}
	}

	return string;
};

const allowedTypes = new Set([
	undefined,
	'hex',
	'base64',
	'url-safe',
	'numeric',
	'distinguishable',
	'ascii-printable',
	'alphanumeric',
]);

export default function cryptoRandomString({length, type, characters}) {
	if (!(length >= 0 && Number.isFinite(length))) {
		throw new TypeError('Expected a `length` to be a non-negative finite number');
	}

	if (type !== undefined && characters !== undefined) {
		throw new TypeError('Expected either `type` or `characters`');
	}

	if (characters !== undefined && typeof characters !== 'string') {
		throw new TypeError('Expected `characters` to be string');
	}

	if (!allowedTypes.has(type)) {
		throw new TypeError(`Unknown type: ${type}`);
	}

	if (type === undefined && characters === undefined) {
		type = 'hex';
	}

	if (type === 'hex' || (type === undefined && characters === undefined)) {
		return specialRandomBytes(Math.ceil(length * 0.5), 'hex', length); // Needs 0.5 bytes of entropy per character
	}

	if (type === 'base64') {
		return specialRandomBytes(Math.ceil(length * 0.75), 'base64', length); // Needs 0.75 bytes of entropy per character
	}

	if (type === 'url-safe') {
		return generateForCustomCharacters(length, urlSafeCharacters);
	}

	if (type === 'numeric') {
		return generateForCustomCharacters(length, numericCharacters);
	}

	if (type === 'distinguishable') {
		return generateForCustomCharacters(length, distinguishableCharacters);
	}

	if (type === 'ascii-printable') {
		return generateForCustomCharacters(length, asciiPrintableCharacters);
	}

	if (type === 'alphanumeric') {
		return generateForCustomCharacters(length, alphanumericCharacters);
	}

	if (characters.length === 0) {
		throw new TypeError('Expected `characters` string length to be greater than or equal to 1');
	}

	if (characters.length > 0x1_00_00) {
		throw new TypeError('Expected `characters` string length to be less or equal to 65536');
	}

	return generateForCustomCharacters(length, characters);
}
