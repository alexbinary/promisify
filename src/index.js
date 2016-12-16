
function promisify (f) {
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
