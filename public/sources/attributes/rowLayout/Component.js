/* eslint-disable import/no-webpack-loader-syntax */
/* eslint react/jsx-no-bind: "off" */

import React from 'react'
import vcCake from 'vc-cake'
import lodash from 'lodash'

import Attribute from '../attribute'
import DefaultLayouts from './lib/defaultLayouts'
import TokenizationList from './lib/tokenizationList'
import Toggle from '../toggle/Component'

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
        spaceForColumn: {
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
    const disableStacking = data && data.layout && data.layout.hasOwnProperty('disableStacking') ? data.layout.disableStacking : false

    Layout.devices.forEach((device) => {
      // TODO: Simplify IF
      if ((device === 'md' || (device === 'xs' && (!disableStacking || !vcCake.env('DISABLE_COLUMN_STACKING')))) || (device === 'xs' && disableStacking)) {
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
            if (!disableStacking) {
              mixinName = `${'columnStyleMixin'}:col1:xs`
            }
          }
          // put index in the beginning of key to sort columns
          mixinName = `${Layout.devices.indexOf(device)}:${mixinName}`

          newMixin[ mixinName ] = lodash.defaultsDeep({}, Layout.attributeMixins.columnStyleMixin)
          newMixin[ mixinName ].variables.selector.value = selector
          newMixin[ mixinName ].variables.device.value = device

          if (device === 'xs') {
            if (!disableStacking) {
              newMixin[ mixinName ].variables.fullColumn.value = true
            }
          }
          const percentages = (fraction[ 0 ] / fraction[ 1 ] * 100).toFixed(2)
          const spaceForColumn = (columnGap - (columnGap * (parseFloat(percentages) / 100))).toString()

          if (col !== 'auto') {
            if (col.indexOf('%') >= 0) {
              newMixin[ mixinName ].variables.percentageSelector.value = col.replace('%', '').replace(',', '-').replace('.', '-')
            } else {
              newMixin[ mixinName ].variables.numerator.value = fraction[ 0 ]
              newMixin[ mixinName ].variables.denominator.value = fraction[ 1 ]
            }
            newMixin[ mixinName ].variables.percentage.value = percentages
          } else {
            newMixin[ mixinName ].variables.autoColumn.value = true
          }
          newMixin[ mixinName ].variables.columnGap.value = columnGap.toString()
          newMixin[ mixinName ].variables.spaceForColumn.value = (Math.round(spaceForColumn * 100) / 100).toFixed(2)
        })
      }
    })
    return newMixin
  }

  constructor (props) {
    super(props)
    this.setActiveLayout = this.setActiveLayout.bind(this)
    this.validateSize = this.validateSize.bind(this)
    this.valueChangeHandler = this.valueChangeHandler.bind(this)
  }

  updateState (props) {
    let layout = props.value && props.value.layoutData instanceof Array && props.value.layoutData.length
      ? props.value.layoutData
      : vcCake.getService('document').children(props.element.get('id'))
        .map((element) => {
          return element.size || 'auto'
        })
    let reverseColumnState = props.value && props.value.reverseColumn ? props.value.reverseColumn : false
    let disableStackingState = props.value && props.value.disableStacking ? props.value.disableStacking : false
    return {
      value: {
        layoutData: layout,
        reverseColumn: reverseColumnState,
        disableStacking: disableStackingState
      }
    }
  }

  setActiveLayout (layout) {
    let newState = lodash.defaultsDeep({}, this.state.value)
    newState.layoutData = layout
    this.setFieldValue(newState)
  }

  setFieldValue (value) {
    let { updater, fieldKey } = this.props
    let { layoutData, ...rest } = value

    updater(fieldKey, {
      layoutData: this.sanitizeLayout(layoutData),
      ...rest
    })
    this.setState({
      value: value
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
    let data = this.state.value
    if (data && data.disableStacking) {
      if (vcCake.env('DISABLE_COLUMN_STACKING')) {
        return null
      }
    }
    let reverseState = data && data.hasOwnProperty('reverseColumn') ? data.reverseColumn : false
    return (
      <div className='vcv-ui-form-layout-reverse-column-toggle'>
        <Toggle
          api={this.props.api}
          fieldKey={'reverseColumn'}
          updater={this.valueChangeHandler}
          options={{ labelText: 'Reverse column stacking' }}
          value={reverseState}
        />
      </div>
    )
  }

  valueChangeHandler (fieldKey, value) {
    let newState = lodash.defaultsDeep({}, this.state.value)
    newState[ fieldKey ] = value
    this.setFieldValue(newState)
  }

  getStackingToggle () {
    if (!vcCake.env('DISABLE_COLUMN_STACKING')) {
      return null
    }
    let data = this.state.value
    let disableStackingState = data && data.hasOwnProperty('disableStacking') ? data.disableStacking : false
    return (
      <div className='vcv-ui-form-layout-disable-stacking-toggle'>
        <Toggle
          api={this.props.api}
          fieldKey={'disableStacking'}
          updater={this.valueChangeHandler}
          options={{ labelText: 'Disable column stacking' }}
          value={disableStackingState}
        />
      </div>
    )
  }

  render () {
    let { layoutData } = this.state.value
    return (
      <div className='vcv-ui-form-layout'>
        <span className='vcv-ui-form-layout-description'>Specify number of columns within row by choosing preset
or enter custom values. Extend row layout by customizing
responsiveness options and stacking order.
        </span>
        <DefaultLayouts layouts={this.props.layouts} value={this.sanitizeLayout(layoutData)}
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
                      value={layoutData.join(' + ')}
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
              <div className='vcv-ui-form-group'>
                {this.getStackingToggle()}
              </div>
              <div className='vcv-ui-form-group'>
                {this.getReverseToggle()}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Layout
