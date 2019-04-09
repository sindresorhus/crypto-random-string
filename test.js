import test from 'ava';
import cryptoRandomString from '.';

test('main', t => {
	t.is(cryptoRandomString(0).length, 0);
	t.is(cryptoRandomString(10).length, 10);
	t.is(cryptoRandomString(100).length, 100);
});
