const fs = require('fs-extra')
const path = require('path')
const terminalOutput = require('./tools/terminalOutput')
const executer = require('./tools/executer')
class UpdateEditorBundleBuilder {
  constructor (dir, repo, settings) {
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
       * @name ElementsBuilder#repo
       */
      'repo': {
        value: repo,
        writable: false
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
       * @name ElementsBuilder#bundleDir
       */
      'bundleDir': {
        value: `vcwb-editor-bundle-${+new Date()}`,
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
      },
      /**
       * @property {String}
       * @name ElementsBuilder#bundleData
       */
      'bundleData': {
        enumerable: false,
        configurable: false,
        value: {},
        writable: true
      },
      'settings': {
        value: settings,
        writable: false
      }
    })
  }

  build (version, commit, callback) {
    // Clone
    terminalOutput.startSpinner()
    terminalOutput.addEventsToProcess(this.removeRepoDirsAsync.bind(this))
    terminalOutput.consoleSeparator('Clone repository')
    executer.clone(this.repo, this.repoPath, commit).then(() => {
      //
      terminalOutput.consoleSeparator('Build project')
      executer.exec('npm install && npm run build-production', { cwd: this.repoPath }).then(() => {
        // Copy files
        terminalOutput.consoleSeparator('Copy files')
        this.copyEditorsFilesAsync().then(() => {
          // Create zip
          terminalOutput.consoleSeparator('Create zip')
          this.createZipArchiveAsync(version).then(()=> {
            this.removeRepoDirsAsync().then(() => {
              terminalOutput.stopSpinner()
              callback && callback()
            })
          })
        })
      })
    })
  }
  copyEditorsFilesAsync () {
    const promises = []
    const join = path.join
    const distPath = join(this.repoPath, 'public', 'dist')
    const bundleEditorPath = join(this.bundlePath, 'editor')
    const assets = [
      'pe.bundle.css',
      'pe.bundle.js',
      'wp.bundle.css',
      'wp.bundle.js',
      'wpbackend.bundle.css',
      'wpbackend.bundle.js',
      'wpbackendswitch.bundle.css',
      'wpbackendswitch.bundle.js',
      'front.bundle.js',
      'fonts',
      'images'
    ]
    assets.forEach((asset) => {
      promises.push(fs.copy(join(distPath, asset), join(bundleEditorPath, asset)))
    })
    return Promise.all(promises)
  }
  createZipArchiveAsync (version) {
    const bundleZipPath = path.join(this.dir, `editors-${version || 0.1}.bundle.zip`)
    return executer.exec(`cd ${this.bundlePath} && zip -r ${bundleZipPath} ./*`)
  }

  removeRepoDirsAsync () {
    const promises = []
    promises.push(fs.remove(this.repoPath))
    promises.push(fs.remove(this.bundlePath))
    return Promise.all(promises)
  }
}
module.exports = UpdateEditorBundleBuilder