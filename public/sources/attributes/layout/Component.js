/*eslint react/jsx-no-bind: "off"*/

import React from 'react'
import Attribute from '../attribute'
// import lodash from 'lodash'
import classNames from 'classnames'
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
        2 / 3,
        1 / 3
      ],
      [
        1 / 4,
        3 / 4
      ],
      [
        1 / 4,
        2 / 4,
        1 / 4
      ],
      [
        1 / 6,
        4 / 6,
        1 / 6
      ]
    ]
  }

  updateState (props) {
    return {
      activeLayout: 0,
      customLayout: '',
      value: this.props.value
    }
  }

  setActiveLayout = (index, e) => {
    this.setState({ activeLayout: parseInt(index) })
  }
  setCustomLayout = (e) => {
    this.setState({
      customLayout: e.target.value,
      activeLayout: -1
    })
  }

  render () {
    let { value } = this.state
    let layoutsData = []
    let layoutsKeys = 0
    let spansKeys = 0
    this.props.layouts.forEach((cols, index) => {
      layoutsKeys++
      let spans = []
      cols.forEach((col) => {
        spansKeys++
        spans.push(<span key={`layouts-${layoutsKeys}-span-${spansKeys}`} style={{ flex: col }} />)
      })
      let layoutClasses = classNames({
        'vcv-ui-form-layout-layouts-col': true,
        'vcv-ui-state--active': this.state.activeLayout === index
      })
      layoutsData.push(<div key={`layouts-${layoutsKeys}`} className={layoutClasses}
        onClick={this.setActiveLayout.bind(this, index)}>{spans}</div>)
    })
    return (
      <div className='vcv-ui-form-layout'>
        <span className='vcv-ui-form-layout-description'>Specify number of columns within row by choosing preset
or enter custom values. Extend row layout by customizing
responsiveness options and stacking order.
        </span>

        <div className='vcv-ui-form-layout-layouts'>
          {layoutsData}
        </div>
        <div className='vcv-ui-form-layout-custom-layout'>
          <input type='text' value={this.state.customLayout} onChange={this.setCustomLayout} />
        </div>
        {JSON.stringify(value)}
      </div>
    )
  }
}

export default Layout
