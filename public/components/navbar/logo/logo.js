import React from 'react'
import PropTypes from 'prop-types'

export default class Logo extends React.Component {
  static propTypes = {
    editor: PropTypes.string
  }

  render () {
    let output = null

    output = (
      <a href={window.vcvGettingStartedUrl} target='_blank' className='vcv-ui-navbar-logo' title='Visual Composer Website Builder'>
        <span className='vcv-ui-navbar-logo-title'>Visual Composer Website Builder</span>
      </a>
    )

    if (typeof window.vcvIsPremiumActivated !== 'undefined' && window.vcvIsPremiumActivated) {
      output = (
        <span className='vcv-ui-navbar-logo vcv-ui-navbar-logo--no-click' title='Visual Composer Website Builder'>
          <span className='vcv-ui-navbar-logo-title'>Visual Composer Website Builder</span>
        </span>
      )
    }

    return output
  }
}
