const fs = require('fs-extra')
const path = require('path')

class BundleBuilder {
  constructor (dir) {
    Object.defineProperties(this, {
      'dir': {
        value: dir,
        writable: false
      }
    })
  }
  structurize () {
    fs.ensureDirSync(this.dir)
    return this
  }
  createJSON (data) {
    const buildFile = path.join(this.dir, 'build.json')
    fs.writeFile(buildFile, JSON.stringify(data), (err) => {
      if (err) throw err;
      console.log('The file has been saved!')
    })
  }
}
module.exports = BundleBuilder