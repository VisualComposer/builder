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
      [ '100%' ],
      [ '50%', '50%' ],
      [ '33.33%', '33.33%', '33.33%' ],
      [ '25%', '25%', '25%', '25%' ],
      [ '20%', '20%', '20%', '20%', '20%' ],
      [ '16.66%', '16.66%', '16.66%', '16.66%', '16.66%', '16.66%' ],
      [ '66.66%', '33.34%' ],
      [ '25%', '75%' ],
      [ '25%', '50%', '25%' ],
      [ '16.66%', '66.66%', '16.66%' ]
    ],
    suggestions: [
      '100%',
      '50%',
      '33.33%',
      '25%',
      '20%',
      '16.66%',
      '66.66%',
      '75%'
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
  static devices = [ 'xs', 'sm', 'md', 'lg', 'xl' ]

  static buildMixins (data) {
    let layoutData = vcCake.getService('document').children(data.id)
        .map((element) => {
          return element.size || 'auto'
        })

    if (!layoutData) {
      return null
    }

    let newMixin = {}

    let columnGap = data.columnGap ? parseInt(data.columnGap) : 0
    let selector = `vce-row--col-gap-${columnGap}`

    Layout.devices.forEach((device) => {
      if (device === 'md' || device === 'xs') {
        let reducedLayout = []
        layoutData.forEach((col) => {
          if (reducedLayout.indexOf(col) < 0) {
            reducedLayout.push(col)
          }
        })

        reducedLayout.forEach((col, index) => {
          let mixinName = ''
          let fraction = ''
          if (col.indexOf('%') >= 0) {
            let numerator = parseFloat(col.replace('%', '').replace(',', '.'))
            fraction = [ numerator, 100 ]
          } else {
            fraction = col.split('/')
          }

          if (col !== 'auto') {
            mixinName = `${'columnStyleMixin'}:col${fraction[ 0 ]}/${fraction[ 1 ]}:gap${columnGap}:${device}`
          } else {
            mixinName = `${'columnStyleMixin'}:col${col}:gap${columnGap}:${device}`
          }

          if (device === 'xs') {
            mixinName = `${'columnStyleMixin'}:col1:xs`
          }
          // put index in the beginning of key to sort columns
          mixinName = `${Layout.devices.indexOf(device)}:${mixinName}`

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

  constructor (props) {
    super(props)
    this.setActiveLayout = this.setActiveLayout.bind(this)
    this.validateSize = this.validateSize.bind(this)
    this.reverseHandler = this.reverseHandler.bind(this)
  }

  updateState (props) {
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
        reverseColumn: reverseColumnState
      }
    }
  }

  setActiveLayout (layout) {
    this.setFieldValue(layout)
  }

  setFieldValue (value, reverseColumn) {
    let { updater, fieldKey } = this.props
    let reverseColumnState = reverseColumn !== undefined ? reverseColumn : this.state.value.reverseColumn
    updater(fieldKey, {
      layoutData: this.sanitizeLayout(value),
      reverseColumn: reverseColumnState
    })
    this.setState({
      value: {
        layoutData: value,
        reverseColumn: reverseColumnState
      }
    })
  }

  sanitizeLayout (value) {
    return value.filter((col) => {
      return this.validateSize(col)
    })
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
      return percentage >= 1 && percentage <= 100
    }
    return false
  }

  getReverseToggle () {
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
    value = this.state.value.layoutData
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
                    <p className='vcv-ui-form-helper'>Enter custom layout option for columns by using percentages, fractions or ‘auto’ value (ex. 50% + 50%; 1/3 + 1/3 + 1/3; auto + auto).</p>
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
