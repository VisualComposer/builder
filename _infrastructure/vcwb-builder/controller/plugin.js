const fs = require('fs-extra')
const path = require('path')
const exec = require('child_process').exec
const glob = require('glob')

class Plugin {
  constructor (dir, version, branch, isDev = false) {
    dir = path.resolve(path.join(dir || process.cwd()))
    if (!fs.lstatSync(dir).isDirectory()) {
      console.log('Can\'t create bundle. Wrong working directory.')
    }

    const bundlePath = path.join(dir, 'visualcomposer')
    const repoPath = path.join(__dirname, '..', '..', '..')
    Object.defineProperties(this, {
      /**
       * @property {String}
       * @name Builder#dir
       */
      dir: {
        value: dir,
        writable: true
      },
      /**
       * @property {String}
       * @name Builder#bundlePath
       */
      bundlePath: {
        value: bundlePath,
        writable: false
      },
      /**
       * @property {String}
       * @name Builder#repoPath
       */
      repoPath: {
        value: repoPath,
        writable: false
      },
      /**
       * @property {String}
       * @name Builder#version
       */
      version: {
        value: version,
        writable: false
      },
      /**
         * @property {String}
         * @name Builder#branch
         */
      branch: {
        value: branch,
        writable: false
      },
      /**
       * @property {String}
       * @name Builder#version
       */
      isDev: {
        value: isDev,
        writable: false
      },
      /**
       * @property {Array}
       * @name Builder#ignoreLibraries
       */
      ignoreLibraries: {
        value: [],
        writable: false
      }
    })
  }

  async execute (cmd, message = '') {
    if (message.length) {
      console.log(`\n${message}`)
    }
    const cmdPromise = new Promise(function (resolve, reject) {
      exec(cmd, (error, x, stderr) => {
        if (error || stderr) {
          console.warn(error || '', stderr)
          // reject()
        }
        resolve()
      })
    })
    return cmdPromise
  }

  cleanupAssetsLibraryJSON () {
    console.log('\nCleanup assetsLibraries json...')
    const fileJSON = `${this.bundlePath}/public/sources/assetsLibrary/assetsLibraries.json`
    const settings = fs.readJsonSync(fileJSON)
    const bundleJSON = { assetsLibrary: [] }
    if (settings && settings.assetsLibrary) {
      settings.assetsLibrary.forEach((lib) => {
        fs.removeSync(path.join(this.bundlePath, 'public/sources/assetsLibrary', lib.name, 'src'))
        fs.removeSync(path.join(this.bundlePath, 'public/sources/assetsLibrary', lib.name, 'webpack.config.babel.js'))
        if (this.isDev || this.ignoreLibraries.indexOf(lib.name) === -1) {
          bundleJSON.assetsLibrary.push(lib)
        } else {
          fs.removeSync(path.join(this.bundlePath, 'public/sources/assetsLibrary', lib.name))
        }
      })
    }
    fs.writeJsonSync(fileJSON, bundleJSON)
  }

  async cleanupElements () {
    console.log('\nClean up elements files...')
    const files = fs.readdirSync(path.join(this.repoPath, 'elements'))
    const cleanupPromises = []
    files.forEach((folderFile) => {
      const elementPath = path.join(this.bundlePath, 'elements', folderFile)
      if (fs.lstatSync(elementPath).isDirectory() && fs.lstatSync(path.join(elementPath, 'manifest.json')).isFile()) {
        console.log('\nCleaning up ', folderFile)
        cleanupPromises.concat(this.cleanupElementFiles(elementPath, folderFile))
      }
    })
    return Promise.all(cleanupPromises)
  }

