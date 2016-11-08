"use strict";

const assert = require("assert");

const parse = require("..").parse;

const describe = global.describe;
const it = global.it;

describe("Parse", () => {
	it("should parse match labels", () => {
		const selector = parse("labelA = a,labelB = b");

		assert.strictEqual(selector.matchExpressions.length, 0);
		assert.deepEqual(selector.matchLabels, {
			labelA : "a",
			labelB : "b"
		});
	});

	it("should parse exists and not exists", () => {
		const selector = parse("labelA,!labelB");

		assert.deepEqual(selector.matchLabels, {});
		assert.deepEqual(selector.matchExpressions, [{
			operator : "Exists",
			key      : "labelA"
		}, {
			operator : "DoesNotExist",
			key      : "labelB"
		}]);
	});

	it("should parse set operators", () => {
		const selector = parse("labelA in (a,A),labelB notin (b,B)");

		assert.deepEqual(selector.matchLabels, {});
		assert.deepEqual(selector.matchExpressions, [{
			operator : "In",
			key      : "labelA",
			values   : ["a", "A"]
		}, {
			operator : "NotIn",
			key      : "labelB",
			values   : ["b", "B"]
		}]);
	});

	it("should parse not equals as NotIn", () => {
		const selector = parse("labelA != a");

		assert.deepEqual(selector.matchLabels, {});
		assert.deepEqual(selector.matchExpressions, [{
			operator : "NotIn",
			key      : "labelA",
			values   : ["a"]
		}]);
	});

	it("should throw when parsing invalid expression", () => {
		assert.throws(() => parse("label is bad"));
	});
});
