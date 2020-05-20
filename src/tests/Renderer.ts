import test, { beforeEach } from 'ava';
import { createRenderer } from '@data/createRenderer';
import { Renderer } from '@interfaces/Renderer';
import { Spy, createSpy } from '@utils/spy';

type TestContext = {
	performSpy: Spy,
	onUpdateSpy: Spy,
	renderer: Renderer,
};

beforeEach(t => {
	const context: TestContext = {
		performSpy: createSpy(),
		onUpdateSpy: createSpy(),
		renderer: createRenderer()
	};
	context.renderer.calculation = {
		isInitialRender: true,
		perform: () => {
			context.performSpy();
		},
		onUpdate: () => {
			context.onUpdateSpy();
		}
	};
	t.context = context;
});

test(`On the first change, performs only "perform"`, t => {
	const { renderer, performSpy, onUpdateSpy } = t.context as TestContext;
	renderer.onCalculationChanged();
	t.assert(performSpy.calls.length === 1);
	t.assert(onUpdateSpy.calls.length === 0);
});

test(`On the second change, performs "onUpdate"`, t => {
	const { renderer, performSpy, onUpdateSpy } = t.context as TestContext;
	renderer.onCalculationChanged();
	renderer.onCalculationChanged();
	t.assert(performSpy.calls.length === 1);
	t.assert(onUpdateSpy.calls.length === 1);
});

test(`If the "calculation" becomes "null", no new updates will trigger`, t => {
	const { renderer, performSpy, onUpdateSpy } = t.context as TestContext;
	renderer.onCalculationChanged();
	renderer.calculation = null;
	renderer.onCalculationChanged();
	t.assert(performSpy.calls.length === 1);
	t.assert(onUpdateSpy.calls.length === 0);
});