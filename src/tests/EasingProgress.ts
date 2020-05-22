import test from 'ava';
import { createEasingProgress } from '@data/createEasingProgress';

test(`Time gets calculated correctly`, t => {
	const e = t => t;
	const ep = createEasingProgress(e, 100);
	ep.time0 = 10000;
	ep.time1 = 10050;
	t.assert(ep.time === 50);
});

test(`Progress gets calculated correctly`, t => {
	const e = t => t;
	const ep = createEasingProgress(e, 200);
	ep.time0 = 10000;
	ep.time1 = 10075;
	t.assert(ep.progress === 0.375);
});