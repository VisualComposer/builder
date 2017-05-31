const fs = require('fs-extra')
const path = require('path')
const http = require('http')
const lodash = require('lodash')

class BundleBuilder {
  constructor (dir) {
    Object.defineProperties(this, {
      /**
       * @property {String}
       * @name BundleBuilder#dir
       */
      'dir': {
        value: dir,
        writable: false
      }
    })
  }
  removeDir (removePath) {
    fs.removeSync(path.join(this.dir, removePath))
  }
  structurize (schema = []) {
    fs.ensureDirSync(this.dir)
    lodash.isArray(schema) && schema.forEach(p => { fs.ensureDirSync(path.join(this.dir, p))})
    return this
  }

  createJSON (data, name) {
    const jsonFile = path.join(this.dir, name + '.json')
    return new Promise((resolve, reject) => {
      fs.writeFile(jsonFile, JSON.stringify(data), (err) => {
        if (err) {
          reject(err)
        }
        resolve('jsFile created')
      })
    })
  }

  download (downloadList) {
    const promises = []
    Object.keys(downloadList).forEach((fileName) => {
      const url = downloadList[ fileName ]
      const p = new Promise((resolve, reject) => {
        const file = fs.createWriteStream(path.join(this.dir, fileName))
        http.get(url, function (response) {
          response.pipe(file);
          file.on('finish', function () {
            resolve('Download finished')
            file.close();
          })
        }).on('error', err => {
          reject(err);
        })
      })
      promises.push(p)
    })
    return Promise.all(promises)
  }
}
module.exports = BundleBuilder