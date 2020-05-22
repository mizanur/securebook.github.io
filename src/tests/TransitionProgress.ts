import test from 'ava';
import { createTransitionProgress } from '@data/createTransitionProgress';

test(`Transition progress gets created properly`, t => {
	t.assert(createTransitionProgress({ x: 100, y: 200 }, { ix: 20, iy: 30 }));
});