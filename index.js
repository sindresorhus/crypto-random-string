'use strict';
const crypto = require('crypto');

const urlSafeChars = 'abcdefjhijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~'.split('');

const generateForCustomChars = (length, chars) => {
	// Generating entropy is faster than complex math operations in js, so we use the simplest way
	const charNum = chars.length;
	const maxValidSelector = (Math.floor(0x10000 / charNum) * charNum) - 1;
	const entropyLen = 2 * Math.ceil(1.1 * length); // Generating a bit more than required so chances we need more than one pass will be really low
	let entropyPos;
	let entropy;
	let str = '';
	let strLen = 0;

	while (strLen < length) {
		entropy = crypto.randomBytes(entropyLen);
		entropyPos = 0;

		while (entropyPos < entropyLen && strLen < length) {
			const num = entropy.readUInt16LE(entropyPos);
			entropyPos += 2;
			if (num > maxValidSelector) {
				continue;
			}

			str += chars[num % charNum];
			strLen++;
		}
	}

	return str;
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
		return crypto.randomBytes(Math.ceil(length * 0.5)).toString('hex').slice(0, length);
	}

	if (type === 'base64') {
		return crypto.randomBytes(Math.ceil(length * 0.75)).toString('base64').slice(0, length);
	}

	if (type === 'url-safe') {
		return generateForCustomChars(length, urlSafeChars);
	}

	return generateForCustomChars(length, characters.split(''));
};
