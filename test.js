import {webcrypto} from 'node:crypto';
import {hasProperty, setProperty} from 'dot-prop';
import {suite} from 'uvu';
import {is, match, throws} from 'uvu/assert'; // eslint-disable-line node/file-extension-in-import
import browserCryptoRandomString, {cryptoRandomStringAsync as browserCryptoRandomStringAsync} from './browser.js';
import nodeCryptoRandomString, {cryptoRandomStringAsync as nodeCryptoRandomStringAsync} from './index.js';

if (!hasProperty(globalThis, 'crypto.getRandomValues')) {
	setProperty(globalThis, 'crypto.getRandomValues', webcrypto.getRandomValues);
}

function runTests(test) {
	// Probabilistic, result is always less than or equal to actual set size, chance it is less is below 1e-256 for sizes up to 32656.
	const generatedCharacterSetSize = (cryptoRandomString, options, targetSize) => {
		const set = new Set();
		const length = targetSize * 640;
		const string = cryptoRandomString({...options, length});

		for (let i = 0; i < length; i++) {
			set.add(string[i]);
		}

		return set.size;
	};

	test('main', ({cryptoRandomString}) => {
		is(cryptoRandomString({length: 0}).length, 0);
		is(cryptoRandomString({length: 10}).length, 10);
		is(cryptoRandomString({length: 100}).length, 100);
		match(cryptoRandomString({length: 100}), /^[a-f\d]*$/); // Sanity check, probabilistic
		is(generatedCharacterSetSize(cryptoRandomString, {}, 16), 16);
	});

	test('async', async ({cryptoRandomStringAsync}) => {
		/* eslint-disable unicorn/no-await-expression-member */
		is((await cryptoRandomStringAsync({length: 0})).length, 0);
		is((await cryptoRandomStringAsync({length: 10})).length, 10);
		is((await cryptoRandomStringAsync({length: 100})).length, 100);
		/* eslint-enable unicorn/no-await-expression-member */
		match(await cryptoRandomStringAsync({length: 100}), /^[a-f\d]*$/); // Sanity check, probabilistic
	});

	test('hex', ({cryptoRandomString}) => {
		is(cryptoRandomString({length: 0, type: 'hex'}).length, 0);
		is(cryptoRandomString({length: 10, type: 'hex'}).length, 10);
		is(cryptoRandomString({length: 100, type: 'hex'}).length, 100);
		match(cryptoRandomString({length: 100, type: 'hex'}), /^[a-f\d]*$/); // Sanity check, probabilistic
		is(generatedCharacterSetSize(cryptoRandomString, {type: 'hex'}, 16), 16);
	});

	test('base64', ({cryptoRandomString}) => {
		is(cryptoRandomString({length: 0, type: 'base64'}).length, 0);
		is(cryptoRandomString({length: 10, type: 'base64'}).length, 10);
		is(cryptoRandomString({length: 100, type: 'base64'}).length, 100);
		match(cryptoRandomString({length: 100, type: 'base64'}), /^[a-zA-Z\d/+]*$/); // Sanity check, probabilistic
		is(generatedCharacterSetSize(cryptoRandomString, {type: 'base64'}, 64), 64);
	});

	test('url-safe', ({cryptoRandomString}) => {
		is(cryptoRandomString({length: 0, type: 'url-safe'}).length, 0);
		is(cryptoRandomString({length: 10, type: 'url-safe'}).length, 10);
		is(cryptoRandomString({length: 100, type: 'url-safe'}).length, 100);
		match(cryptoRandomString({length: 100, type: 'url-safe'}), /^[\w.~-]*$/); // Sanity check, probabilistic
		is(generatedCharacterSetSize(cryptoRandomString, {type: 'url-safe'}, 66), 66);
	});

	test('numeric', ({cryptoRandomString}) => {
		is(cryptoRandomString({length: 0, type: 'numeric'}).length, 0);
		is(cryptoRandomString({length: 10, type: 'numeric'}).length, 10);
		is(cryptoRandomString({length: 100, type: 'numeric'}).length, 100);
		match(cryptoRandomString({length: 100, type: 'numeric'}), /^\d*$/); // Sanity check, probabilistic
		is(generatedCharacterSetSize(cryptoRandomString, {type: 'numeric'}, 10), 10);
	});

	test('distinguishable', ({cryptoRandomString}) => {
		is(cryptoRandomString({length: 0, type: 'distinguishable'}).length, 0);
		is(cryptoRandomString({length: 10, type: 'distinguishable'}).length, 10);
		is(cryptoRandomString({length: 100, type: 'distinguishable'}).length, 100);
		match(cryptoRandomString({length: 100, type: 'distinguishable'}), /^[CDEHKMPRTUWXY012458]*$/); // Sanity check, probabilistic
		is(generatedCharacterSetSize(cryptoRandomString, {type: 'distinguishable'}, 19), 19);
	});

	test('ascii-printable', ({cryptoRandomString}) => {
		is(cryptoRandomString({length: 0, type: 'ascii-printable'}).length, 0);
		is(cryptoRandomString({length: 10, type: 'ascii-printable'}).length, 10);
		is(cryptoRandomString({length: 100, type: 'ascii-printable'}).length, 100);
		match(cryptoRandomString({length: 100, type: 'ascii-printable'}), /^[!"#$%&'()*+,-./\w:;<=>?@[\\\]^`{|}~]*$/); // Sanity check, probabilistic
	});

	test('alphanumeric', ({cryptoRandomString}) => {
		is(cryptoRandomString({length: 0, type: 'alphanumeric'}).length, 0);
		is(cryptoRandomString({length: 10, type: 'alphanumeric'}).length, 10);
		is(cryptoRandomString({length: 100, type: 'alphanumeric'}).length, 100);
		match(cryptoRandomString({length: 100, type: 'alphanumeric'}), /^[ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789]*$/); // Sanity check, probabilistic
		is(generatedCharacterSetSize(cryptoRandomString, {type: 'alphanumeric'}, 19), 62);
	});

	test('characters', ({cryptoRandomString}) => {
		is(cryptoRandomString({length: 0, characters: '1234'}).length, 0);
		is(cryptoRandomString({length: 10, characters: '1234'}).length, 10);
		is(cryptoRandomString({length: 100, characters: '1234'}).length, 100);
		match(cryptoRandomString({length: 100, characters: '1234'}), /^[1-4]*$/); // Sanity check, probabilistic
		is(generatedCharacterSetSize(cryptoRandomString, {characters: '1234'}, 4), 4);
		is(generatedCharacterSetSize(cryptoRandomString, {characters: '0123456789'}, 10), 10);
	});

	test('argument errors', ({cryptoRandomString}) => {
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
}

runTests(suite('Node.js', {
	cryptoRandomString: nodeCryptoRandomString,
	cryptoRandomStringAsync: nodeCryptoRandomStringAsync,
}));
runTests(suite('Browser', {
	cryptoRandomString: browserCryptoRandomString,
	cryptoRandomStringAsync: browserCryptoRandomStringAsync,
}));
