import test from 'ava';
import cryptoRandomString from './index.js';

// Probabilistic, result is always less than or equal to actual set size, chance it is less is below 1e-256 for sizes up to 32656.
const generatedCharacterSetSize = (options, targetSize) => new Set(cryptoRandomString({...options, length: targetSize * 640})).size; // Iterating a string yields whole characters, so this is correct for characters outside the Basic Multilingual Plane too

test('main', t => {
	t.is(cryptoRandomString({length: 0}).length, 0);
	t.is(cryptoRandomString({length: 10}).length, 10);
	t.is(cryptoRandomString({length: 100}).length, 100);
	t.regex(cryptoRandomString({length: 100}), /^[\da-f]*$/v); // Sanity check, probabilistic
	t.is(generatedCharacterSetSize({}, 16), 16);
});

test('hex', t => {
	t.is(cryptoRandomString({length: 0, type: 'hex'}).length, 0);
	t.is(cryptoRandomString({length: 10, type: 'hex'}).length, 10);
	t.is(cryptoRandomString({length: 100, type: 'hex'}).length, 100);
	t.regex(cryptoRandomString({length: 100, type: 'hex'}), /^[\da-f]*$/v); // Sanity check, probabilistic
	t.is(generatedCharacterSetSize({type: 'hex'}, 16), 16);
});

test('base64', t => {
	t.is(cryptoRandomString({length: 0, type: 'base64'}).length, 0);
	t.is(cryptoRandomString({length: 10, type: 'base64'}).length, 10);
	t.is(cryptoRandomString({length: 100, type: 'base64'}).length, 100);
	t.regex(cryptoRandomString({length: 100, type: 'base64'}), /^[\d+\/a-z]*$/iv); // Sanity check, probabilistic
	t.is(generatedCharacterSetSize({type: 'base64'}, 64), 64);

	// These are the lengths where the slice ends closest to the padding, so it must never survive
	for (const length of [1, 2, 3, 4]) {
		t.false(cryptoRandomString({length, type: 'base64'}).includes('='), `length: ${length}`);
	}
});

test('url-safe', t => {
	t.is(cryptoRandomString({length: 0, type: 'url-safe'}).length, 0);
	t.is(cryptoRandomString({length: 10, type: 'url-safe'}).length, 10);
	t.is(cryptoRandomString({length: 100, type: 'url-safe'}).length, 100);
	t.regex(cryptoRandomString({length: 100, type: 'url-safe'}), /^[\w\-.~]*$/v); // Sanity check, probabilistic
	t.is(generatedCharacterSetSize({type: 'url-safe'}, 66), 66);
});

test('numeric', t => {
	t.is(cryptoRandomString({length: 0, type: 'numeric'}).length, 0);
	t.is(cryptoRandomString({length: 10, type: 'numeric'}).length, 10);
	t.is(cryptoRandomString({length: 100, type: 'numeric'}).length, 100);
	t.regex(cryptoRandomString({length: 100, type: 'numeric'}), /^\d*$/v); // Sanity check, probabilistic
	t.is(generatedCharacterSetSize({type: 'numeric'}, 10), 10);
});

test('distinguishable', t => {
	t.is(cryptoRandomString({length: 0, type: 'distinguishable'}).length, 0);
	t.is(cryptoRandomString({length: 10, type: 'distinguishable'}).length, 10);
	t.is(cryptoRandomString({length: 100, type: 'distinguishable'}).length, 100);
	t.regex(cryptoRandomString({length: 100, type: 'distinguishable'}), /^[012458CDEHKMPRTUWXY]*$/v); // Sanity check, probabilistic
	t.is(generatedCharacterSetSize({type: 'distinguishable'}, 19), 19);
});