  cleanupElementFiles (elementPath, tag) {
    const promises = []
    const join = path.join
    promises.push(fs.removeSync(join(elementPath, '.git')))
    promises.push(fs.removeSync(join(elementPath, '.idea')))
    promises.push(fs.removeSync(join(elementPath, '.gitignore')))
    promises.push(fs.removeSync(join(elementPath, 'node_modules')))
    promises.push(fs.removeSync(join(elementPath, 'ci')))
    promises.push(fs.removeSync(join(elementPath, 'package.json')))
    promises.push(fs.remove(join(elementPath, 'package-lock.json')))
    // promises.push(fs.remove(join(elementPath, 'manifest.json')))
    promises.push(fs.removeSync(join(elementPath, 'webpack.config.js')))
    promises.push(fs.removeSync(join(elementPath, 'webpack.config.production.js')))
    promises.push(fs.removeSync(join(elementPath, 'webpack.config.4x.babel.js')))
    promises.push(fs.removeSync(join(elementPath, 'webpack.config.4x.production.babel.js')))
    promises.push(fs.removeSync(join(elementPath, 'webpack.element.plugin.babel.js')))
    promises.push(fs.removeSync(join(elementPath, 'public', 'dist', 'vendor.bundle.js')))
    promises.push(fs.removeSync(join(elementPath, 'public', 'dist', 'runtime.bundle.js')))
    promises.push(fs.removeSync(join(elementPath, 'public', 'dist', '.gitkeep')))
    promises.push(fs.removeSync(join(elementPath, tag, 'settings.json')))
    promises.push(fs.removeSync(join(elementPath, tag, 'component.js')))
    promises.push(fs.removeSync(join(elementPath, tag, 'index.js')))
    promises.push(fs.removeSync(join(elementPath, tag, 'styles.css')))
    promises.push(fs.removeSync(join(elementPath, tag, 'editor.css')))
    promises.push(fs.removeSync(join(elementPath, tag, 'cssMixins')))
    promises.push(fs.removeSync(join(elementPath, tag, '__tests__')))
    promises.push(fs.removeSync(join(elementPath, '__tests__')))
    promises.push(fs.removeSync(join(elementPath, tag, 'public', 'src')))
    promises.push(fs.removeSync(join(elementPath, tag, 'tests')))
    promises.push(fs.removeSync(join(elementPath, tag, 'yarn.lock')))
    // promises.push(fs.remove(join(this.elementPath, this.tag, 'public', 'js')))
    let files = glob.sync(join(elementPath, '.*.yml'))
    if (files.length) {
      files.forEach((file, i) => {
        promises.push(fs.removeSync(file))
      })
    }
    files = glob.sync(join(elementPath, '*.json.gzip'))
    if (files.length) {
      files.forEach((file, i) => {
        promises.push(fs.removeSync(file))
      })
    }
    return promises
  }

  async cleanupFiles () {
    const bundlePath = this.bundlePath
    return this.execute('rm -f ' + bundlePath + '/cache/.gitkeep', 'cleanupFiles')
  }

