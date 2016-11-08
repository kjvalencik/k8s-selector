"use strict";

const hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);

function parseExpression(expr) {
	const parts = expr.trim().split(" ");
	const key = parts[0];
	const operator = parts[1];
	const value = parts[2];
	const values = (value || "")
		.slice(1, -1)
		.split(",")
		.map(val => val.trim());

	switch (operator) {
		case undefined:
			return key[0] === "!" ? {
				operator : "DoesNotExist",
				key      : key.slice(1)
			} : {
				operator : "Exists",
				key
			};
		case "=":
		case "==":
			return {
				operator : "=",
				key,
				value
			};
		case "!=":
			return {
				operator : "NotIn",
				values   : [value],
				key
			};
		case "in":
			return {
				operator : "In",
				key,
				values
			};
		case "notin":
			return {
				operator : "NotIn",
				key,
				values
			};
		default:
	}

	throw new Error(`Invalid expression: ${expr}`);
}

function parse(labelSelector) {
	const expressions = labelSelector
		.split(/,(?![^(]*\))/)
		.map(parseExpression);

	const matchLabels = expressions
		.filter(expr => hasOwnProperty(expr, "value"))
		.reduce((labels, expr) => Object.assign(labels, {
			[expr.key] : expr.value
		}), {});

	const matchExpressions = expressions
		.filter(expr => !hasOwnProperty(expr, "value"));

	return { matchLabels, matchExpressions };
}

function stringifyExpression(expr) {
	const operator = expr.operator.toLowerCase();
	const key = expr.key;
	const values = expr.values;

	switch (operator) {
		case "exists": return key;
		case "doesnotexist": return `!${key}`;
		default:
	}

	return `${key} ${operator} (${values.join(",")})`;
}

function stringify(opts) {
	const matchLabels = opts.matchLabels || {};
	const matchExpressions = opts.matchExpressions || [];

	return Object
		.keys(matchLabels)
		.map(key => `${key} = ${matchLabels[key]}`)
		.concat(matchExpressions.map(stringifyExpression))
		.join(",");
}

function getMatchExpressions(opts) {
	if (typeof opts === "string") {
		return getMatchExpressions(parse(opts));
	}

	const matchExpressions = opts.matchExpressions || [];
	const matchLabels = opts.matchLabels || {};

	return Object
		.keys(matchLabels)
		.map(label => ({
			operator : "In",
			key      : label,
			values   : [matchLabels[label]]
		}))
		.concat(matchExpressions);
}

function isExprMatch(expr, labels) {
	const op = expr.operator;
	const key = expr.key;
	const values = expr.values;
	const label = labels[key];

	switch (op) {
		case "Exists": return hasOwnProperty(labels, key);
		case "DoesNotExist": return !hasOwnProperty(labels, key);
		case "In": return values.indexOf(label) >= 0;
		case "NotIn": return values.indexOf(label) < 0;
		default:
	}

	throw new Error(`Invalid operator: ${op}`);
}

function Selector(opts) {
	const expressions = getMatchExpressions(opts);

	return labels => expressions
		.every(expr => isExprMatch(expr, labels || {}));
}

module.exports = {
	stringify,
	parse,
	Selector
};
