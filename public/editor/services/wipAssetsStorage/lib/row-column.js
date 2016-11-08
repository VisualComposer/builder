export default {
  columns: {},

  devices: {
    'xs': {
      min: '0',
      max: '543px' // mobile-landscape.min - 1
    },
    'sm': {
      min: '544px',
      max: '767px' // tablet-portrait.min - 1
    },
    'md': {
      min: '768px',
      max: '991px' // tablet-landscape.min - 1
    },
    'lg': {
      min: '992px',
      max: '1199px' // desktop.min - 1
    },
    'xl': {
      min: '1200px',
      max: null
    }
  },
  getDevices () {
    return this.devices
  },
  getDeviceCss (device, data) {
    let deviceCss = []

    for (let key in data) {
      let cssObj = {}
      // get background color
      cssObj[ 'flex-grow' ] = 0
      cssObj[ 'flex-shrink' ] = 0
      cssObj[ 'flex-basis' ] = 'calc(100% * ( ' + data[ key ].numerator + ' / ' + data[ key ].denominator + ' ))'
      cssObj[ 'max-width' ] = 'calc(100% * ( ' + data[ key ].numerator + ' / ' + data[ key ].denominator + ' ))'
      let css = ''
      for (let prop in cssObj) {
        css += prop + ':' + cssObj[ prop ] + ';'
      }
      deviceCss.push('.vce-col--' + device + '-' + data[ key ].numerator + '-' + data[ key ].denominator + '{' + css + '}')
    }
    return deviceCss.join(' ')
  },
  getCss (data) {
    let css = []
    let devices = this.getDevices()
    for (let device in devices) {
      css.push('@media (--' + device + ') { ' + this.getDeviceCss(device, data) + ' }')
    }
    return css.join(' ')
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
   * Update columns data
   * @param elements
   */
  updateColumns (elements) {
    this.columns = {}
    for (let id in elements) {
      if (elements[ id ].columnSizes && elements[ id ].columnSizes.length) {
        this.addColumn(elements[ id ].columnSizes)
      }
    }
  },

  /**
   * Get columns by elements
   * @param elements
   * @returns {columns|{}}
   */
  getColumnsByElements (elements) {
    this.updateColumns(elements)
    return this.columns
  }

}

