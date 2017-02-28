/* eslint react/jsx-no-bind: "off" */

import React from 'react'
import vcCake from 'vc-cake'
import lodash from 'lodash'

import Attribute from '../attribute'
import DefaultLayouts from './lib/defaultLayouts'
import TokenizationList from './lib/tokenizationList'
import Toggle from '../toggle/Component'

import './css/styles.less'

class Layout extends Attribute {
  static defaultProps = {
    layouts: [
      [ 'auto' ],
      [ '1/2', '1/2' ],
      [ '1/3', '1/3', '1/3' ],
      [ '1/4', '1/4', '1/4', '1/4' ],
      [ '1/5', '1/5', '1/5', '1/5', '1/5' ],
      [ '1/6', '1/6', '1/6', '1/6', '1/6', '1/6' ],
      [ '2/3', '1/3' ],
      [ '1/4', '3/4' ],
      [ '1/4', '2/4', '1/4' ],
      [ '1/6', '4/6', '1/6' ]
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
        },
        fullColumn: {
          value: false
        },
        autoColumn: {
          value: false
        },
        percentage: {
          value: false
        },
        percentageSelector: {
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
    this.reverseHandler = this.reverseHandler.bind(this)
  }
  updateState (props) {
    if (vcCake.env('FEATURE_CUSTOM_ROW_LAYOUT')) {
      let layout = props.value && props.value.layoutData instanceof Array && props.value.layoutData.length
        ? props.value.layoutData
        : vcCake.getService('document').children(props.element.get('id'))
          .map((element) => {
            return element.size || 'auto'
          })
      let reverseColumnState = props.value && props.value.reverseColumn ? props.value.reverseColumn : false
      return {
        value: {
          layoutData: layout,
          attributeMixins: this.getColumnMixins(this.sanitizeLayout(layout)),
          reverseColumn: reverseColumnState
        }
      }
    } else {
      let layout = props.value instanceof Array && props.value.length
        ? props.value
        : vcCake.getService('document').children(props.element.get('id'))
          .map((element) => {
            return element.size || 'auto'
          })

      return {
        value: layout
      }
    }
  }
  setActiveLayout (layout) {
    this.setFieldValue(layout)
  }
  setFieldValue (value, reverseColumn) {
    let { updater, fieldKey } = this.props
    if (vcCake.env('FEATURE_CUSTOM_ROW_LAYOUT')) {
      let reverseColumnState = reverseColumn !== undefined ? reverseColumn : this.state.value.reverseColumn
      let colMixinData = this.getColumnMixins(this.sanitizeLayout(value))
      updater(fieldKey, {
        layoutData: this.sanitizeLayout(value),
        attributeMixins: colMixinData,
        reverseColumn: reverseColumnState
      })
      this.setState({ value: { layoutData: value, attributeMixins: colMixinData, reverseColumn: reverseColumnState } })
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
    let columnGap = vcCake.getService('document').get(this.props.element.get('id')).columnGap
    columnGap = columnGap ? parseInt(columnGap) : 0
    let selector = `vce-row--col-gap-${columnGap}`

    Layout.devices.forEach((device) => {
      if (device === 'md' || device === 'xs') {
        let reducedLayout = []
        layout.forEach((col) => {
          if (reducedLayout.indexOf(col) < 0) {
            reducedLayout.push(col)
          }
        })

        reducedLayout.forEach((col, index) => {
          let mixinName = `${'columnStyleMixin'}:col${index}:${device}`
          let fraction = ''
          if (col.indexOf('%') >= 0) {
            let numerator = parseFloat(col.replace('%', '').replace(',', '.'))
            fraction = [numerator, 100]
          } else {
            fraction = col.split('/')
          }

          newMixin[ mixinName ] = lodash.defaultsDeep({}, Layout.attributeMixins.columnStyleMixin)
          newMixin[ mixinName ].variables.selector.value = selector
          newMixin[ mixinName ].variables.device.value = device

          if (device === 'xs') {
            newMixin[ mixinName ].variables.fullColumn.value = true
          }
          let gapSpace = (columnGap * (parseFloat(fraction[ 1 ]) - 1)).toString()
          let equalSpace = (columnGap * (parseFloat(fraction[ 0 ]) - 1)).toString()

          if (col !== 'auto') {
            if (col.indexOf('%') >= 0) {
              newMixin[ mixinName ].variables.percentageSelector.value = col.replace('%', '').replace(',', '-').replace('.', '-')
            } else {
              newMixin[ mixinName ].variables.numerator.value = fraction[ 0 ]
              newMixin[ mixinName ].variables.denominator.value = fraction[ 1 ]
            }
            newMixin[ mixinName ].variables.percentage.value = fraction[ 0 ] / fraction[ 1 ]
          } else {
            newMixin[ mixinName ].variables.autoColumn.value = true
          }
          newMixin[ mixinName ].variables.columnGap.value = columnGap.toString()
          newMixin[ mixinName ].variables.gapSpace.value = gapSpace
          newMixin[ mixinName ].variables.equalSpace.value = equalSpace
        })
      }
    })
    return newMixin
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

    let percentageRegex = /^(\d+)([,.]\d+)?%/
    if (percentageRegex.test(text)) {
      // test if percentage is more than 1 and less than 100
      let percentage = parseFloat(text.replace('%', '').replace(',', '.'))
      return percentage > 1 && percentage <= 100
    }
    return false
  }
  getReverseToggle () {
    if (!vcCake.env('FEATURE_CUSTOM_ROW_LAYOUT')) {
      return null
    }

    return (
      <div className='vcv-ui-form-layout-reverse-column-toggle'>
        <Toggle
          api={this.props.api}
          fieldKey={'reverseColumnStacking'}
          updater={this.reverseHandler}
          options={{ labelText: 'Reverse column stacking' }}
          value={this.state.value.reverseColumn}
        />
      </div>
    )
  }
  reverseHandler (fieldKey, value) {
    this.setFieldValue(this.state.value.layoutData, value)
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
        <DefaultLayouts layouts={this.props.layouts} value={this.sanitizeLayout(value)}
          onChange={this.setActiveLayout} />
        <div className='vcv-ui-form-layout-custom-layout'>
          <span className='vcv-ui-form-group-heading'>Custom row layout</span>
          <div className='vcv-ui-row vcv-ui-row-gap--md'>
            <div className='vcv-ui-col vcv-ui-col--md-6'>
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
            <div className='vcv-ui-col vcv-ui-col--md-6'>
              {this.getReverseToggle()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Layout
