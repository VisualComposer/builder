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
       * @name ElementsBuilder#elementsPath
       */
      'elementsPath': {
        get: () => {
          return path.join(this.dir, this.repoDir, this.elementsDir)
        }
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
       * @name ElementsBuilder#repoPath
       */
      'repoPath': {
        get: () => {
          return path.join(this.dir, this.repoDir)
        }
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
      },
      /**
       * @property {String}
       * @name ElementsBuilder#bundleDir
       */
      'bundlePath': {
        get: () => {
          return path.join(this.dir, this.bundleDir)
        }
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
    Promise.all([ this.cloneRepoAsync(), this.cloneAccountRepoAsync() ]).then(() => {
      console.log('Cloning elements repos')
      this.cloneElementsReposAsync(elements).then(() => {
        console.log('Building VCWB...')
        this.buildVCWB().then(() => {
          console.log('Building elements and copying files from bundle pre-build to a new package directory...')
          Promise.all(this.buildElementsAsync(elements), this.copyFilesAsync()).then(() => {
            console.log('Cleaning up elements...')
            Promise.all([this.copyEditorsFilesAsync(), this.cleanUpElementsAsync(elements)]).then(() => {
              callback()
            })
            /*
             Promise.all([this.buildElementsAsync(elements), this.copyFilesAsync()]).then(() => {
             callback()
             })*/
          })

        })
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
    console.log(`Cloning ${repo}...`)
    return this.exec(`git clone --depth 1 ${repo} ${path}`)
  }

  cloneRepoAsync () {
    return this.clone(this.repo, this.repoPath)
  }

  cloneAccountRepoAsync () {
    const accountRepoDir = path.join(this.dir, this.accountRepoDir)
    return this.clone(this.accountRepo, accountRepoDir)
  }

  buildVCWB () {
    return this.exec('npm install && npm run build-production', {
      cwd: this.repoPath
    })
  }

  cloneElementsReposAsync (elements) {
    const promises = []
    // Clone
    fs.ensureDirSync(this.elementsPath)
    elements.forEach((tag) => {
      promises.push(this.clone(`git@gitlab.com:visualcomposer-hub/${tag}.git`, path.join(this.elementsPath, tag)))
    })
    return Promise.all(promises)
  }

  buildElement (path) {
    console.log(`Building element in ${path}...`)
    return this.exec('npm run build && sed -i "" "s:../../node_modules/:./node_modules/:g" public/dist/element.bundle.js ', {
      cwd: path
    })
  }

  buildElementsAsync (elements) {
    const promises = []
    elements.forEach((tag) => {
      const elementDir = path.join(this.elementsPath, tag)
      promises.push(this.buildElement(elementDir))
    })
    return promises
  }

  copyEditorsFilesAsync () {
    const promises = []
    const join = path.join
    const distPath = join(this.repoPath, 'dist')
    const bundleEditorPath = join(this.bundlePath ,'editor')
    promises.push(fs.copy(join(distPath, 'pe*'), bundleEditorPath))
    promises.push(fs.copy(join(distPath, 'wp.bundle.*'), bundleEditorPath))
    promises.push(fs.copy(join(distPath, 'wpbackend.bundle.*'), bundleEditorPath))
    promises.push(fs.copy(join(distPath, 'front.*'), bundleEditorPath))
    promises.push(fs.copy(join(distPath, 'fonts'), bundleEditorPath))
    promises.push(fs.copy(join(distPath, 'images'), bundleEditorPath))
    return Promise.all(promises)
  }

  copyFilesAsync () {
    const accountRepoDir = path.join(this.dir, this.accountRepoDir, 'resources', 'bundle-prebuild')
    const bundleDir = path.join(this.dir, this.bundleDir)
    return fs.move(accountRepoDir, bundleDir)
  }

  cleanUpElementsAsync (elements) {
    const promises = []
    const join = path.join
    elements.forEach((tag) => {
      const elementPath = join(this.elementsPath, tag)
      promises.push(fs.remove(join(elementPath, '.git')))
      promises.push(fs.remove(join(elementPath, '.gitignore')))
      promises.push(fs.remove(join(elementPath, 'package.json')))
      promises.push(fs.remove(join(elementPath, 'webpack.config.js')))
      promises.push(fs.remove(join(elementPath, 'public', 'dist', 'vendor.bundle.js')))
      promises.push(fs.remove(join(elementPath, 'public', 'dist', '.gitkeep')))
      promises.push(fs.remove(join(elementPath, tag, 'settings.json')))
      promises.push(fs.remove(join(elementPath, tag, 'component.js')))
      promises.push(fs.remove(join(elementPath, tag, 'index.js')))
      promises.push(fs.remove(join(elementPath, tag, 'styles.css')))
      promises.push(fs.remove(join(elementPath, tag, 'editor.css')))
      promises.push(fs.remove(join(elementPath, tag, 'cssMixins')))
      promises.push(fs.remove(join(elementPath, tag, 'public', 'src')))
    })
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
    const accountRepoDir = path.join(this.dir, this.accountRepoDir)
    const bundleDir = path.join(this.dir, this.bundleDir)
    const promises = []
    promises.push(fs.remove(this.repoPath))
    promises.push(fs.remove(accountRepoDir))
    promises.push(fs.remove(bundleDir))
    return Promise.all(promises)
  }
}
module.exports = ElementsBuilder