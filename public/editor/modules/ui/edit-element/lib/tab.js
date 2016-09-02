import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import vcCake from 'vc-cake'

const Utils = vcCake.getService('utils')

export default class TreeContentTab extends React.Component {
  static propTypes = {
    changeTab: React.PropTypes.func.isRequired,
    data: React.PropTypes.object.isRequired,
    index: React.PropTypes.number.isRequired,
    getContainer: React.PropTypes.func.isRequired,
    activeTabIndex: React.PropTypes.number.isRequired
  }
  realWidth = null

  getRealWidth () {
    if (this.realWidth === null) {
      this.realWidth = Utils.getRealWidth(ReactDOM.findDOMNode(this), this.props.getContainer())
    }

    return this.realWidth
  }

  onClick = () => {
    this.props.changeTab(this.props.index)
  }

  render () {
    let { data } = this.props
    let title = data.settings.options.tabLabel || data.settings.options.label
    let active = this.props.activeTabIndex === this.props.index
    let tabClasses = classNames({
      'vcv-ui-editor-tab': true,
      'vcv-ui-state--active': active
    })

    return (
      <a className={tabClasses} href='javascript:;' onClick={this.onClick}>
        <span className='vcv-ui-editor-tab-content'>
          <span>{title}</span>
        </span>
      </a>
    )
  }
}
