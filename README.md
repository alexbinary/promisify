# promisify
Minimalist promisification 👍

## Install

Install with npm/yarn :

```
$ npm install https://github.com/alexbinary/promisify.git

$ yarn add https://github.com/alexbinary/promisify.git
```

## Usage

Promisify a simple function with node style callback :

```javascript
let promisify = require('alexbinary.promisify')

function func (arg, cb) {
  // if ok
  cb(null, result)
  // if error
  cb(err)
}

let funcp = promisify(null, func)

funcp(arg).then((result) => {
  console.log(result)
}).catch((err) => {
  console.error(err)
})
```

The promisifed function is bound to anything that is passed as first argument to `promisify` :

```javascript
let promisify = require('alexbinary.promisify')
let fs = require('fs')

let fsReadFile = promisify(fs, fs.readFile)

fsReadFile(path).then((result) => {
  console.log(result)
}).catch((err) => {
  console.error(err)
})
```

If `null` is passed as first argument to `promisify` then the function is not bound to anything and gets it's `this` as usual :

```javascript
let promisify = require('alexbinary.promisify')

function func (arg, cb) {
  // note the use of `this` here
  cb(null, this.val + arg)
}

let obj = {
  val: 1,
  func: promisify(null, func)
}

obj.func(1).then((result) => {
  console.log(result === 2)
})
```

## License

MIT
