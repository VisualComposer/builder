const lodash = require('lodash')
const defautTemplate = require('./defaultTemplate')
class TemplateBuilder {
  constructor (data, name, descriptor, id) {
    Object.defineProperties(this, {
      'name': {
        value: name || '',
        writable: false
      },
      'descriptor': {
        value: descriptor || '',
        writable: false
      },
      'id': {
        value: '' + (id || +new Date),
        writable: false
      },
      'template': {
        value: { source: Object.assign({}, data), build: {} },
        writable: false
      },
      'downloadSources': {
        value: [],
        writable: false
      }
    })
  }

  build () {
    const templateToParse = Object.assign({}, this.getTemplateSource())
    const template = Object.assign({}, defautTemplate)
    template.id = this.id
    template.name = this.name
    template.description = this.descriptor
    template.data = this.parseObj(templateToParse)
    this.setBuildTemplate(template)
    return this
  }
  setBuildTemplate (data) {
    this.template.build = data
  }

  getTemplateSource () {
    return this.template.source
  }
  getBuildTemplate () {
    return this.template.build
  }
  parseObj (data) {
    data = JSON.parse(JSON.stringify(data))
    if (lodash.isPlainObject(data)) {
      Object.keys(data).forEach((k) => {
        if (typeof k === 'string' && k !== 'metaCustomId' && k.match(/^meta.+/)) {
          delete data[ k ]
        } else {
          data[ k ] = this.parseObj(data[ k ])
        }
      })
    } else if (lodash.isArray(data)) {
      data.forEach((val, k) => {
        data[ k ] = this.parseObj(val)
      })
    } else {
      data = this.prepareValue(data)
    }
    return data
  }

  prepareValue (data) {
    if (typeof data === 'string' && data.match(/^http/)) {
      this.downloadSources.push(data)
    }
  }
}
module.exports = TemplateBuilder
