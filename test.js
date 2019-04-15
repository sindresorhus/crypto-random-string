import test from 'ava';
import cryptoRandomString from '.';

test('main', t => {
	t.is(cryptoRandomString(0).length, 0);
	t.is(cryptoRandomString(10).length, 10);
	t.is(cryptoRandomString(100).length, 100);
	t.regex(cryptoRandomString(100), /^[0-9a-f]*$/); // Sanity check, probabilistic
});

test('hex', t => {
	t.is(cryptoRandomString(0, {type: 'hex'}).length, 0);
	t.is(cryptoRandomString(10, {type: 'hex'}).length, 10);
	t.is(cryptoRandomString(100, {type: 'hex'}).length, 100);
	t.regex(cryptoRandomString(100, {type: 'hex'}), /^[0-9a-f]*$/); // Sanity check, probabilistic
});

test('base64', t => {
	t.is(cryptoRandomString(0, {type: 'base64'}).length, 0);
	t.is(cryptoRandomString(10, {type: 'base64'}).length, 10);
	t.is(cryptoRandomString(100, {type: 'base64'}).length, 100);
	t.regex(cryptoRandomString(100, {type: 'base64'}), /^[a-zA-Z0-9/+]*$/); // Sanity check, probabilistic
});

test('url-safe', t => {
	t.is(cryptoRandomString(0, {type: 'url-safe'}).length, 0);
	t.is(cryptoRandomString(10, {type: 'url-safe'}).length, 10);
	t.is(cryptoRandomString(100, {type: 'url-safe'}).length, 100);
	t.regex(cryptoRandomString(100, {type: 'url-safe'}), /^[a-zA-Z0-9._~-]*$/); // Sanity check, probabilistic
});

test('characters', t => {
	t.is(cryptoRandomString(0, {characters: '1234'}).length, 0);
	t.is(cryptoRandomString(10, {characters: '1234'}).length, 10);
	t.is(cryptoRandomString(100, {characters: '1234'}).length, 100);
	t.regex(cryptoRandomString(100, {characters: '1234'}), /^[1-4]*$/); // Sanity check, probabilistic
});

test('argument errors', t => {
	t.throws(() => cryptoRandomString(Infinity));
	t.throws(() => cryptoRandomString(0, {type: 'hex', characters: '1234'}));
	t.throws(() => cryptoRandomString(0, {characters: 42}));
	t.throws(() => cryptoRandomString(0, {type: 'unknown'}));
});
