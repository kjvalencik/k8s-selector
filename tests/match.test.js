"use strict";

const assert = require("assert");

const Selector = require("..").Selector;

const describe = global.describe;
const it = global.it;

describe("Match", () => {
	it("should match labels", () => {
		const selector = Selector("labelA = a, labelB = b");

		assert.strictEqual(selector({ labelA : "a" }), false);
		assert.strictEqual(selector({
			labelA : "a",
			labelB : "b"
		}), true);
	});

	it("should match set operators", () => {
		const selector = Selector("labelA in (a, A), labelB notin (b, B)");

		assert.strictEqual(selector({ labelA : "a" }), true);
		assert.strictEqual(selector({ labelA : "a" }), true);
	});

	it("should match exists", () => {
		const selector = Selector("labelA, !labelB");

		assert.strictEqual(selector({ labelA : "a" }), true);
		assert.strictEqual(selector({
			labelA : "a",
			labelB : "B"
		}), false);
	});

	it("should be able to create with matchLabels", () => {
		const selector = Selector({
			matchLabels : {
				labelA : "a",
				labelB : "b"
			}
		});

		assert.strictEqual(selector({ labelA : "a" }), false);
		assert.strictEqual(selector({
			labelA : "a",
			labelB : "b"
		}), true);
	});

	it("should be able to create with matchExpressions", () => {
		const selector = Selector({
			matchExpressions : [{
				operator : "DoesNotExist",
				key      : "labelA"
			}]
		});

		assert.strictEqual(selector({ labelA : "a" }), false);
		assert.strictEqual(selector(), true);
	});

	it("should throw trying to match invalid operator", () => {
		const selector = Selector({
			matchExpressions : [{
				operator : "invalid"
			}]
		});

		assert.throws(() => selector());
	});
});
