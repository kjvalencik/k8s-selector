"use strict";

const assert = require("assert");

const stringify = require("..").stringify;

const describe = global.describe;
const it = global.it;

describe("Stringify", () => {
	it("should stringify match labels as In", () => {
		const labelSelector = stringify({
			matchLabels : {
				labelA : "a",
				labelB : "b"
			}
		});

		assert.strictEqual(labelSelector, "labelA = a,labelB = b");
	});

	it("should stringify exists and not exists", () => {
		const labelSelector = stringify({
			matchExpressions : [{
				operator : 'Exists',
				key      : 'labelA'
			}, {
				operator : 'DoesNotExist',
				key      : 'labelB'
			}]
		});

		assert.strictEqual(labelSelector, "labelA,!labelB");
	});

	it("should stringify set operators", () => {
		const labelSelector = stringify({
			matchExpressions : [{
				operator : 'In',
				key      : 'labelA',
				values   : ['a']
			}, {
				operator : 'NotIn',
				key      : 'labelB',
				values   : ['b']
			}]
		});

		assert.strictEqual(labelSelector,
			"labelA in (a),labelB notin (b)");
	});

	it("should combine match labels and expressions", () => {
		const labelSelector = stringify({
			matchLabels : {
				labelA : "a"
			},
			matchExpressions : [{
				operator : 'In',
				key      : 'labelB',
				values   : ['b']
			}]
		});

		assert.strictEqual(labelSelector, "labelA = a,labelB in (b)");
	});
});
