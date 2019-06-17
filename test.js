import test from 'ava';
import cryptoRandomString from '.';

// Probailistic, result is always less than or equal to actual set size, chance it is less is below 1e-256 for sizes up to 32656
const generatedCharacterSetSize = (opts, targetSize) => {
	const set = new Set();
	const length = targetSize * 640;
	const string = cryptoRandomString({...opts, length});

	for (let i = 0; i < length; i++) {
		set.add(string[i]);
	}

	return set.size;
};

test('main', t => {
	t.is(cryptoRandomString({length: 0}).length, 0);
	t.is(cryptoRandomString({length: 10}).length, 10);
	t.is(cryptoRandomString({length: 100}).length, 100);
	t.regex(cryptoRandomString({length: 100}), /^[a-f\d]*$/); // Sanity check, probabilistic
	t.is(generatedCharacterSetSize({}, 16), 16);
});

test('hex', t => {
	t.is(cryptoRandomString({length: 0, type: 'hex'}).length, 0);
	t.is(cryptoRandomString({length: 10, type: 'hex'}).length, 10);
	t.is(cryptoRandomString({length: 100, type: 'hex'}).length, 100);
	t.regex(cryptoRandomString({length: 100, type: 'hex'}), /^[a-f\d]*$/); // Sanity check, probabilistic
	t.is(generatedCharacterSetSize({type: 'hex'}, 16), 16);
});

test('base64', t => {
	t.is(cryptoRandomString({length: 0, type: 'base64'}).length, 0);
	t.is(cryptoRandomString({length: 10, type: 'base64'}).length, 10);
	t.is(cryptoRandomString({length: 100, type: 'base64'}).length, 100);
	t.regex(cryptoRandomString({length: 100, type: 'base64'}), /^[a-zA-Z\d/+]*$/); // Sanity check, probabilistic
	t.is(generatedCharacterSetSize({type: 'base64'}, 64), 64);
});

test('url-safe', t => {
	t.is(cryptoRandomString({length: 0, type: 'url-safe'}).length, 0);
	t.is(cryptoRandomString({length: 10, type: 'url-safe'}).length, 10);
	t.is(cryptoRandomString({length: 100, type: 'url-safe'}).length, 100);
	t.regex(cryptoRandomString({length: 100, type: 'url-safe'}), /^[a-zA-Z\d._~-]*$/); // Sanity check, probabilistic
	t.is(generatedCharacterSetSize({type: 'url-safe'}, 66), 66);
});

test('characters', t => {
	t.is(cryptoRandomString({length: 0, characters: '1234'}).length, 0);
	t.is(cryptoRandomString({length: 10, characters: '1234'}).length, 10);
	t.is(cryptoRandomString({length: 100, characters: '1234'}).length, 100);
	t.regex(cryptoRandomString({length: 100, characters: '1234'}), /^[1-4]*$/); // Sanity check, probabilistic
	t.is(generatedCharacterSetSize({characters: '1234'}, 4), 4);
	t.is(generatedCharacterSetSize({characters: '0123456789'}, 10), 10);
});

test('argument errors', t => {
	t.throws(() => {
		cryptoRandomString({length: Infinity});
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
});
