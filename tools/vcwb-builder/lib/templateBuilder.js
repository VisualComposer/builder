const _ = require('lodash')
const url = require('url')
const path = require('path')
const crypto = require('crypto')
const defaultTemplate = require('../sources/defaultTemplate')

class TemplateBuilder {
  constructor (data, name, descriptor, id) {
    Object.defineProperties(this, {
      /**
       * @property {String}
       * @name TemplateBuilder#name
       */
      'name': {
        value: name || '',
        writable: false
      },
      /**
       * @property {String}
       * @name TemplateBuilder#descriptor
       */
      'descriptor': {
        value: descriptor || '',
        writable: false
      },
      /**
       * @property {String}
       * @name TemplateBuilder#id
       */
      'id': {
        value: '' + id,
        writable: false
      },
      /**
       * @property {Object}
       * @name TemplateBuilder#template
       */
      'template': {
        value: { source: Object.assign({}, data), build: {} },
        writable: false
      },
      /**
       * @property {Object}
       * @name TemplateBuilder#downloadSources
       */
      'innerSources': {
        value: {},
        writable: false
      }
    })
  }

  /**
   * Build template object to use for adding to bundle.
   * @returns {TemplateBuilder}
   */
  build () {
    const templateToParse = Object.assign({}, this.getTemplateSource())
    const template = Object.assign({}, defaultTemplate)
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
  /**
   * Parse template object and remove meta data from elements.
   * @param data
   * @returns {*}
   */
  parseObj (data) {
    data = JSON.parse(JSON.stringify(data))
    if (_.isPlainObject(data)) {
      Object.keys(data).forEach((k) => {
        if (typeof k === 'string' && k !== 'metaCustomId' && k.match(/^meta.+/)) {
          delete data[ k ]
        } else {
          data[ k ] = this.parseObj(data[ k ])
        }
      })
    } else if (_.isArray(data)) {
      data.forEach((val, k) => {
        data[ k ] = this.parseObj(val)
      })
    } else {
      data = this.prepareValue(data)
    }
    return data
  }

  /**
   * Prepare value to store in settings json file. Update urls from absolute to relative.
   * @param data
   * @returns {*}
   */
  prepareValue (data) {
    if (typeof data === 'string' && data.match(/(jpg|gif|png)$/)) {
      const parsedUrl = url.parse(data)
      const ext = path.extname((parsedUrl.pathname))
      const fileName = 'assets/elements/' + crypto.createHash('md5').update(data).digest('hex') + ext
      this.innerSources[ fileName ] = data
      return fileName
    }
    return data
  }
}
module.exports = TemplateBuilder
