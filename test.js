import test from 'ava';
import m from './';

test('sync', t => {
	t.is(m.sync(0).length, 0);
	t.is(m.sync(10).length, 10);
	t.is(m.sync(100).length, 100);
});

test('async', async t => {
	const m0 = await m.async(0);
	t.is(m0.length, 0);
	const m10 = await m.async(10);
	t.is(m10.length, 10);
	const m100 = await m.async(100);
	t.is(m100.length, 100);
});
