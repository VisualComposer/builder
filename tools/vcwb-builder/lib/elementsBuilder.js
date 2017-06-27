/* global console */
const exec = require('child-process-promise').exec
const spawn = require('child-process-promise').spawn
const fs = require('fs-extra')
const path = require('path')
class ElementsBuilder {
  constructor (dir, repo, accountRepo) {
    Object.defineProperties(this, {
      /**
       * @property {String}
       * @name ElementsBuilder#dir
       */
      'dir': {
        value: dir,
        writable: false
      },
      /**
       * @property {String}
       * @name ElementsBuilder#accountRepo
       */
      'accountRepo': {
        value: accountRepo,
        writable: false
      },
      /**
       * @property {String}
       * @name ElementsBuilder#repo
       */
      'repo': {
        value: repo,
        writable: false
      },
      /**
       * @property {String}
       * @name ElementsBuilder#elementsDir
       */
      'elementsDir': {
        value: `elementsForBundle${+new Date()}`,
        writable: false
      },
      /**
       * @property {String}
       * @name ElementsBuilder#repoDir
       */
      'repoDir': {
        value: `builder-${+new Date()}`,
        writable: false
      },
      /**
       * @property {String}
       * @name ElementsBuilder#accountRepoDir
       */
      'accountRepoDir': {
        value: `vcv-account-${+new Date()}`,
        writable: false
      },
      /**
       * @property {String}
       * @name ElementsBuilder#bundleDir
       */
      'bundleDir': {
        value: `vcv-bundle-${+new Date()}`,
        writable: false
      }
      ,
      /**
       * @property {String}
       * @name ElementsBuilder#bundleData
       */
      'bundleData': {
        enumerable: false,
        configurable: false,
        value: [],
        writable: false
      }
    })
  }

  build (elements, callback) {
    console.log('Cloning repositories...')
    Promise.all([ this.cloneRepoAsync()]).then(() => {
      console.log('Building VCWB...')
      this.buildVCWB().then(() => {
        console.log('Building elements and copying files from bundle pre-build to a new package directory...')
        /*
        Promise.all([this.buildElementsAsync(elements), this.copyFilesAsync()]).then(() => {
         callback()
         })*/
      })
    })
    /*
     this.cloneReposAsync(elements).then(() => {
     this.cleanUpElementsAsync().then(() => {
     this.copyFilesAsync().then(() => {
     this.updateBundleJSONFileAsync().then(() => {
     this.createZipArchiveAsync().then(() => {
     this.removeRepoDirsAsync().then(callback)
     })
     })
     })
     })
     })
     */
  }
  exec (cmd, options = {}) {
    const promise = exec(cmd, options).catch((result) => {console.log(result)})
/*    const childProcess = promise.childProcess

    childProcess.stdout.on('data', function (data) {
      console.log(data.toString())
    })
    childProcess.stderr.on('data', function (data) {
      console.log(data.toString())
    })*/
    return promise
  }
  clone (repo, path) {
    return this.exec(`git clone --depth 1 ${repo} ${path}`)
  }
  cloneRepoAsync () {
    const repoDir = path.join(this.dir, this.repoDir)
    return this.clone(this.repo, repoDir)
  }
  cloneAccountRepoAsync () {
    const accountRepoDir = path.join(this.dir, this.accountRepoDir)
    return this.clone(this.accountRepo, accountRepoDir)
  }
  buildVCWB () {
    const repoDir = path.join(this.dir, this.repoDir)
    return this.exec('npm install && npm run build-production', {
      cwd: repoDir
    })
  }

  cloneElementsReposAsync (elements) {
    const promises = []
    const elementsDir = path.join(this.dir, this.elementsDir)
    // Clone
    fs.ensureDirSync(elementsDir)
    elements.forEach((tag) => {
      // promises.push(this.clone(`git@gitlab.com:visualcomposer-hub/${tag}.git`, path.join(elementsDir, tag)))
    })
    return Promise.all(promises)
  }

  buildElement (path) {
    return exec('npm run build', {
      cwd: path
    }).catch((result) => {console.log(result)})
  }

  buildElementsAsync (elements) {
    const promises = []
    const elementsDir = path.join(this.dir, this.elementsDir)
    elements.forEach((tag) => {
      const elementDir = path.join(elementsDir, tag)
      promises.push(this.buildElement(elementDir))
    })
    return Promise.all(promises)
  }
  copyEditorsFilesAsync () {
    /*
     // 'cp -fr ' + repoPath + '/public/dist/pe.* ./public/dist/ &' +
     'cp -fr ' + repoPath + '/public/dist/vendor.bundle.js ./public/dist/ &' +
     // 'cp -fr ' + repoPath + '/public/dist/front.* ./public/dist/ &' +
     // 'cp -fr ' + repoPath + '/public/dist/fonts ./public/dist/ &' +
     */
    return Promise.all([])
  }
  copyFilesAsync () {
    const promises = []
    const accountRepoDir = path.join(this.dir, this.accountRepoDir, 'resources', 'bundle-prebuild')
    const bundleDir = path.join(this.dir, this.bundleDir)
    promises.push(fs.move(accountRepoDir, bundleDir))
    return Promise.all(promises)
  }

  cleanUpElementsAsync () {
    const promises = []
    /*
     rm -rf $EXECDIR/elements/$i/.git
     rm -f $EXECDIR/elements/$i/package.json
     rm -f $EXECDIR/elements/$i/webpack.config.js
     rm -f $EXECDIR/elements/$i/.gitignore
     rm -f $EXECDIR/elements/$i/public/dist/vendor.bundle.js
     rm -f $EXECDIR/elements/$i/public/dist/.gitkeep
     rm -f $EXECDIR/elements/$i/$i/settings.json
     rm -f $EXECDIR/elements/$i/$i/component.js
     rm -f $EXECDIR/elements/$i/$i/index.js
     rm -f $EXECDIR/elements/$i/$i/styles.css
     rm -f $EXECDIR/elements/$i/$i/editor.css
     rm -rf $EXECDIR/elements/$i/$i/public/src
     rm -rf $EXECDIR/elements/$i/$i/cssMixins
     */
    return Promise.all(promises)
  }

  updateBundleJSONFileAsync () {
    const promises = []
    const jsFile = path.join(this.dir, this.bundleDir, 'bundle.json')

    promises.push(fs.readJson(jsFile).then((data) => {
      this.bundleData = data
    }))
    /*
     fs.readFile('n', 'utf8', function (err, data) {
     var obj = JSON.parse(data);
     })*/
    return Promise.all(promises)
  }

  createZipArchiveAsync () {
    return Promise.all([])
  }

  removeRepoDirsAsync () {
    console.log('Removing temp directories...')
    const repoDir = path.join(this.dir, this.repoDir)
    const accountRepoDir = path.join(this.dir, this.accountRepoDir)
    const elementsDir = path.join(this.dir, this.elementsDir)
    const bundleDir = path.join(this.dir, this.bundleDir)
    const promises = []
    promises.push(fs.remove(repoDir))
    promises.push(fs.remove(accountRepoDir))
    promises.push(fs.remove(elementsDir))
    promises.push(fs.remove(bundleDir))
    return Promise.all(promises)
  }
}
module.exports = ElementsBuilder