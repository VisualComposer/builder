/* global console */
const exec = require('child-process-promise').exec
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
    this.cloneReposAsync = this.cloneReposAsync.bind(this)
    this.readJSONFilesAsync = this.readJSONFilesAsync.bind(this)
  }

  build (callback) {
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
  }

  clone (repo, path) {
    console.log(`Cloning git repository ${repo}\n`)
    return exec(`git clone --depth 1 ${repo} ${path}`).catch((result) => {console.log(result)})
  }

  cloneReposAsync (elements) {
    const promises = []
    const repoDir = path.join(this.dir, this.repoDir)
    const accountRepoDir = path.join(this.dir, this.accountRepoDir)
    const elementsDir = path.join(this.dir, this.elementsDir)
    // Clone repos
    promises.push(this.clone(this.repo, repoDir))
    promises.push(this.clone(this.accountRepo, accountRepoDir))
    // Clone
    fs.ensureDirSync(elementsDir)
    elements.forEach((tag) => {
      promises.push(this.clone(`git@gitlab.com:visualcomposer-hub/${tag}.git`, path.join(elementsDir, tag)))
    })
    // this.promises = promises
    return Promise.all(promises)
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