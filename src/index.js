
let symPromisified = Symbol.for('alexbinary.promisified')

function promisify (arg1, arg2) {
  if (arg2) {
    // promisify(obj, ['method1', 'method2'])
    arg2.forEach((name) => {
      arg1[name] = promisifyFunction(arg1[name])
    })
    return arg1
  } else {
    // promisify(func)
    return promisifyFunction(arg1)
  }
}

function promisifyFunction (f) {
  if (f[symPromisified]) return f
  let result = function () {
    return new Promise((resolve, reject) => {
      f.call(this, ...arguments, (err, ...args) => {
        if (err) reject(err)
        else resolve(...args)
      })
    })
  }
  result[symPromisified] = true
  return result
}

module.exports = promisify
