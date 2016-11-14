import test from 'ava';
import m from './';

test(t => {
	t.is(m(0).length, 0);
	t.is(m(10).length, 10);
	t.is(m(100).length, 100);
});
