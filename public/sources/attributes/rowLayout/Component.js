/* eslint react/jsx-no-bind: "off" */

import React from 'react'
import vcCake from 'vc-cake'
import _ from 'lodash'

import Attribute from '../attribute'
import DefaultLayouts from './lib/defaultLayouts'
import TokenizedList from './lib/tokenizedList'

import './css/styles.less'

class Layout extends Attribute {
  static defaultProps = {
    layouts: [
      [
        'auto' // 100%
      ],
      [
        'auto', // 50%
        'auto' // 50%
      ],
      [
        'auto', // 33%
        'auto',
        'auto'
      ],
      [
        'auto', // 25%
        'auto',
        'auto',
        'auto'
      ],
      [
        'auto', // 20%
        'auto',
        'auto',
        'auto',
        'auto'
      ],
      [
        'auto', // 16.666%
        'auto',
        'auto',
        'auto',
        'auto',
        'auto'
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
  updateState (props) {
    let layout = vcCake.getService('document').children(props.element.get('id')).map((element) => {
      return element.size || 'auto'
    })
    return {
      value: layout
    }
  }
  setActiveLayout = (layout = []) => {
    this.setFieldValue(layout)
  }
  setFieldValue = (value) => {
    let { updater, fieldKey } = this.props
    updater(fieldKey, _.compact(value))
    this.setState({ value: value })
  }
  /*
  setCustomLayout = (layout) => {
    let index = this.findEqualDefaultProps(layout)
    this.setState({
      activeLayout: index,
      value: layout
    })
    this.setFieldValue(layout)
  }

  findRelatedLayout = (tagList) => {
    let activeLayout = tagList.map((column) => column.tagText.toString()).join(' + ')

    this.props.layouts.map((layout, index) => {
      let currentLayout = layout.map((i) => i.toString()).join(' + ')

      if (currentLayout === activeLayout) {
        // console.log("index", index)
      }
    })
  }
  */
  render () {
    if (!vcCake.env('FEATURE_ROW_LAYOUT')) {
      return null
    }
    /*
     <div className='vcv-ui-form-layout-custom-layout-col'>
     <Toggle key={'k' + this.props.fieldKey + 'toggle-1'} value={false}
     fieldKey={this.props.fieldKey + 'toggle-1'} /><span>Reverse column stacking</span>
     </div>

     <Toggle key={'k' + this.props.fieldKey + 'toggle-2'} value={false}
     fieldKey={this.props.fieldKey + 'toggle-2'} />
     */
    /*
     <TagList value={this.state.customLayout} layouts={this.props.layouts} setLayout={this.findRelatedLayout} onChange={this.setCustomLayout} />
     */
    return (
      <div className='vcv-ui-form-layout'>
        <span className='vcv-ui-form-layout-description'>Specify number of columns within row by choosing preset
or enter custom values. Extend row layout by customizing
responsiveness options and stacking order.
        </span>
        <DefaultLayouts layouts={this.props.layouts} value={this.state.value} onChange={this.setActiveLayout} />
        <div className='vcv-ui-form-layout-custom-layout'>
          <span className='vcv-ui-form-group-heading'>Custom row layout</span>
          <div className='vcv-ui-form-layout-custom-layout-columns'>
            <div className='vcv-ui-form-layout-custom-layout-col vcv-ui-form-layout-custom-layout-input-wrapper'>
              <div className='vcv-ui-form-layout-custom-layout-input'>
                <TokenizedList value={this.state.value.join(' + ')} onChange={this.setActiveLayout} />
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
