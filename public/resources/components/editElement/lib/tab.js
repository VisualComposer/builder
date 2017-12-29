/* eslint react/jsx-no-bind:"off" */
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

export default class Tab extends React.Component {
  static propTypes = {
    changeTab: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    isActive: PropTypes.bool.isRequired
  }

  render () {
    let { data, isActive } = this.props
    let title = data.settings.options.tabLabel || data.settings.options.label
    let tabClasses = classNames({
      'vcv-ui-editor-tab': true,
      'vcv-ui-state--active': isActive
    })

    return (
      <span ref='domComponent' className={tabClasses} onClick={this.props.changeTab.bind(this.props.index)}>
        <span className='vcv-ui-editor-tab-content'>
          <span>{title}</span>
        </span>
      </span>
    )
  }
}
