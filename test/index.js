
let chai = require('chai')
let expect = chai.expect
chai.use(require('chai-fs'))

let fsSandbox = require('alexbinary.fs-sandbox')
fsSandbox.setRoot(__dirname)

let fs = require('fs')
let promisify = require('./../src/index')

describe('promisify', function () {
  describe('function', function () {
    it('when return success', function (done) {
      // ## Setup
      function f (arg, cb) { cb(null, arg) }
      // ## TEST
      promisify(f)(1).then((result) => {
        // ## Assert
        expect(result).to.equal(1)
        // ## End
      }).then(() => done()).catch(done)
    })
    it('when return error', function (done) {
      // ## Setup
      function f (cb) { cb(new Error()) }
      // ## TEST
      promisify(f)().catch((err) => {
        // ## Assert
        expect(err).to.be.instanceof(Error)
        // ## End
      }).then(() => done()).catch(done)
    })
    it('keep unbound `this`', function (done) {
      // ## Setup
      function f (cb) { cb(null, this) }
      // ## TEST
      promisify(f).call({x: 1}).then((result) => {
        // ## Assert
        expect(result).to.deep.equal({x: 1})
        // ## End
      }).then(() => done()).catch(done)
    })
    it('idempotent', function () {
      // ## Setup
      function f (cb) { cb(null, this) }
      // ## TEST
      let promisifiedOnce = promisify(f)
      let promisifiedTwice = promisify(promisifiedOnce)
      // ## Assert
      expect(promisifiedTwice).to.equal(promisifiedOnce)
      // ## End
    })
    describe('keep callback style', function () {
      it('return success', function (done) {
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
      it('return error', function (done) {
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
  describe('object methods', function () {
    it('promisify', function (done) {
      // ## Setup
      let obj = {
        func1 (cb) { cb(null, this) },
        func2 (cb) { cb(null, this) }
      }
      // ## TEST
      promisify(obj, ['func1', 'func2'])
      Promise.all([
        obj.func1().then((result) => {
          // ## Assert
          expect(result).to.equal(obj)
        }),
        // ## TEST
        obj.func2().then((result) => {
          // ## Assert
          expect(result).to.equal(obj)
        })
        // ## End
      ]).then(() => done()).catch(done)
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
    it('return object', function () {
      // ## Setup
      let obj = {
        func1 (cb) { cb(null, this) },
        func2 (cb) { cb(null, this) }
      }
      // ## TEST
      let result = promisify(obj, ['func1', 'func2'])
      // ## Assert
      expect(result).to.equal(obj)
      // ## End
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
