/* eslint react/jsx-no-bind: "off" */

import React from 'react'
import Attribute from '../attribute'
import _ from 'lodash'
import vcCake from 'vc-cake'
import './css/styles.less'
// import Toggle from '../toggle/Component'
// import String from '../string/Component'
import DefaultLayouts from './lib/defaultLayouts'
import TagList from './lib/tagList'

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
  findEqualDefaultProps (layout) {
    return this.props.layouts.findIndex((defaultLayout) => {
      return _.isEqual(layout, defaultLayout)
    })
  }
  updateState (props) {
    let layout = vcCake.getService('document').children(props.element.get('id')).map((element) => {
      return element.size || 'auto'
    })
    let index = this.findEqualDefaultProps(layout)
    return {
      activeLayout: index,
      customLayout: layout.join(' + '),
      value: layout
    }
  }

  setActiveLayout = (index) => {
    let layout = this.props.layouts[ index ].map((i) => i.toString())
    this.setState({
      customLayout: layout.join(' + '),
      activeLayout: index,
      value: layout
    })
    this.setFieldValue(layout)
  }
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
    return (
      <div className='vcv-ui-form-layout'>
        <span className='vcv-ui-form-layout-description'>Specify number of columns within row by choosing preset
or enter custom values. Extend row layout by customizing
responsiveness options and stacking order.
        </span>
        <DefaultLayouts layouts={this.props.layouts} activeLayout={this.state.activeLayout} onChange={this.setActiveLayout} />
        <div className='vcv-ui-form-layout-custom-layout'>
          <span className='vcv-ui-form-layout-description'>Custom row layout</span>
          <div className='vcv-ui-form-layout-custom-layout-columns'>
            <div className='vcv-ui-form-layout-custom-layout-col vcv-ui-form-layout-custom-layout-input-wrapper'>
              <div className='vcv-ui-form-layout-custom-layout-input'>
                <TagList value={this.state.customLayout} layouts={this.props.layouts} setLayout={this.findRelatedLayout} />
                <span className='vcv-ui-form-layout-description'>Enter custom layout option for columns by using fractions.
The total sum of fractions should be 1 (ex. 1/3 + 1/3 + 1/3)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Layout
