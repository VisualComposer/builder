/* eslint react/jsx-no-bind: "off" */

import React from 'react'
import vcCake from 'vc-cake'

import Attribute from '../attribute'
import DefaultLayouts from './lib/defaultLayouts'
import TokenizationList from './lib/tokenizationList'

import './css/styles.less'

class Layout extends Attribute {
  static defaultProps = {
    layouts: [
      [
        'auto' // 100%
      ],
      [
        '1/2', // 50%
        '1/2' // 50%
      ],
      [
        '1/3', // 33%
        '1/3',
        '1/3'
      ],
      [
        '1/4', // 25%
        '1/4',
        '1/4',
        '1/4'
      ],
      [
        '1/5', // 20%
        '1/5',
        '1/5',
        '1/5',
        '1/5'
      ],
      [
        '1/6', // 16.666%
        '1/6',
        '1/6',
        '1/6',
        '1/6',
        '1/6'
      ],
      [
        '2/3',
        '1/3'
      ],
      [
        '1/4',
        '3/4'
      ],
      [
        '1/4',
        '2/4',
        '1/4'
      ],
      [
        '1/6',
        '4/6',
        '1/6'
      ]
    ]
  }
  constructor (props) {
    super(props)
    this.setActiveLayout = this.setActiveLayout.bind(this)
    this.validateSize = this.validateSize.bind(this)
  }
  updateState (props) {
    let layout = vcCake.getService('document').children(props.element.get('id')).map((element) => {
      return element.size || 'auto'
    })
    return {
      value: layout
    }
  }
  setActiveLayout (layout) {
    this.setFieldValue(layout)
  }
  setFieldValue (value) {
    let { updater, fieldKey } = this.props
    updater(fieldKey, this.sanitizeLayout(value))
    this.setState({ value: value })
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
      return numerator <= 12 && denominator <= 12 && numerator <= denominator
    }
    return false
  }
  render () {
    if (!vcCake.env('FEATURE_ROW_LAYOUT')) {
      return null
    }
    return (
      <div className='vcv-ui-form-layout'>
        <span className='vcv-ui-form-layout-description'>Specify number of columns within row by choosing preset
or enter custom values. Extend row layout by customizing
responsiveness options and stacking order.
        </span>
        <DefaultLayouts layouts={this.props.layouts} value={this.sanitizeLayout(this.state.value)} onChange={this.setActiveLayout} />
        <div className='vcv-ui-form-layout-custom-layout'>
          <span className='vcv-ui-form-group-heading'>Custom row layout</span>
          <div className='vcv-ui-form-layout-custom-layout-columns'>
            <div className='vcv-ui-form-layout-custom-layout-col vcv-ui-form-layout-custom-layout-input-wrapper'>
              <div className='vcv-ui-form-layout-custom-layout-input'>
                <TokenizationList layouts={this.props.layouts} value={this.state.value.join(' + ')} onChange={this.setActiveLayout} validator={this.validateSize} />
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
