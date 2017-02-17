/* eslint react/jsx-no-bind: "off" */

import React from 'react'
import vcCake from 'vc-cake'
import lodash from 'lodash'

import Attribute from '../attribute'
import DefaultLayouts from './lib/defaultLayouts'
import TokenizationList from './lib/tokenizationList'

import './css/styles.less'

class Layout extends Attribute {
  static defaultProps = {
    layouts: [
      ['auto'],
      ['1/2', '1/2'],
      ['1/3', '1/3', '1/3'],
      ['1/4', '1/4', '1/4', '1/4'],
      ['1/5', '1/5', '1/5', '1/5', '1/5'],
      ['1/6', '1/6', '1/6', '1/6', '1/6', '1/6'],
      ['2/3', '1/3'],
      ['1/4', '3/4'],
      ['1/4', '2/4', '1/4'],
      ['1/6', '4/6', '1/6']
    ],
    suggestions: [
      'auto',
      '1/2',
      '1/3',
      '1/4',
      '1/5',
      '1/6',
      '2/3',
      '3/4'
    ]
  }
  static attributeMixins = {
    columnStyleMixin: {
      src: require('raw-loader!./cssMixins/columnStyles.pcss'),
      variables: {
        device: {
          value: false
        },
        colIndex: {
          value: false
        },
        selector: {
          value: false
        },
        numerator: {
          value: false
        },
        denominator: {
          value: false
        },
        columnGap: {
          value: false
        },
        gapSpace: {
          value: false
        },
        equalSpace: {
          value: false
        }
      }
    },
    lastColumnMixin: {
      src: require('raw-loader!./cssMixins/lastColumnStyles.pcss'),
      variables: {
        device: {
          value: false
        },
        lastIndex: {
          value: false
        }
      }
    }
  }
  static devices = ['xs', 'sm', 'md', 'lg', 'xl']

