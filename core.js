const urlSafeCharacters = [...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~'];
const numericCharacters = [...'0123456789'];
const distinguishableCharacters = [...'CDEHKMPRTUWXY012458'];
const asciiPrintableCharacters = [...'!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'];
const alphanumericCharacters = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'];

const readUInt16LE = (uInt8Array, offset) => uInt8Array[offset] + (uInt8Array[offset + 1] << 8); // eslint-disable-line no-bitwise

const generateForCustomCharacters = (length, characters, randomBytes) => {
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

const generateForCustomCharactersAsync = async (length, characters, randomBytesAsync) => {
	// Generating entropy is faster than complex math operations, so we use the simplest way
	const characterCount = characters.length;
	const maxValidSelector = (Math.floor(0x1_00_00 / characterCount) * characterCount) - 1; // Using values above this will ruin distribution when using modular division
	const entropyLength = 2 * Math.ceil(1.1 * length); // Generating a bit more than required so chances we need more than one pass will be really low
	let string = '';
	let stringLength = 0;

	while (stringLength < length) { // In case we had many bad values, which may happen for character sets of size above 0x8000 but close to it
		const entropy = await randomBytesAsync(entropyLength); // eslint-disable-line no-await-in-loop
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

const createGenerator = (generateForCustomCharacters, specialRandomBytes, randomBytes) => ({length, type, characters}) => {
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
		return generateForCustomCharacters(length, urlSafeCharacters, randomBytes);
	}

	if (type === 'numeric') {
		return generateForCustomCharacters(length, numericCharacters, randomBytes);
	}

	if (type === 'distinguishable') {
		return generateForCustomCharacters(length, distinguishableCharacters, randomBytes);
	}

	if (type === 'ascii-printable') {
		return generateForCustomCharacters(length, asciiPrintableCharacters, randomBytes);
	}

	if (type === 'alphanumeric') {
		return generateForCustomCharacters(length, alphanumericCharacters, randomBytes);
	}

	if (characters.length === 0) {
		throw new TypeError('Expected `characters` string length to be greater than or equal to 1');
	}

	if (characters.length > 0x1_00_00) {
		throw new TypeError('Expected `characters` string length to be less or equal to 65536');
	}

	return generateForCustomCharacters(length, characters, randomBytes);
};

export function createStringGenerator(specialRandomBytes, randomBytes) {
	return createGenerator(generateForCustomCharacters, specialRandomBytes, randomBytes);
}

export function createAsyncStringGenerator(specialRandomBytesAsync, randomBytesAsync) {
	return createGenerator(generateForCustomCharactersAsync, specialRandomBytesAsync, randomBytesAsync);
}