  async copyFiles () {
    const bundlePath = this.bundlePath
    const repoPath = this.repoPath
    fs.ensureDirSync(path.join(bundlePath, 'public/dist/assets'))
    fs.ensureDirSync(path.join(bundlePath, 'public/sources'))
    this.isDev && fs.ensureDirSync(path.join(bundlePath, 'tests'))
    process.chdir(bundlePath)
    let copyTests = ''
    if (this.isDev) {
      copyTests = 'cp -fr ' + repoPath + '/tests/cypressConfig ./tests &' +
                  'cp -fr ' + repoPath + '/tests/cypressConfig/cypress ./tests &' +
                  'cp -fr ' + repoPath + '/tests/cypressChrome ./tests &' +
                  'cp -fr ' + repoPath + '/tests/cypressElectron ./tests &'
    }
    const copyTestsPhpE2e = this.isDev ? 'cp -fr ' + repoPath + '/tests/php-e2e-actions ./tests &' : ''
    return this.execute('cp -fr ' + repoPath + '/index.php ./ &' +
      'cp -fr ' + repoPath + '/env.php ./ &' +
      'cp -fr ' + repoPath + '/wpml-config.xml ./ &' +
      'cp -fr ' + repoPath + '/visualcomposer ./ &' +
      'cp -fr ' + repoPath + '/languages ./ &' +
      'cp -fr ' + repoPath + '/plugin-wordpress.php  ./ &' +
      'cp -fr ' + repoPath + '/vendor  ./ &' +
      'cp -fr ' + repoPath + '/bootstrap  ./ &' +
      'cp -fr ' + repoPath + '/cache  ./ &' +
      'cp -fr ' + repoPath + '/public/dist/pe.* ./public/dist/ &' +
      'cp -fr ' + repoPath + '/public/dist/wp.* ./public/dist/ &' +
      'cp -fr ' + repoPath + '/public/dist/wpbackendswitch.* ./public/dist/ &' +
      'cp -fr ' + repoPath + '/public/dist/wpbase.* ./public/dist/ &' +
      'cp -fr ' + repoPath + '/public/dist/vendor.* ./public/dist/ &' +
      'cp -fr ' + repoPath + '/public/dist/front.* ./public/dist/ &' +
      'cp -fr ' + repoPath + '/public/dist/wpVcSettings.* ./public/dist/ &' +
      'cp -fr ' + repoPath + '/public/dist/wpUpdate.* ./public/dist/ &' +
      'cp -fr ' + repoPath + '/public/dist/hub.* ./public/dist/ &' +
      'cp -fr ' + repoPath + '/public/dist/runtime.* ./public/dist/ &' +
      'cp -fr ' + repoPath + '/elements ./ &' +
      'cp -fr ' + repoPath + '/readme.txt ./ &' +
      copyTests +
      copyTestsPhpE2e +
      // JUST MOVE ALL fonts
      'cp -fr ' + repoPath + '/public/dist/assets ./public/dist/ &' +
      // 'cp -fr ' + repoPath + '/public/dist/images ./public/dist/ &' +
      'cp -fr ' + repoPath + '/public/sources/assetsLibrary ./public/sources &' +
      'rsync -r --exclude predefinedTemplates ' + repoPath + '/public/sources/images ' + bundlePath + '/public/sources/ &' +
      'rsync -r ' + repoPath + '/public/categories ./public ', 'Copying files...')
  }

  updateVersion () {
    console.log('\nUpdating version...')
    const version = this.version
    process.chdir(this.dir)
    if (version) {
      console.log('set version ' + version)
      const pluginsWordpressFilePath = path.join(this.bundlePath, 'plugin-wordpress.php')
      let pluginWordpressContent = fs.readFileSync(pluginsWordpressFilePath, 'utf8')
      pluginWordpressContent = pluginWordpressContent.replace(/(\s\*\sVersion:\s)(dev)/g, `$1${version}`)
      pluginWordpressContent = pluginWordpressContent.replace(/(define\('VCV_VERSION',\s')(dev)/g, `$1${version}`)
      fs.writeFileSync(pluginsWordpressFilePath, pluginWordpressContent)
    }
  }

  async installBuildProject () {
    process.chdir(this.repoPath)
    await this.execute('php ci/composer.phar install --no-dev --optimize-autoloader --no-interaction --quiet', 'Build project...')
    await this.execute('php tools/php-composer/cli.php', 'PHP CLI...')
    await this.execute('yarn build-production', 'Yarn build production...')
    await this.execute('bash ./tools/elements/buildProductionScript.sh', 'Build default elements...')
  }

  async build () {
    try {
      if (this.branch) {
        await this.execute(`git checkout ${this.branch}`)
      }
      await this.installBuildProject()
      await this.copyFiles()
      await this.cleanupElements()
      await this.cleanupFiles()
      this.updateVersion()
      this.cleanupAssetsLibraryJSON()
      await this.execute('zip -r ./visualcomposer.zip ./visualcomposer', 'Creating zip...')
      await this.finish()
    } catch (e) {
      console.warn(e)
      await this.finish()
      process.exit(1)
    }
  }

  async finish () {
    process.chdir(this.repoPath)
    await fs.remove(this.bundlePath, (error, x, stderr) => {
      if (error || stderr) {
        console.warn(error, stderr)
      }
    })
  }
}

module.exports = Plugin
