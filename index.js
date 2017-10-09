'use strict';
const crypto = require('crypto');
const util = require('util');


const randomBytesAsync = util.promisify(crypto.randomBytes)

const getBytes = randomBytesFn => len => {
	if (!Number.isFinite(len)) {
		throw new TypeError('Expected a finite number');
	}
	
	return randomBytesFn(Math.ceil(len / 2))
}

const normalize = bytes => bytes.toString('hex').slice(0, len))

module.exports.sync = len => normalize(getBytes(crypto.randomBytes));

module.exports.async = len => getBytes(randomBytesAsync).then(normalize);
