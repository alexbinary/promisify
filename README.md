# promisify

Minimalist promisification 👍

[![npm](https://img.shields.io/npm/v/@alexbinary/promisify.svg)](https://www.npmjs.com/package/@alexbinary/promisify)
[![GitHub release](https://img.shields.io/github/release/alexbinary/promisify.svg?label="github")](https://github.com/alexbinary/promisify/releases/latest)

## Install

Install using npm or yarn :

```bash
$ npm install @alexbinary/promisify
# or
$ yarn add @alexbinary/promisify
```

## Usage

```javascript
let promisify = require('@alexbinary/promisify')

// promisify a function :

function f (cb) { cb(null, 'ok') }

promisify(f)()
.then((result) => console.log(result))  // 'ok'
.catch((err) => console.error(err))

// promisify methods in an object :

promisify(fs, ['readFile', 'writeFile'])
fs.readFile('/foo/bar', 'utf8')
.then((content) => console.log(content))
.catch((err) => console.log(err))

```

## Documentation

```javascript
let promisify = require('@alexbinary/promisify')
```

### promisify(function)

Returns a function that returns a Promise with `function` as executor.

`function` is expected to take a callback as last argument and call it with an error as first argument or null if success (node callback style).

If the callback is called with an error then the promise gets rejected with that error.
If the callback is called without error then the promise is resolved with any arguments passed to the callback after the first argument.

The returned function can still take a callback as last parameter and will call it correctly so you can keep using it with a callback approach if you want to.

This method is idempotent, i.e. if `function` is the result of calling `promisify` then the returned value is `function` itself. This is done by defining a Symbol property on the returned object and checking for that property before processing.

### promisify(object, methods)

Replaces methods in given `object` whose names are listed in `methods` by the result of `promisify(method)`.

Returns `object`.

## License

MIT
