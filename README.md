# promisify

Minimalist promisification 👍

## Install

Install using npm or yarn :

```bash
npm install @alexbinary/promisify
# or
yarn add @alexbinary/promisify
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

## License

MIT
