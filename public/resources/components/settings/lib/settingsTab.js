import React from 'react'
import classNames from 'classnames'

export default class SettingsTab extends React.Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired
  }
  render () {
    let { title } = this.props
    let tabClasses = classNames({
      'vcv-ui-editor-tab': true,
      'vcv-ui-state--active': true
    })

    return (
      <a className={tabClasses} href='#'>
        <span className='vcv-ui-editor-tab-content'>
          <span>{title}</span>
        </span>
      </a>
    )
  }
}
