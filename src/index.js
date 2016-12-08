
function promisify (ctx, f, fulfiller) {
  if (!fulfiller) {
    fulfiller = (resolve, reject) => {
      return (err, ...args) => {
        if (err) reject(err)
        else resolve(...args)
      }
    }
  }
  return function () {
    return new Promise((resolve, reject) => {
      f.call(ctx || this, ...arguments, fulfiller(resolve, reject))
    })
  }
}

module.exports = promisify
