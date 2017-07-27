const execFile = require('child-process-promise').exec
const fs = require('fs-extra')
const path = require('path')
const terminalOutput = require('./tools/terminalOutput')
const executer = require('./tools/executer')

class UpdateAssetsLibrariesBundleBuilder {
  constructor (dir, settings) {
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

  build (version, callback) {
    // Create files
    terminalOutput.startSpinner()
    terminalOutput.addEventsToProcess(this.removeRepoDirsAsync.bind(this))
    terminalOutput.consoleSeparator('Copy files')
    this.copyFiles().then(() => {
      terminalOutput.consoleSeparator('Create zip archive')
      this.createZipArchiveAsync(version).then(() => {
        this.removeRepoDirsAsync().then(() => {
          callback && callback()
          terminalOutput.stopSpinner()
        })
      })
    })
  }

  copyFiles () {
    fs.ensureDirSync(this.bundleDir)
    const join = path.join
    const jsonFilename = 'assetsLibrary.bundle.json'
    const prebuildDir = join(__dirname, '..', 'sources', 'bundlePrebuild', 'assetsLibrary')
    const prebuildJSON = join(__dirname, '..', 'sources', 'bundlePrebuild', jsonFilename)
    const bundleDir = join(this.dir, this.bundleDir)
    return Promise.all(
      [ fs.copy(prebuildDir, join(bundleDir, 'assetsLibraries')),
        fs.copy(prebuildJSON, join(bundleDir, 'bundle.json')) ])
  }

  createZipArchiveAsync (version) {
    const bundleZipPath = path.join(this.dir, `assetsLibrary-${version || 0.1}.bundle.zip`)
    return executer.exec(`cd ${this.bundlePath} && zip -r ${bundleZipPath} ./*`)
  }

  removeRepoDirsAsync () {
    const promises = []
    promises.push(fs.remove(this.bundlePath))
    return Promise.all(promises)
  }
}

module.exports = UpdateAssetsLibrariesBundleBuilder