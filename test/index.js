
let chai = require('chai')
chai.use(require('chai-fs'))

let expect = chai.expect

let fs = require('fs')
let path = require('path')

let fsSandbox = require('alexbinary.fs-sandbox')
let promisify = require('./../src/index')

fsSandbox.setRoot(__dirname)

describe('promisify', function () {
  describe('promisify function', function () {
    it('when function returns success', function (done) {
      // ## Setup
      function f (arg, cb) { cb(null, arg) }
      // ## TEST
      promisify(f)(1).then(result => {
        // ## Assert
        expect(result).to.equal(1)
        // ## End
      }).then(() => done()).catch(() => done())
    })
    it('when function returns error', function (done) {
      // ## Setup
      function f (cb) { cb(new Error()) }
      // ## TEST
      promisify(f)().catch(err => {
        // ## Assert
        expect(err).to.be.instanceof(Error)
        // ## End
      }).then(() => done()).catch(() => done())
    })
    it('keep unbound `this`', function (done) {
      // ## Setup
      function f (cb) { cb(null, this) }
      // ## TEST
      promisify(f).call({x: 1}).then(result => {
        // ## Assert
        expect(result).to.deep.equal({x: 1})
        // ## End
      }).then(() => done()).catch(() => done())
    })
    it('is idempotent', function (done) {
      // ## Setup
      function f (cb) { cb(null, this) }
      // ## TEST
      let promisifiedOnce = promisify(f)
      let promisifiedTwice = promisify(promisifiedOnce)
      // ## Assert
      expect(promisifiedTwice).to.equal(promisifiedOnce)
      // ## End
      done()
    })
    describe('keep callback style', function () {
      it('function returns success', function (done) {
        // ## Setup
        function f (arg, cb) { cb(null, arg) }
        // ## TEST
        promisify(f)(1, (err, result) => {
          // ## Assert
          expect(err).to.be.null
          expect(result).to.equal(1)
          // ## End
          done()
        })
      })
      it('function returns error', function (done) {
        // ## Setup
        function f (cb) { cb(new Error()) }
        // ## TEST
        promisify(f)((err, result) => {
          // ## Assert
          expect(err).to.be.instanceof(Error)
          // ## End
          done()
        })
      })
    })
  })
  describe('promisify object methods', function () {
    it('promisify methods', function (done) {
      // ## Setup
      let obj = {
        func1 (cb) { cb(null, this) },
        func2 (cb) { cb(null, this) }
      }
      // ## TEST
      promisify(obj, ['func1', 'func2'])
      Promise.all([
        obj.func1().then(result => {
          // ## Assert
          expect(result).to.equal(obj)
        }),
        // ## TEST
        obj.func2().then(result => {
          // ## Assert
          expect(result).to.equal(obj)
        })
        // ## End
      ]).then(() => done()).catch(() => done())
    })
    it('keep callback style', function (done) {
      // ## Setup
      let obj = {
        func1 (cb) { cb(null, this) },
        func2 (cb) { cb(null, this) }
      }
      // ## TEST
      promisify(obj, ['func1', 'func2'])
      obj.func1((err, result) => {
        // ## Assert
        expect(err).to.be.null
        expect(result).to.equal(obj)
        // ## TEST
        obj.func2((err, result) => {
          // ## Assert
          expect(err).to.be.null
          expect(result).to.equal(obj)
          // ## End
          done()
        })
      })
    })
  })
  describe('promisify fs', function () {
    describe('writeFile', function () {
      it('direct', function (done) {
        // ## Setup
        let sandbox = fsSandbox.newSync()
        let file = sandbox.touchpSync('foo/bar')
        // ## TEST
        promisify(fs.writeFile)(file.fullpath, 'test').then(() => {
          // ## Assert
          expect(file.fullpath).to.be.a.file().with.content('test')
          // ## Teardown
          fsSandbox.rmSync()
          // ## End
        }).then(() => done()).catch(done)
      })
      it('pre-use', function (done) {
        // ## Setup
        let sandbox = fsSandbox.newSync()
        let file = sandbox.touchpSync('foo/bar')
        fs.writeFile = promisify(fs.writeFile)
        // ## TEST
        fs.writeFile(file.fullpath, 'test').then(() => {
          // ## Assert
          expect(file.fullpath).to.be.a.file().with.content('test')
          // ## Teardown
          fsSandbox.rmSync()
          // ## End
        }).then(() => done()).catch(done)
      })
      it('bulk', function (done) {
        // ## Setup
        let sandbox = fsSandbox.newSync()
        let file = sandbox.touchpSync('foo/bar')
        promisify(fs, ['writeFile'])
        // ## TEST
        fs.writeFile(file.fullpath, 'test').then(() => {
          // ## Assert
          expect(file.fullpath).to.be.a.file().with.content('test')
          // ## Teardown
          fsSandbox.rmSync()
          // ## End
        }).then(() => done()).catch(done)
      })
    })
  })
  after(function () {
    fsSandbox.rmSync()
  })
})
