import {test} from 'uvu';
import {is, match, throws} from 'uvu/assert'; // eslint-disable-line node/file-extension-in-import
import cryptoRandomString, {cryptoRandomStringAsync} from './index.js';

// Probabilistic, result is always less than or equal to actual set size, chance it is less is below 1e-256 for sizes up to 32656.
const generatedCharacterSetSize = (options, targetSize) => {
	const set = new Set();
	const length = targetSize * 640;
	const string = cryptoRandomString({...options, length});

	for (let i = 0; i < length; i++) {
		set.add(string[i]);
	}

	return set.size;
};

test('main', () => {
	is(cryptoRandomString({length: 0}).length, 0);
	is(cryptoRandomString({length: 10}).length, 10);
	is(cryptoRandomString({length: 100}).length, 100);
	match(cryptoRandomString({length: 100}), /^[a-f\d]*$/); // Sanity check, probabilistic
	is(generatedCharacterSetSize({}, 16), 16);
});

test('async', async () => {
	/* eslint-disable unicorn/no-await-expression-member */
	is((await cryptoRandomStringAsync({length: 0})).length, 0);
	is((await cryptoRandomStringAsync({length: 10})).length, 10);
	is((await cryptoRandomStringAsync({length: 100})).length, 100);
	/* eslint-enable unicorn/no-await-expression-member */
	match(await cryptoRandomStringAsync({length: 100}), /^[a-f\d]*$/); // Sanity check, probabilistic
});

test('hex', () => {
	is(cryptoRandomString({length: 0, type: 'hex'}).length, 0);
	is(cryptoRandomString({length: 10, type: 'hex'}).length, 10);
	is(cryptoRandomString({length: 100, type: 'hex'}).length, 100);
	match(cryptoRandomString({length: 100, type: 'hex'}), /^[a-f\d]*$/); // Sanity check, probabilistic
	is(generatedCharacterSetSize({type: 'hex'}, 16), 16);
});

test('base64', () => {
	is(cryptoRandomString({length: 0, type: 'base64'}).length, 0);
	is(cryptoRandomString({length: 10, type: 'base64'}).length, 10);
	is(cryptoRandomString({length: 100, type: 'base64'}).length, 100);
	match(cryptoRandomString({length: 100, type: 'base64'}), /^[a-zA-Z\d/+]*$/); // Sanity check, probabilistic
	is(generatedCharacterSetSize({type: 'base64'}, 64), 64);
});

test('url-safe', () => {
	is(cryptoRandomString({length: 0, type: 'url-safe'}).length, 0);
	is(cryptoRandomString({length: 10, type: 'url-safe'}).length, 10);
	is(cryptoRandomString({length: 100, type: 'url-safe'}).length, 100);
	match(cryptoRandomString({length: 100, type: 'url-safe'}), /^[\w.~-]*$/); // Sanity check, probabilistic
	is(generatedCharacterSetSize({type: 'url-safe'}, 66), 66);
});

test('numeric', () => {
	is(cryptoRandomString({length: 0, type: 'numeric'}).length, 0);
	is(cryptoRandomString({length: 10, type: 'numeric'}).length, 10);
	is(cryptoRandomString({length: 100, type: 'numeric'}).length, 100);
	match(cryptoRandomString({length: 100, type: 'numeric'}), /^\d*$/); // Sanity check, probabilistic
	is(generatedCharacterSetSize({type: 'numeric'}, 10), 10);
});

test('distinguishable', () => {
	is(cryptoRandomString({length: 0, type: 'distinguishable'}).length, 0);
	is(cryptoRandomString({length: 10, type: 'distinguishable'}).length, 10);
	is(cryptoRandomString({length: 100, type: 'distinguishable'}).length, 100);
	match(cryptoRandomString({length: 100, type: 'distinguishable'}), /^[CDEHKMPRTUWXY012458]*$/); // Sanity check, probabilistic
	is(generatedCharacterSetSize({type: 'distinguishable'}, 19), 19);
});

test('ascii-printable', () => {
	is(cryptoRandomString({length: 0, type: 'ascii-printable'}).length, 0);
	is(cryptoRandomString({length: 10, type: 'ascii-printable'}).length, 10);
	is(cryptoRandomString({length: 100, type: 'ascii-printable'}).length, 100);
	match(cryptoRandomString({length: 100, type: 'ascii-printable'}), /^[!"#$%&'()*+,-./\w:;<=>?@[\\\]^`{|}~]*$/); // Sanity check, probabilistic
});

test('alphanumeric', () => {
	is(cryptoRandomString({length: 0, type: 'alphanumeric'}).length, 0);
	is(cryptoRandomString({length: 10, type: 'alphanumeric'}).length, 10);
	is(cryptoRandomString({length: 100, type: 'alphanumeric'}).length, 100);
	match(cryptoRandomString({length: 100, type: 'alphanumeric'}), /^[ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789]*$/); // Sanity check, probabilistic
	is(generatedCharacterSetSize({type: 'alphanumeric'}, 19), 62);
});

test('characters', () => {
	is(cryptoRandomString({length: 0, characters: '1234'}).length, 0);
	is(cryptoRandomString({length: 10, characters: '1234'}).length, 10);
	is(cryptoRandomString({length: 100, characters: '1234'}).length, 100);
	match(cryptoRandomString({length: 100, characters: '1234'}), /^[1-4]*$/); // Sanity check, probabilistic
	is(generatedCharacterSetSize({characters: '1234'}, 4), 4);
	is(generatedCharacterSetSize({characters: '0123456789'}, 10), 10);
});

test('argument errors', () => {
	throws(() => {
		cryptoRandomString({length: Number.POSITIVE_INFINITY});
	});

	throws(() => {
		cryptoRandomString({length: -1});
	});

	throws(() => {
		cryptoRandomString({length: 0, type: 'hex', characters: '1234'});
	});

	throws(() => {
		cryptoRandomString({length: 0, characters: 42});
	});

	throws(() => {
		cryptoRandomString({length: 0, type: 'unknown'});
	});
});

test.run();
