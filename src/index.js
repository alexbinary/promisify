
function promisify (arg1, arg2) {
  if (arg2) {
    // promisify(obj, ['method1', 'method2'])
    arg2.forEach(name => {
      arg1[name] = promisifyFunction(arg1[name])
    })
  } else {
    // promisify(func)
    return promisifyFunction(arg1)
  }
}

function promisifyFunction (f) {
  return function () {
    return new Promise((resolve, reject) => {
      f.call(this, ...arguments, (err, ...args) => {
        if (err) reject(err)
        else resolve(...args)
      })
    })
  }
}

module.exports = promisify
