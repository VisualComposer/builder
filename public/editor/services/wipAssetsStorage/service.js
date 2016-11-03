import vcCake from 'vc-cake'
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
  elements: {}, // @AS
  columns: {}, // @AS

  /**
   * Set elements
   * @param elements
   */
  set (elements) { // @AS
    // todo: validate elements
    this.elements = elements
  },

  /**
   * Set custom css
   * @param value
   */
  setCustomCss (value) { // @AS
    customCss.data = value
  },

  /**
   * Get custom css data
   * @returns {*}
   */
  getCustomCss () { // @AS
    return customCss.data
  },

  /**
   * Set global css
   * @param value
   */
  setGlobalCss (value) { // @AS
    globalCss.data = value
  },

  /**
   * Get global css data
   * @returns {*}
   */
  getGlobalCss () { // @AS
    return globalCss.data
  },

  /**
   * Add element by id
   * @param id
   */
  add (id) { // @AS
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
  get (assetKey = false) { // @AS
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
  update (id, force = false) { // @AS
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
  remove (id) { // @AS
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
  setColumns (columns) { // @AS
    // todo: validate elements
    this.columns = columns
  },

  /**
   * add column
   * @param column
   */
  addColumn (column) { // @AS
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
  getColumn (assetKey = false) { // @AS
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
  removeColumn (column) { // @AS
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

  updateColumns () { // @AS
    // for this.get()
    for (let id in this.elements) {
      if (this.elements[ id ].columnSizes && this.elements[ id ].columnSizes.length) {
        this.addColumn(this.elements[ id ].columnSizes)
      }
    }
  }
})
