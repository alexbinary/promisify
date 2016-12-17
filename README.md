# promisify
Minimalist promisification 👍

## Install

Install with npm/yarn :

```
$ npm install https://github.com/alexbinary/promisify.git

$ yarn add https://github.com/alexbinary/promisify.git
```

## Usage

```javascript
let promisify = require('alexbinary.promisify')

// promisify a function :

function f (cb) { cb(null, 'ok') }

promisify(f)()
.then(result => console.log(result))  // 'ok'
.catch(err => console.error(err))

// promisify methods in an object :

promisify(fs, ['readFile', 'writeFile'])
fs.readFile('/foo/bar', 'utf8')
.then(content => console.log(content))
.catch(err => console.log(err))

```

## License

MIT
