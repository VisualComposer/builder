import vcCake from 'vc-cake'

export default {
  rowLayout: {},
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
  getRowCss (device, data) {
    let rowCss = []

    for (let layout in this.rowLayout) {
      let defaultGap = ''
      let layoutObj = this.rowLayout[ layout ]
      let backgroundForDevice = layoutObj.background && layoutObj.background[ device ]
      let backgroundForAll = layoutObj.background && layoutObj.background.all
      let rowClass = ''

      // for background
      if (backgroundForDevice || backgroundForAll) {
        defaultGap = 0

        if (backgroundForAll) {
          rowClass = `.vce-row-layout--${device}_${layout}.vce-element--has-background > .vce-row-content > `
          rowCss.push(`.vce-row-layout--${device}_${layout}.vce-element--has-background > .vce-row-content > .vce-col > .vce-col-inner > .vce-col-content { padding-left: 15px; padding-right: 15px; }`)
        } else {
          rowClass = `.vce-row-layout--${device}_${layout}.vce-element--${device}--has-background > .vce-row-content > `
          rowCss.push(`.vce-row-layout--${device}_${layout}.vce-element--${device}--has-background > .vce-row-content > .vce-col > .vce-col-inner > .vce-col-content { padding-left: 15px; padding-right: 15px; }`)
        }
      } else {
        defaultGap = 30
        rowClass = `.vce-row-layout--${device}_${layout} > .vce-row-content > `
      }

      let columnGap = layoutObj.gap + defaultGap
      let colsInRow = []
      let cols = 0
      layoutObj.layout.forEach((col, index) => {
        if (col.lastInRow) {
          colsInRow.push(index + 1 - cols)
          cols = index + 1
        }
      })
      let rowIndex = 0

      layoutObj.layout.forEach((col, index) => {
        let columnIndex = index + 1
        let colNumerator = col.numerator
        let colDenominator = col.denominator

        let cssObj = {}

        let gapSpace = columnGap - (columnGap / colsInRow[ rowIndex ])

        if (col.value === 'auto') {
          cssObj[ 'flex' ] = 1
          cssObj[ 'flex-basis' ] = 'auto'
        } else {
          cssObj[ 'flex' ] = 0
          cssObj[ 'flex-basis' ] = `calc(100% * (${colNumerator} / ${colDenominator}) - ${gapSpace}px)`
          cssObj[ 'max-width' ] = `calc(100% * (${colNumerator} / ${colDenominator}) - ${gapSpace}px)`
        }

        // add margin-right if not last element
        if (!col.lastInRow) {
          cssObj[ 'margin-right' ] = `${columnGap}px`
        } else {
          rowIndex++
        }

        let css = ''

        for (let prop in cssObj) {
          css += prop + ':' + cssObj[ prop ] + ';'
        }

        rowCss.push(`${rowClass}.vce-col:nth-child(${columnIndex}) {${css}}`)
      })
    }
    return rowCss.join(' ')
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

    if (vcCake.env('FEATURE_CUSTOM_ROW_LAYOUT')) {
      for (let device in devices) {
        css.push('@media (--' + device + ') { ' + this.getRowCss(device, data) + ' }')
      }
    } else {
      for (let device in devices) {
        css.push('@media (--' + device + ') { ' + this.getDeviceCss(device, data) + ' }')
      }
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

  getLastInRow (columns) {
    let lastColumnIndex = []
    let rowValue = 0

    columns.forEach((col, index) => {
      let colValue = ''
      if (col === 'auto') {
        colValue = 0.001
      } else {
        let column = col.split('/')
        let numerator = column[ 0 ]
        let denominator = column[ 1 ]
        colValue = numerator / denominator
      }

      if (rowValue + colValue > 1) {
        lastColumnIndex.push(index - 1)
        rowValue = 0
      }

      if (!columns[ index + 1 ]) {
        lastColumnIndex.push(index)
      }

      rowValue += colValue
    })

    return lastColumnIndex
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

  updateRow (elements) {
    this.rowLayout = {}
    for (let id in elements) {
      if (elements[ id ].rowLayout && elements[ id ].rowLayout.length) {
        let layout = []

        for (let key in elements[ id ].rowLayout) {
          layout.push(elements[ id ].rowLayout[ key ].replace('/', '-'))
        }

        layout = layout.join('_')

        let colLayout = []

        elements[ id ].rowLayout.forEach((col) => {
          let fraction = col.split('/')
          colLayout.push({
            value: col,
            numerator: fraction[ 0 ],
            denominator: fraction[ 1 ],
            lastInRow: false
          })
        })

        let lastInRow = this.getLastInRow(elements[ id ].rowLayout)
        lastInRow.forEach((lastIndex) => {
          colLayout[ lastIndex ].lastInRow = true
        })

        let gapNumber = parseInt(elements[ id ].columnGap)
        let gap = typeof gapNumber === 'number' && gapNumber > 0 ? gapNumber : 0
        this.rowLayout[ layout ] = {
          layout: colLayout,
          gap: gap,
          background: elements[ id ].background
        }
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
    if (vcCake.env('FEATURE_CUSTOM_ROW_LAYOUT')) {
      this.updateRow(elements)
    }
    return this.columns
  }

}

