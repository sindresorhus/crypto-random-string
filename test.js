import {webcrypto} from 'node:crypto';
import {hasProperty, setProperty} from 'dot-prop';
import test from 'ava';
import browserCryptoRandomString, {cryptoRandomStringAsync as browserCryptoRandomStringAsync} from './browser.js';
import nodeCryptoRandomString, {cryptoRandomStringAsync as nodeCryptoRandomStringAsync} from './index.js';

if (!hasProperty(globalThis, 'crypto')) {
	setProperty(globalThis, 'crypto', webcrypto);
}

// Probabilistic, result is always less than or equal to actual set size, chance it is less is below 1e-256 for sizes up to 32656.
const generatedCharacterSetSize = (cryptoRandomString, options, targetSize) => {
	const set = new Set();
	const length = targetSize * 640;
	const string = cryptoRandomString({...options, length});

	for (let index = 0; index < length; index++) {
		set.add(string[index]);
	}

	return set.size;
};

function runTest(title, macro) {
	test(`Node.js: ${title}`, macro, {
		cryptoRandomString: nodeCryptoRandomString,
		cryptoRandomStringAsync: nodeCryptoRandomStringAsync,
	});
	test(`Browser: ${title}`, macro, {
		cryptoRandomString: browserCryptoRandomString,
		cryptoRandomStringAsync: browserCryptoRandomStringAsync,
	});
}

runTest('main', test.macro((t, {cryptoRandomString}) => {
	t.is(cryptoRandomString({length: 0}).length, 0);
	t.is(cryptoRandomString({length: 10}).length, 10);
	t.is(cryptoRandomString({length: 100}).length, 100);
	t.regex(cryptoRandomString({length: 100}), /^[a-f\d]*$/); // Sanity check, probabilistic
	t.is(generatedCharacterSetSize(cryptoRandomString, {}, 16), 16);
}));

runTest('async', test.macro(async (t, {cryptoRandomStringAsync}) => {
	/* eslint-disable unicorn/no-await-expression-member */
	t.is((await cryptoRandomStringAsync({length: 0})).length, 0);
	t.is((await cryptoRandomStringAsync({length: 10})).length, 10);
	t.is((await cryptoRandomStringAsync({length: 100})).length, 100);
	/* eslint-enable unicorn/no-await-expression-member */
	t.regex(await cryptoRandomStringAsync({length: 100}), /^[a-f\d]*$/); // Sanity check, probabilistic
}));

runTest('hex', test.macro((t, {cryptoRandomString}) => {
	t.is(cryptoRandomString({length: 0, type: 'hex'}).length, 0);
	t.is(cryptoRandomString({length: 10, type: 'hex'}).length, 10);
	t.is(cryptoRandomString({length: 100, type: 'hex'}).length, 100);
	t.regex(cryptoRandomString({length: 100, type: 'hex'}), /^[a-f\d]*$/); // Sanity check, probabilistic
	t.is(generatedCharacterSetSize(cryptoRandomString, {type: 'hex'}, 16), 16);
}));

runTest('base64', test.macro((t, {cryptoRandomString}) => {
	t.is(cryptoRandomString({length: 0, type: 'base64'}).length, 0);
	t.is(cryptoRandomString({length: 10, type: 'base64'}).length, 10);
	t.is(cryptoRandomString({length: 100, type: 'base64'}).length, 100);
	t.regex(cryptoRandomString({length: 100, type: 'base64'}), /^[a-zA-Z\d/+]*$/); // Sanity check, probabilistic
	t.is(generatedCharacterSetSize(cryptoRandomString, {type: 'base64'}, 64), 64);
}));

runTest('url-safe', test.macro((t, {cryptoRandomString}) => {
	t.is(cryptoRandomString({length: 0, type: 'url-safe'}).length, 0);
	t.is(cryptoRandomString({length: 10, type: 'url-safe'}).length, 10);
	t.is(cryptoRandomString({length: 100, type: 'url-safe'}).length, 100);
	t.regex(cryptoRandomString({length: 100, type: 'url-safe'}), /^[\w.~-]*$/); // Sanity check, probabilistic
	t.is(generatedCharacterSetSize(cryptoRandomString, {type: 'url-safe'}, 66), 66);
}));

