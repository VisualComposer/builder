import vcCake from 'vc-cake'
import lodash from 'lodash'

import CustomCss from './lib/customCss'
import GlobalCss from './lib/globalCss'
const customCss = new CustomCss()
const globalCss = new GlobalCss()

vcCake.addService('wipAssetsStorage', {
  /**
   * Up-to-date list of all elements
   *
   * @param {Object}
   */
  elements: {},
  columns: {},

  /**
   * Set elements
   * @param elements
   */
  set (elements) {
    // todo: validate elements
    this.elements = elements
  },

  /**
   * Set custom css
   * @param value
   */
  setCustomCss (value) {
    customCss.data = value
  },

  /**
   * Get custom css data
   * @returns {*}
   */
  getCustomCss () {
    return customCss.data
  },

  /**
   * Set global css
   * @param value
   */
  setGlobalCss (value) {
    globalCss.data = value
  },

  /**
   * Get global css data
   * @returns {*}
   */
  getGlobalCss () {
    return globalCss.data
  },

  /**
   * Add element by id
   * @param id
   */
  add (id) {
    let ids = []
    if (Array.isArray(id)) {
      ids = id
    } else {
      ids.push(id)
    }
    ids.forEach((id) => {
      if (!this.get(id)) {
        this.update(id, true)
      }
    })
  },

  /**
   * Get element by id
   * @param assetKey
   * @returns {*}
   */
  get (assetKey = false) {
    if (!assetKey) {
      return this.elements
    }
    if (typeof this.elements[ assetKey ] === 'undefined') {
      return null
    }
    return this.elements[ assetKey ]
  },

  /**
   * Update element by id
   * @param id
   */
  update (id, force = false) {
    let ids = []
    if (Array.isArray(id)) {
      ids = id
    } else {
      ids.push(id)
    }
    ids.forEach((id) => {
      if (this.get(id) || force) {
        this.elements[ id ] = id
      }
    })
  },

  /**
   * Remove element by id
   * @param id
   */
  remove (id) {
    let ids = []
    if (Array.isArray(id)) {
      ids = id
    } else {
      ids.push(id)
    }
    ids.forEach((id) => {
      if (!this.get(id)) {
        return
      }
      delete this.elements[ id ]
    })
  },

  /**
   * Set columns
   * @param columns
   */
  setColumns (columns) {
    // todo: validate elements
    this.columns = columns
  },

  /**
   * add column
   * @param column
   */
  addColumn (column) {
    let columns = []
    if (Array.isArray(column)) {
      columns = column
    } else {
      columns.push(column)
    }
    let validFormat = /^\d+\/\d+$/
    columns.forEach((column) => {
      if (validFormat.test(column)) {
        if (!this.getColumn(column)) {
          let data = column.split('/')
          if (data[ 0 ] <= data[ 1 ]) {
            this.columns[ column ] = {
              numerator: data[ 0 ],
              denominator: data[ 1 ],
              count: 1
            }
          }
        } else {
          this.columns[ column ].count++
        }
      }
    })
  },

  /**
   * Get column
   * @param assetKey
   * @returns {*}
   */
  getColumn (assetKey = false) {
    if (!assetKey) {
      return this.columns
    }
    if (typeof this.columns[ assetKey ] === 'undefined') {
      return null
    }
    return this.columns[ assetKey ]
  },

  /**
   * Remove column
   * @param column
   */
  removeColumn (column) {
    let columns = []
    if (Array.isArray(column)) {
      columns = column
    } else {
      columns.push(column)
    }
    columns.forEach((column) => {
      if (!this.getColumn(column)) {
        return
      }
      this.columns[ column ].count--
      if (this.columns[ column ].count < 1) {
        delete this.columns[ column ]
      }
    })
  },

  updateColumns () {
    // for this.get()
    for (let id in this.elements) {
      if (this.elements[ id ].columnSizes && this.elements[ id ].columnSizes.length) {
        this.addColumn(this.elements[ id ].columnSizes)
      }
    }
  },

  /**
   * Get all used elements tags
   * @returns {{}}
   */
  getTags () {
    let tags = {}
    for (let id in this.elements) {
      let elementTags = this.elements[ id ].tags
      lodash.merge(tags, elementTags)
    }
    return tags
  },

  /**
   * Get all used element tags as array
   * @returns {Array}
   */
  getTagsList () {
    return Object.keys(this.getTags())
  }
})
