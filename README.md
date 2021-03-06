# promisify

Naive promisification 🙈

[![npm](https://img.shields.io/npm/v/@alexbinary/promisify.svg)](https://www.npmjs.com/package/@alexbinary/promisify)
[![GitHub release](https://img.shields.io/github/release/alexbinary/promisify.svg?label="github")](https://github.com/alexbinary/promisify/releases/latest)
[![Build Status](https://travis-ci.org/alexbinary/promisify.svg)](https://travis-ci.org/alexbinary/promisify)
[![dependencies Status](https://david-dm.org/alexbinary/promisify/status.svg)](https://david-dm.org/alexbinary/promisify)
[![devDependencies Status](https://david-dm.org/alexbinary/promisify/dev-status.svg)](https://david-dm.org/alexbinary/promisify?type=dev)

WARNING: This is a very basic implementation that works in simple cases but will probably break in more advanced situations.

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

Returns a function that returns a Promise with `function` as its executor.

`function` is expected to take a callback as last argument and call it with an error as first argument or null if success (node callback style).

If the callback is called with an error then the promise gets rejected with that error.
If the callback is called without error then the promise is resolved with any arguments passed to the callback after the first argument.

Note that the returned function can still be used with a callback style.

This method is idempotent, i.e. if `function` is the result of calling `promisify` then the returned value is `function` itself. This is done by defining a Symbol property on the returned object and checking for that property before processing.

### promisify(object, methods)

Replaces methods in given `object` whose names are listed in `methods` by the result of `promisify(method)`.

Returns `object`.

## License

MIT
