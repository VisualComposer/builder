const execFile = require('child-process-promise').exec
const fs = require('fs-extra')
const path = require('path')
const terminalOutput = require('./tools/terminalOutput')
const executer = require('./tools/executer')

class UpdateElementBundleBuilder {
  constructor (tag, dir, settings) {
    Object.defineProperties(this, {
      /**
       * @property {String}
       * @name UpdateElementBundleBuilder#dir
       */
      'dir': {
        value: dir,
        writable: false
      },
      /**
       * @property {String}
       * @name UpdateElementBundleBuilder#tag
       */
      'tag': {
        value: tag,
        writable: false
      },
      /**
       * @property {String}
       * @name UpdateElementBundleBuilder#bundleDir
       */
      'bundleDir': {
        value: `vcwb-bundle-${+new Date()}`,
        writable: false
      },
      /**
       * @property {String}
       * @name UpdateElementBundleBuilder#bundleDir
       */
      'bundlePath': {
        get: () => {
          return path.join(this.dir, this.bundleDir)
        }
      },
      /**
       * @property {String}
       * @name UpdateElementBundleBuilder#bundleData
       */
      'bundleData': {
        enumerable: false,
        configurable: false,
        value: {},
        writable: true
      },
      /**
       * @property {Object}
       * @name ElementsBuilde#settings
       */
      'settings': {
        value: settings,
        writable: false
      },
      /**
       * @property {String}
       * @name UpdateElementBundleBuilder#elementPath
       */
      'elementPath': {
        get: () => {
          return path.join(this.bundlePath, 'elements', this.tag)
        }
      },
    })
  }

  build (version, callback) {
    terminalOutput.startSpinner()
    terminalOutput.addEventsToProcess(this.removeRepoDirsAsync.bind(this))
    fs.ensureDirSync(this.elementPath)
    terminalOutput.consoleSeparator('Clone repo')
    executer.clone(`git@gitlab.com:visualcomposer-hub/${this.tag}.git`, this.elementPath).then(() => {
      terminalOutput.consoleSeparator('Build project')
      executer.exec('npm install && npm build', {
        cwd: this.elementPath
      }).then(() => {
        terminalOutput.consoleSeparator('Create bundle file')
        this.createBundleFileAsync().then(() => {
          terminalOutput.consoleSeparator('Cleanup elements dir')
          this.cleanUpElementsAsync().then(() => {
            terminalOutput.consoleSeparator('Create zip archive')
            this.createZipArchiveAsync(version).then(() => {
              this.removeRepoDirsAsync().then(() => {
                callback && callback()
                terminalOutput.stopSpinner()
              })
            })
          })
        })

      })
    })

  }
  cleanUpElementsAsync () {
    const promises = []
    const join = path.join
    promises.push(fs.remove(join(this.elementPath, '.git')))
    promises.push(fs.remove(join(this.elementPath, '.gitignore')))
    promises.push(fs.remove(join(this.elementPath, 'node_modules')))
    promises.push(fs.remove(join(this.elementPath, 'package.json')))
    promises.push(fs.remove(join(this.elementPath, 'package-lock.json')))
    promises.push(fs.remove(join(this.elementPath, 'manifest.json')))
    promises.push(fs.remove(join(this.elementPath, 'webpack.config.js')))
    promises.push(fs.remove(join(this.elementPath, 'public', 'dist', 'vendor.bundle.js')))
    promises.push(fs.remove(join(this.elementPath, 'public', 'dist', '.gitkeep')))
    promises.push(fs.remove(join(this.elementPath, this.tag, 'settings.json')))
    promises.push(fs.remove(join(this.elementPath, this.tag, 'component.js')))
    promises.push(fs.remove(join(this.elementPath, this.tag, 'index.js')))
    promises.push(fs.remove(join(this.elementPath, this.tag, 'styles.css')))
    promises.push(fs.remove(join(this.elementPath, this.tag, 'editor.css')))
    promises.push(fs.remove(join(this.elementPath, this.tag, 'cssMixins')))
    promises.push(fs.remove(join(this.elementPath, this.tag, 'public', 'src')))
    return Promise.all(promises)
  }
  createBundleFileAsync () {
    const manifestData = fs.readJSONSync(path.join(this.elementPath, 'manifest.json'))
    return fs.writeJSON(path.join(this.bundlePath, 'bundle.json'), manifestData)
  }
  createZipArchiveAsync (version) {
    const bundleZipPath = path.join(this.dir, `element-${this.tag}-${version || 0.1}.bundle.zip`)
    return executer.exec(`cd ${this.bundlePath} && zip -r ${bundleZipPath} ./*`)
  }

  removeRepoDirsAsync () {
    const promises = []
    promises.push(fs.remove(this.bundlePath))
    return Promise.all(promises)
  }
}

module.exports = UpdateElementBundleBuilder