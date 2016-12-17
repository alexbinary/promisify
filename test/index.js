
let expect = require('chai').expect
let promisify = require('./../src/index')

function func (arg1, arg2, cb) {
  if (arg1 > 0) {
    cb(null, arg1 + arg2)
  } else {
    cb(new Error('arg1 must be positive'))
  }
}

let obj = {
  val: 1,
  func1: function (arg, cb) {
    if (arg > 0) {
      cb(null, arg + this.val)
    } else {
      cb(new Error('arg must be positive'))
    }
  },
  func2: function (arg, cb) {
    if (arg > 0) {
      cb(null, arg + this.val)
    } else {
      cb(new Error('arg must be positive'))
    }
  }
}

describe('promisify', function () {
  describe('use as promise', function () {
    describe('function without context', function () {
      it('success', function (done) {
        // ## TEST
        let promisifed = promisify(func)
        promisifed(1, 2).then((res) => {
          // ## Assert
          expect(res).to.equal(3)
          // ## End
        }).then(done, done)
      })
      it('error', function (done) {
        // ## TEST
        let promisifed = promisify(func)
        promisifed(-1, 2).catch(() => {
          // ## Assert
          // ## End
        }).then(done, done)
      })
    })
    describe('function with dynamic context', function () {
      it('success', function (done) {
        // ## Setup
        let ob = {
          val: 2,
          // ## TEST
          promisifed: promisify(obj.func1)
        }
        ob.promisifed(1).then((res) => {
          // ## Assert
          expect(res).to.equal(3)
          // ## End
        }).then(done, done)
      })
      it('error', function (done) {
        // ## Setup
        let ob = {
          val: 2,
          // ## TEST
          promisifed: promisify(obj.func1)
        }
        ob.promisifed(-1).catch(() => {
          // ## Assert
          // ## End
        }).then(done, done)
      })
    })
    describe('bulk object promisification', function () {
      it('success', function (done) {
        // ## TEST
        promisify(obj, ['func1', 'func2'])
        obj.func1(1)
        .then(result => {
          // ## Assert
          expect(result).to.equal(2)
        }).then(() => {
          return obj.func1(1).then(result => {
            // ## Assert
            expect(result).to.equal(2)
          })
          // ## End
        }).then(done, done)
      })
      it('error', function (done) {
        // ## TEST
        promisify(obj, ['func1', 'func2'])
        obj.func1(-1)
        .catch(err => {
          // ## Assert
          expect(err).to.not.be.null
          return obj.func1(-1).catch(err => {
            // ## Assert
            expect(err).to.not.be.null
          })
        }).then(done, done)
      })
    })
  })
  describe('use with callback', function () {
    describe('function without context', function () {
      it('success', function (done) {
        // ## TEST
        let promisifed = promisify(func)
        promisifed(1, 2, (err, res) => {
          // ## Assert
          expect(err).to.be.null
          expect(res).to.equal(3)
          // ## End
          done()
        })
      })
      it('error', function (done) {
        // ## TEST
        let promisifed = promisify(func)
        promisifed(-1, 2, (err, res) => {
          // ## Assert
          expect(err).to.not.be.null
          // ## End
          done()
        })
      })
    })
    describe('function with dynamic context', function () {
      it('success', function (done) {
        // ## Setup
        let ob = {
          val: 2,
          // ## TEST
          promisifed: promisify(obj.func1)
        }
        ob.promisifed(1, (err, res) => {
          // ## Assert
          expect(err).to.be.null
          expect(res).to.equal(3)
          // ## End
          done()
        })
      })
      it('error', function (done) {
        // ## Setup
        let ob = {
          val: 2,
          // ## TEST
          promisifed: promisify(obj.func1)
        }
        ob.promisifed(-1, (err, res) => {
          // ## Assert
          expect(err).to.not.be.null
          // ## End
          done()
        })
      })
    })
    describe('bulk object promisification', function () {
      it('success', function (done) {
        // ## TEST
        promisify(obj, ['func1', 'func2'])
        obj.func1(1, (err, result) => {
          // ## Assert
          expect(err).to.be.null
          expect(result).to.equal(2)
          obj.func2(1, (err, result) => {
            // ## Assert
            expect(err).to.be.null
            expect(result).to.equal(2)
            // ## End
            done()
          })
        })
      })
      it('error', function (done) {
        // ## TEST
        promisify(obj, ['func1', 'func2'])
        obj.func1(-1, (err, result) => {
          // ## Assert
          expect(err).to.not.be.null
          obj.func2(-1, (err, result) => {
            // ## Assert
            expect(err).to.not.be.null
            // ## End
            done()
          })
        })
      })
    })
  })
})
