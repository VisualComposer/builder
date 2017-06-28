/* global console */
const exec = require('child-process-promise').exec
const execFile = require('child-process-promise').exec
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
        value: `elements`,
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
        value: `vcwb-builder-${+new Date()}`,
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
        value: `vcwb-account-${+new Date()}`,
        writable: false
      },
      /**
       * @property {String}
       * @name ElementsBuilder#bundleDir
       */
      'bundleDir': {
        value: `vcwb-bundle-${+new Date()}`,
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
        value: {},
        writable: true
      }
    })
  }

  build (elements, commit, callback) {
    console.log('Cloning repositories...')
    Promise.all([ this.cloneRepoAsync(commit), this.cloneAccountRepoAsync() ]).then(() => {
      console.log('Cloning elements repos and copy bundle files')
      Promise.all([ this.copyFilesAsync(), this.cloneElementsReposAsync(elements) ]).then(() => {
        console.log('Building VCWB...')
        Promise.all([ this.readBundleJSONFileAsync(), this.buildVCWB() ]).then(() => {
          this.updateBundlDataWithVersion('0.3')
          console.log('Building elements and copying files from bundle pre-build to a new package directory...')
          this.buildElementsAsync(elements).then(() => {
            console.log('Copy editor files and cleaning up elements...')
            Promise.all([ this.updateBundleDataWithElementsSettingsAsync(elements), this.copyEditorsFilesAsync(), this.cleanUpElementsAsync(elements) ]).then(() => {
              this.copyElementsFilesAsync().then(() => {
                this.updateBundleJSONFileAsync().then(() => {
                  this.createZipArchiveAsync().then(this.removeRepoDirsAsync.bind(this))
                })
                callback()
              })
            })
          })
        })
      })
    })
  }

  exec (cmd, options = {}) {
    const promise = execFile(cmd, options).catch((result) => {console.log(result)})
    /*    const childProcess = promise.childProcess

     childProcess.stdout.on('data', function (data) {
     console.log(data.toString())
     })
     childProcess.stderr.on('data', function (data) {
     console.log(data.toString())
     })*/
    return promise
  }

  clone (repo, path, commit) {
    console.log(`Cloning ${repo}...`)
    let cloneCMD = `git clone --depth 1 ${repo} ${path}`
    if (commit) {
      cloneCMD = `git clone ${repo} ${path} && cd ${path} && git reset --hard ${commit}`
    }
    return this.exec(cloneCMD)
  }

  cloneRepoAsync (commit) {
    return this.clone(this.repo, this.repoPath, commit)
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
    const distPath = join(this.repoPath, 'public', 'dist')
    const bundleEditorPath = join(this.bundlePath, 'editor')
    fs.ensureDirSync(bundleEditorPath)
    promises.push(fs.copy(join(distPath, 'pe.bundle.css'), bundleEditorPath))
    promises.push(fs.copy(join(distPath, 'pe.bundle.js'), bundleEditorPath))
    promises.push(fs.copy(join(distPath, 'wp.bundle.css'), bundleEditorPath))
    promises.push(fs.copy(join(distPath, 'wp.bundle.js'), bundleEditorPath))
    promises.push(fs.copy(join(distPath, 'wpbackend.bundle.css'), bundleEditorPath))
    promises.push(fs.copy(join(distPath, 'wpbackend.bundle.js'), bundleEditorPath))
    promises.push(fs.copy(join(distPath, 'wpbackendswitch.bundle.css'), bundleEditorPath))
    promises.push(fs.copy(join(distPath, 'wpbackendswitch.bundle.js'), bundleEditorPath))
    promises.push(fs.copy(join(distPath, 'front.bundle.js'), bundleEditorPath))
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

  copyElementsFilesAsync () {
    return fs.move(this.elementsPath, this.bundlePath)
  }

  readBundleJSONFileAsync () {
    const jsFile = path.join(this.bundlePath, 'bundle.json')
    return fs.readJson(jsFile).then((data) => {
      this.bundleData = data
    })
  }

  updateBundleDataWithElementsSettingsAsync (elements) {
    const promises = []
    elements.forEach((tag) => {
      const elementSettingsPath = path.join(this.elementsPath, tag, 'settings.json')
      promises.push(fs.readJSON(elementSettingsPath).then((data) => {
        this.bundleData.elements.push(data)
      }))
    })
    return Promise.all(promises)
  }
  updateBundleJSONFileAsync () {
    const jsFile = path.join(this.bundlePath, 'bundle.json')
    return fs.writeJson(jsFile, this.bundleData)
  }
  updateBundlDataWithVersion (version = '0.2') {
    this.bundleData.editor = version
  }

  createZipArchiveAsync () {
    const bundleZipPath = path.join(this.dir, 'bundle.zip')
    return this.exec(`cd ${this.bundlePath} && zip zip -r ${bundleZipPath} ./*`)
  }
  removeRepoDirsAsync () {
    console.log('Removing temp directories...')
    const accountRepoDir = path.join(this.dir, this.accountRepoDir)
    const promises = []
    promises.push(fs.remove(this.repoPath))
    promises.push(fs.remove(accountRepoDir))
    promises.push(fs.remove(this.bundlePath))
    return Promise.all(promises)
  }
}
module.exports = ElementsBuilder