runTest('numeric', test.macro((t, {cryptoRandomString}) => {
	t.is(cryptoRandomString({length: 0, type: 'numeric'}).length, 0);
	t.is(cryptoRandomString({length: 10, type: 'numeric'}).length, 10);
	t.is(cryptoRandomString({length: 100, type: 'numeric'}).length, 100);
	t.regex(cryptoRandomString({length: 100, type: 'numeric'}), /^\d*$/); // Sanity check, probabilistic
	t.is(generatedCharacterSetSize(cryptoRandomString, {type: 'numeric'}, 10), 10);
}));

runTest('distinguishable', test.macro((t, {cryptoRandomString}) => {
	t.is(cryptoRandomString({length: 0, type: 'distinguishable'}).length, 0);
	t.is(cryptoRandomString({length: 10, type: 'distinguishable'}).length, 10);
	t.is(cryptoRandomString({length: 100, type: 'distinguishable'}).length, 100);
	t.regex(cryptoRandomString({length: 100, type: 'distinguishable'}), /^[CDEHKMPRTUWXY012458]*$/); // Sanity check, probabilistic
	t.is(generatedCharacterSetSize(cryptoRandomString, {type: 'distinguishable'}, 19), 19);
}));

runTest('ascii-printable', test.macro((t, {cryptoRandomString}) => {
	t.is(cryptoRandomString({length: 0, type: 'ascii-printable'}).length, 0);
	t.is(cryptoRandomString({length: 10, type: 'ascii-printable'}).length, 10);
	t.is(cryptoRandomString({length: 100, type: 'ascii-printable'}).length, 100);
	t.regex(cryptoRandomString({length: 100, type: 'ascii-printable'}), /^[!"#$%&'()*+,-./\w:;<=>?@[\\\]^`{|}~]*$/); // Sanity check, probabilistic
}));

runTest('alphanumeric', test.macro((t, {cryptoRandomString}) => {
	t.is(cryptoRandomString({length: 0, type: 'alphanumeric'}).length, 0);
	t.is(cryptoRandomString({length: 10, type: 'alphanumeric'}).length, 10);
	t.is(cryptoRandomString({length: 100, type: 'alphanumeric'}).length, 100);
	t.regex(cryptoRandomString({length: 100, type: 'alphanumeric'}), /^[ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789]*$/); // Sanity check, probabilistic
	t.is(generatedCharacterSetSize(cryptoRandomString, {type: 'alphanumeric'}, 19), 62);
}));

runTest('characters', test.macro((t, {cryptoRandomString}) => {
	t.is(cryptoRandomString({length: 0, characters: '1234'}).length, 0);
	t.is(cryptoRandomString({length: 10, characters: '1234'}).length, 10);
	t.is(cryptoRandomString({length: 100, characters: '1234'}).length, 100);
	t.regex(cryptoRandomString({length: 100, characters: '1234'}), /^[1-4]*$/); // Sanity check, probabilistic
	t.is(generatedCharacterSetSize(cryptoRandomString, {characters: '1234'}, 4), 4);
	t.is(generatedCharacterSetSize(cryptoRandomString, {characters: '0123456789'}, 10), 10);
}));

runTest('argument errors', test.macro((t, {cryptoRandomString}) => {
	t.throws(() => {
		cryptoRandomString({length: Number.POSITIVE_INFINITY});
	});

	t.throws(() => {
		cryptoRandomString({length: -1});
	});

	t.throws(() => {
		cryptoRandomString({length: 0, type: 'hex', characters: '1234'});
	});

	t.throws(() => {
		cryptoRandomString({length: 0, characters: 42});
	});

	t.throws(() => {
		cryptoRandomString({length: 0, type: 'unknown'});
	});
}));
