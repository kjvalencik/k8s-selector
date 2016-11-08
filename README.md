[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependency Status][depstat-image]][depstat-url]

# k8s-selector

> Kubernetes selector implementation in node

Implementation of `stringify`, `parse` and `match` for selectors in the
[Kubernetes API](http://kubernetes.io/docs/user-guide/labels/).

## Methods

### `stringify(selector)`

Stringifies a selector for use in a query parameter.

```js
import { stringify } from "k8s-selector";
import rp from "request-promise";

rp.get({
	uri  : "http://localhost:8080/api/v1/pods",
	json : true,
	qs   : {
		matchLabels : stringify({
			matchLabels : {
				labelA : "a"
			},
			matchExpressions : [{
				operator : "In",
				key      : "labelB",
				values   : ["b", "B"]
			}]
		})
	}
});
```

### `parse(string)`

Parses a Kubernetes API query param selector.

```js
import assert from "assert";

import { parse } from "k8s-selector";

assert.deepEqual(parse("labelA = a, labelB != b"), {
	matchLabels : {
		labelA : "a"
	},
	matchExpressions : [{
		operator : "NotIn",
		key      : "labelB",
		values   : ["b"]
	}]
});
```

### `Selector(string|selector)`

Implementation of Kubernetes selector matching logic.

```js
import assert from "assert";

import { Selector } from "k8s-selector";

const selector = Selector("labelA = a");

assert.strictEqual(selector({ labelA : "a" }), true);
```

## License

[MIT License](LICENSE)

[npm-url]: https://npmjs.org/package/k8s-selector
[npm-image]: https://img.shields.io/npm/v/k8s-selector.svg?style=flat-square

[travis-url]: http://travis-ci.org/kjvalencik/k8s-selector
[travis-image]: https://img.shields.io/travis/kjvalencik/k8s-selector/master.svg?style=flat-square

[coveralls-url]: https://coveralls.io/r/kjvalencik/k8s-selector
[coveralls-image]: https://img.shields.io/coveralls/kjvalencik/k8s-selector/master.svg?style=flat-square

[depstat-url]: https://david-dm.org/kjvalencik/k8s-selector#info=devDependencies
[depstat-image]: https://img.shields.io/david/dev/kjvalencik/k8s-selector/master.svg?style=flat-square
