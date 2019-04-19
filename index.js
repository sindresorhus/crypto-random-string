'use strict';
const crypto = require('crypto');

const urlSafeChars = 'abcdefjhijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~'.split('');

const generateForCustomChars = (length, chars) => {
	// Generating entropy is faster than complex math operations, so we use the simplest way
	const charNum = chars.length;
	const maxValidSelector = (Math.floor(0x10000 / charNum) * charNum) - 1; // Using values above this will ruin distribution when using modular division
	const entropyLength = 2 * Math.ceil(1.1 * length); // Generating a bit more than required so chances we need more than one pass will be really low
	let string = '';
	let stringLength = 0;

	while (stringLength < length) { // In case we had many bad values, which may happen for character sets of size above 0x8000 but close to it
		const entropy = crypto.randomBytes(entropyLength);
		let entropyPosition = 0;

		while (entropyPosition < entropyLength && stringLength < length) {
			const entropyValue = entropy.readUInt16LE(entropyPosition);
			entropyPosition += 2;
			if (entropyValue > maxValidSelector) { // Skip values which will ruin distribution when using modular division
				continue;
			}

			string += chars[entropyValue % charNum];
			stringLength++;
		}
	}

	return string;
};

const allowedTypes = [undefined, 'hex', 'base64', 'url-safe'];

module.exports = (length, opts) => {
	if (!Number.isFinite(length)) {
		throw new TypeError('Expected a finite number');
	}

	let type = opts === undefined ? undefined : opts.type;
	const characters = opts === undefined ? undefined : opts.characters;

	if (type !== undefined && characters !== undefined) {
		throw new TypeError('Expected either type or characters');
	}

	if (characters !== undefined && typeof characters !== 'string') {
		throw new TypeError('Expected characters to be string');
	}

	if (!allowedTypes.includes(type)) {
		throw new TypeError(`Unknown type: ${type}`);
	}

	if (type === undefined && characters === undefined) {
		type = 'hex';
	}

	if (type === 'hex') {
		return crypto.randomBytes(Math.ceil(length * 0.5)).toString('hex').slice(0, length); // Need 0.5 byte entropy per character
	}

	if (type === 'base64') {
		return crypto.randomBytes(Math.ceil(length * 0.75)).toString('base64').slice(0, length); // Need 0.75 byte of entropy per character
	}

	if (type === 'url-safe') {
		return generateForCustomChars(length, urlSafeChars);
	}

	if (characters.length > 0x10000) {
		throw new TypeError('Expected `characters` string length to be less or equal to 65536');
	}

	return generateForCustomChars(length, characters.split(''));
};