test('ascii-printable', t => {
	t.is(cryptoRandomString({length: 0, type: 'ascii-printable'}).length, 0);
	t.is(cryptoRandomString({length: 10, type: 'ascii-printable'}).length, 10);
	t.is(cryptoRandomString({length: 100, type: 'ascii-printable'}).length, 100);
	t.regex(cryptoRandomString({length: 100, type: 'ascii-printable'}), /^[\w!"#$%&'\(\)*+,\-.\/:;<=>?@\[\\\]^`\{\|\}~]*$/v); // Sanity check, probabilistic
	t.is(generatedCharacterSetSize({type: 'ascii-printable'}, 94), 94); // Printable ASCII without the space character
	t.false(cryptoRandomString({length: 10_000, type: 'ascii-printable'}).includes(' '));
});

test('alphanumeric', t => {
	t.is(cryptoRandomString({length: 0, type: 'alphanumeric'}).length, 0);
	t.is(cryptoRandomString({length: 10, type: 'alphanumeric'}).length, 10);
	t.is(cryptoRandomString({length: 100, type: 'alphanumeric'}).length, 100);
	t.regex(cryptoRandomString({length: 100, type: 'alphanumeric'}), /^[0-9a-z]*$/iv); // Sanity check, probabilistic
	t.is(generatedCharacterSetSize({type: 'alphanumeric'}, 62), 62);
});

test('characters', t => {
	t.is(cryptoRandomString({length: 0, characters: '1234'}).length, 0);
	t.is(cryptoRandomString({length: 10, characters: '1234'}).length, 10);
	t.is(cryptoRandomString({length: 100, characters: '1234'}).length, 100);
	t.regex(cryptoRandomString({length: 100, characters: '1234'}), /^[1-4]*$/v); // Sanity check, probabilistic
	t.is(generatedCharacterSetSize({characters: '1234'}, 4), 4);
	t.is(generatedCharacterSetSize({characters: '0123456789'}, 10), 10);
	t.is(cryptoRandomString({length: 10, characters: 'a'}), 'a'.repeat(10)); // A single character has only one possible output
});

test('characters outside the Basic Multilingual Plane', t => {
	const string = cryptoRandomString({length: 100, characters: '😀🎉'});
	t.is([...string].length, 100);
	t.regex(string, /^[🎉😀]*$/v);
	t.is(generatedCharacterSetSize({characters: '😀🎉'}, 2), 2);
});

test('character set sizes at the selector range boundaries', t => {
	// 32768 and 65536 divide the selector range evenly, so nothing is ever discarded. 32769 discards ~50%, 40000 discards ~39%, and 65535 discards only the single selector value 65535.
	for (const size of [32_768, 32_769, 40_000, 65_535, 0x1_00_00]) {
		const characterSet = Array.from({length: size}, (_, index) => String.fromCodePoint(index + 0x1_00_00));
		// Above 32768, so more than one `crypto.getRandomValues` call worth of `Uint16` selectors is consumed for every size
		const string = [...cryptoRandomString({length: 40_000, characters: characterSet.join('')})];
		t.is(string.length, 40_000, `size: ${size}`);
		t.true(string.every(character => character.codePointAt(0) >= 0x1_00_00), `size: ${size}`);
		// Every character is expected about once, so an entropy chunk that was left unfilled would show up as the first character of the set dominating
		t.true(string.filter(character => character === characterSet[0]).length < 50, `size: ${size}`);
	}
});

test('discarding selector values keeps the distribution uniform', t => {
	// 40000 does not divide the selector range evenly. Without discarding the values at or above it, the first 25536 characters would be picked twice as often as the rest, putting this at 0.61 instead of 0.5.
	const size = 40_000;
	const characters = Array.from({length: size}, (_, index) => String.fromCodePoint(index + 0x1_00_00)).join('');
	const length = 100_000;
	const string = [...cryptoRandomString({length, characters})];
	const firstHalfCount = string.filter(character => (character.codePointAt(0) - 0x1_00_00) < (size / 2)).length;
	t.true(Math.abs((firstHalfCount / length) - 0.5) < 0.01);
});

test('length beyond the `crypto.getRandomValues` limit', t => {
	// The limit is 65536 bytes per call, so this needs multiple calls for every type
	const length = 300_000;

	for (const type of [undefined, 'hex', 'base64', 'url-safe', 'numeric', 'distinguishable', 'ascii-printable', 'alphanumeric']) {
		const string = cryptoRandomString({length, type});
		t.is(string.length, length, `type: ${type}`);

		// An entropy chunk that was left unfilled would show up as a long run of the same character
		t.notRegex(string, /(?<character>.)\k<character>{63}/v, `type: ${type}`);
	}
});

test('successive calls return different strings', t => {
	t.not(cryptoRandomString({length: 32}), cryptoRandomString({length: 32}));
});

test('argument errors', t => {
	t.throws(() => {
		cryptoRandomString({length: Infinity});
	}, {message: /non-negative integer/v});

	t.throws(() => {
		cryptoRandomString({length: NaN});
	}, {message: /non-negative integer/v});

	t.throws(() => {
		cryptoRandomString({length: -1});
	}, {message: /non-negative integer/v});

	t.throws(() => {
		cryptoRandomString({length: 1.5});
	}, {message: /non-negative integer/v});

	t.throws(() => {
		cryptoRandomString({length: '10'});
	}, {message: /non-negative integer/v});

	t.throws(() => {
		cryptoRandomString({});
	}, {message: /non-negative integer/v});

	t.throws(() => {
		cryptoRandomString({length: 0, type: 'hex', characters: '1234'});
	}, {message: /either/v});

	t.throws(() => {
		cryptoRandomString({length: 0, characters: 42});
	}, {message: /to be a string/v});

	t.throws(() => {
		cryptoRandomString({length: 0, characters: ''});
	}, {message: /at least 1 character/v});

	t.throws(() => {
		cryptoRandomString({length: 0, characters: 'a'.repeat(0x1_00_01)});
	}, {message: /at most 65536 characters, got 65537/v});

	t.throws(() => {
		cryptoRandomString({length: 0, type: 'unknown'});
	}, {message: /Unknown type: unknown/v});

	t.throws(() => {
		cryptoRandomString({length: 0, type: 'constructor'});
	}, {message: /Unknown type: constructor/v});
});
