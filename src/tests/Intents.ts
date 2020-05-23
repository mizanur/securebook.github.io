import test from "ava";
import { createIntents } from "@data/createIntents";
import { Intent } from "@interfaces/Intent";

type TestContext = {
	intents: {
		a: Intent,
		b: Intent,
		c: Intent
	},
	intentManager: ReturnType<typeof createIntents>
};

function createIntent() {
	return {
		isCurrentIntentValid: false,
		isCurrentIntent: false,
	}
}

test.beforeEach(t => {
	const a = createIntent();
	const b = createIntent();
	const c = createIntent();
	const context: TestContext = {
		intents: { a, b, c },
		intentManager: createIntents([a, b, c])
	};
	t.context = context;
});

test(`if no intent is current, no intent should be valid`, t => {
	const context = t.context as TestContext;
	const { intents, intentManager } = context;
	intentManager.determineAndNotifyValidIntent();
	t.assert(intents.a.isCurrentIntentValid === false);
	t.assert(intents.b.isCurrentIntentValid === false);
	t.assert(intents.c.isCurrentIntentValid === false);
	t.assert(intentManager.currentIntent === null);
});

test(`if one intent is current, only that intent is valid`, t => {
	const context = t.context as TestContext;
	const { intents, intentManager } = context;
	intents.b.isCurrentIntent = true;
	intentManager.determineAndNotifyValidIntent();
	t.assert(intents.a.isCurrentIntentValid === false);
	t.assert(intents.b.isCurrentIntentValid === true);
	t.assert(intents.c.isCurrentIntentValid === false);
	t.assert(intentManager.currentIntent === intents.b);
});

test(`if more than one intent is current, one of those intents is valid`, t => {
	const context = t.context as TestContext;
	const { intents, intentManager } = context;
	intents.b.isCurrentIntent = true;
	intents.c.isCurrentIntent = true;
	intentManager.determineAndNotifyValidIntent();
	t.assert(
		(intents.b.isCurrentIntentValid && !intents.c.isCurrentIntentValid) ||
		(!intents.b.isCurrentIntentValid && intents.c.isCurrentIntentValid)
	);
	t.assert(
		(intents.b.isCurrentIntentValid && intentManager.currentIntent === intents.b) ||
		(intents.c.isCurrentIntentValid && intentManager.currentIntent === intents.c)
	);
});