  constructor (props) {
    super(props)
    this.setActiveLayout = this.setActiveLayout.bind(this)
    this.validateSize = this.validateSize.bind(this)
  }
  updateState (props) {
    let layout = props.value instanceof Array && props.value.length
      ? props.value
      : vcCake.getService('document').children(props.element.get('id'))
      .map((element) => {
        return element.size || 'auto'
      })
    if (vcCake.env('FEATURE_CUSTOM_ROW_LAYOUT')) {
      return {
        value: {
          layoutData: layout,
          attributeMixins: this.getColumnMixins(this.sanitizeLayout(layout))
        }
      }
    } else {
      return {
        value: layout
      }
    }
  }
  setActiveLayout (layout) {
    this.setFieldValue(layout)
  }
  setFieldValue (value) {
    let { updater, fieldKey } = this.props
    if (vcCake.env('FEATURE_CUSTOM_ROW_LAYOUT')) {
      updater(fieldKey, {
        layoutData: this.sanitizeLayout(value),
        attributeMixins: this.getColumnMixins(this.sanitizeLayout(value))
      })
      this.setState({ value: { layoutData: value, attributeMixins: this.getColumnMixins(this.sanitizeLayout(value)) } })
    } else {
      updater(fieldKey, this.sanitizeLayout(value))
      this.setState({ value: value })
    }
  }
  sanitizeLayout (value) {
    return value.filter((col) => {
      return this.validateSize(col)
    })
  }
  getColumnMixins (layout) {
    let newMixin = {}
    let layoutString = []
    let rowBackground = vcCake.getService('document').get(this.props.element.get('id')).background
    let customGap = parseInt(vcCake.getService('document').get(this.props.element.get('id')).columnGap)
    let defaultGap = 30

    layout.forEach((col) => {
      layoutString.push(col.replace('/', '-'))
    })
    layoutString = layoutString.join('--')

    let selector = `vce-row--gap-${customGap}`

    let lastInRow = this.getLastInRow(layout)
    let colsInRow = []
    let cols = 0
    lastInRow.forEach((item) => {
      colsInRow.push(item + 1 - cols)
      cols = item + 1
    })

    Layout.devices.forEach((device) => {
      let deviceGap = defaultGap
      if (rowBackground && (rowBackground.all || rowBackground[ device ])) {
        deviceGap = 0
      }
      let columnGap = deviceGap + customGap

      let reducedLayout = []
      layout.forEach((col) => {
        if (reducedLayout.indexOf(col) < 0) {
          reducedLayout.push(col)
        }
      })

      reducedLayout.forEach((col, index) => {
        let mixinName = `${'columnStyleMixin'}:col${index}:${device}`
        let fraction = col.split('/')

        newMixin[ mixinName ] = lodash.defaultsDeep({}, Layout.attributeMixins.columnStyleMixin)
        newMixin[ mixinName ].variables.selector.value = selector
        newMixin[ mixinName ].variables.colIndex.value = index + 1
        newMixin[ mixinName ].variables.device.value = device

        if (col !== 'auto') {
          newMixin[ mixinName ].variables.numerator.value = fraction[ 0 ]
          newMixin[ mixinName ].variables.denominator.value = fraction[ 1 ]
        }

        newMixin[ mixinName ].variables.columnGap.value = columnGap
        let gapSpace = (columnGap * (parseInt(fraction[ 1 ]) - 1)).toString()
        let equalSpace = (columnGap * (parseInt(fraction[ 0 ]) - 1)).toString()

        newMixin[ mixinName ].variables.gapSpace.value = gapSpace
        newMixin[ mixinName ].variables.equalSpace.value = equalSpace
      })

      if (columnGap > 0) {
        lastInRow.forEach((col) => {
          let mixinName = `${'lastColumnMixin'}:lastCol${col + 1}:${device}`
          newMixin[ mixinName ] = lodash.defaultsDeep({}, Layout.attributeMixins.lastColumnMixin)
          newMixin[ mixinName ].variables.device.value = device
          newMixin[ mixinName ].variables.lastIndex.value = col + 1
        })
      }
    })
    // console.log(newMixin)
    return newMixin
  }
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
  }
  validateSize (text) {
    if (text === 'auto') {
      return true
    }
    let fractionRegex = /^(\d+)\/(\d+)$/

    if (fractionRegex.test(text)) {
      // test if fraction is less than 1
      let results = fractionRegex.exec(text)
      let numerator = parseInt(results[ 1 ])
      let denominator = parseInt(results[ 2 ])
      return numerator <= denominator
    }
    return false
  }
  render () {
    let value = ''
    if (vcCake.env('FEATURE_CUSTOM_ROW_LAYOUT')) {
      value = this.state.value.layoutData
    } else {
      value = this.state.value
    }
    return (
      <div className='vcv-ui-form-layout'>
        <span className='vcv-ui-form-layout-description'>Specify number of columns within row by choosing preset
or enter custom values. Extend row layout by customizing
responsiveness options and stacking order.
        </span>
        <DefaultLayouts layouts={this.props.layouts} value={this.sanitizeLayout(value)} onChange={this.setActiveLayout} />
        <div className='vcv-ui-form-layout-custom-layout'>
          <span className='vcv-ui-form-group-heading'>Custom row layout</span>
          <div className='vcv-ui-form-layout-custom-layout-columns'>
            <div className='vcv-ui-form-layout-custom-layout-col vcv-ui-form-layout-custom-layout-input-wrapper'>
              <div className='vcv-ui-form-layout-custom-layout-input'>
                <TokenizationList
                  layouts={this.props.layouts}
                  value={value.join(' + ')}
                  onChange={this.setActiveLayout}
                  validator={this.validateSize}
                  suggestions={this.props.suggestions}
                />
                <p className='vcv-ui-form-helper'>Enter custom layout option for columns by using fractions.
The total sum of fractions should be 1 (ex. 1/3 + 1/3 + 1/3)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Layout
