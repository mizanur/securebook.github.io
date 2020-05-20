import test from "ava";
import { createParts } from "@data/createParts";

test(`Parts is functioning`, t => {
	t.assert(createParts());
});