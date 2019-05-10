import test from 'ava';
import cryptoRandomString from '.';

test('main', t => {
	t.is(cryptoRandomString({length: 0}).length, 0);
	t.is(cryptoRandomString({length: 10}).length, 10);
	t.is(cryptoRandomString({length: 100}).length, 100);
	t.regex(cryptoRandomString({length: 100}), /^[a-f\d]*$/); // Sanity check, probabilistic
});

test('hex', t => {
	t.is(cryptoRandomString({length: 0, type: 'hex'}).length, 0);
	t.is(cryptoRandomString({length: 10, type: 'hex'}).length, 10);
	t.is(cryptoRandomString({length: 100, type: 'hex'}).length, 100);
	t.regex(cryptoRandomString({length: 100, type: 'hex'}), /^[a-f\d]*$/); // Sanity check, probabilistic
});

test('base64', t => {
	t.is(cryptoRandomString({length: 0, type: 'base64'}).length, 0);
	t.is(cryptoRandomString({length: 10, type: 'base64'}).length, 10);
	t.is(cryptoRandomString({length: 100, type: 'base64'}).length, 100);
	t.regex(cryptoRandomString({length: 100, type: 'base64'}), /^[a-zA-Z\d/+]*$/); // Sanity check, probabilistic
});

test('url-safe', t => {
	t.is(cryptoRandomString({length: 0, type: 'url-safe'}).length, 0);
	t.is(cryptoRandomString({length: 10, type: 'url-safe'}).length, 10);
	t.is(cryptoRandomString({length: 100, type: 'url-safe'}).length, 100);
	t.regex(cryptoRandomString({length: 100, type: 'url-safe'}), /^[a-zA-Z\d._~-]*$/); // Sanity check, probabilistic
});

test('printable', t => {
	t.is(cryptoRandomString({length: 0, type: 'printable'}).length, 0);
	t.is(cryptoRandomString({length: 10, type: 'printable'}).length, 10);
	t.is(cryptoRandomString({length: 100, type: 'printable'}).length, 100);
	t.regex(cryptoRandomString({length: 100, type: 'printable'}), /^[ !"#$%&'()*+,-./\d:;<=>?@A-Z[\\\]\^_`a-z{\|}~]*$/); // Sanity check, probabilistic
});

test('characters', t => {
	t.is(cryptoRandomString({length: 0, characters: '1234'}).length, 0);
	t.is(cryptoRandomString({length: 10, characters: '1234'}).length, 10);
	t.is(cryptoRandomString({length: 100, characters: '1234'}).length, 100);
	t.regex(cryptoRandomString({length: 100, characters: '1234'}), /^[1-4]*$/); // Sanity check, probabilistic
});

test('argument errors', t => {
	t.throws(() => {
		cryptoRandomString({length: Infinity});
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
