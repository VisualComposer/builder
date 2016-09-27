import React from 'react'
import classNames from 'classnames'

class SettingsTab extends React.Component {

  render () {
    // let { title, active } = this.props

    let tabClasses = classNames({
      'vcv-ui-editor-tab': true,
      'vcv-ui-state--active': true
    })

    return (
      <a className={tabClasses} href='#'>
        <span className='vcv-ui-editor-tab-content'>
          <span>Custom CSS</span>
        </span>
      </a>
    )
  }
}

export default SettingsTab
