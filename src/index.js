
function promisify (ctx, f) {
  return function () {
    return new Promise((resolve, reject) => {
      f.call(ctx || this, ...arguments, (err, ...args) => {
        if (err) reject(err)
        else resolve(...args)
      })
    })
  }
}

module.exports = promisify
