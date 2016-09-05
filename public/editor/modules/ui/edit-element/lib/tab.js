/* eslint react/jsx-no-bind:"off" */
import React from 'react'
import classNames from 'classnames'

export default class TreeContentTab extends React.Component {
  static propTypes = {
    changeTab: React.PropTypes.func.isRequired,
    data: React.PropTypes.object.isRequired,
    index: React.PropTypes.number.isRequired,
    isActive: React.PropTypes.bool.isRequired
  }

  render () {
    let { data, isActive } = this.props
    let title = data.settings.options.tabLabel || data.settings.options.label
    let tabClasses = classNames({
      'vcv-ui-editor-tab': true,
      'vcv-ui-state--active': isActive
    })

    return (
      <a className={tabClasses} href='javascript:;' onClick={this.props.changeTab.bind(this.props.index)}>
        <span className='vcv-ui-editor-tab-content'>
          <span>{title}</span>
        </span>
      </a>
    )
  }
}
