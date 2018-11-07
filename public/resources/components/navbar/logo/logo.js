import React from 'react'
import PropTypes from 'prop-types'

export default class Logo extends React.Component {
  static propTypes = {
    editor: PropTypes.string
  }

  render () {
    let output = null

    output = (
      <a href={window.vcvGoPremiumUrlLogo} target='_blank' className='vcv-ui-navbar-logo' title='Visual Composer Website Builder'>
        <span className='vcv-ui-navbar-logo-title'>Visual Composer Website Builder</span>
      </a>
    )

    if (typeof window.vcvIsPremium !== 'undefined' && window.vcvIsPremium) {
      output = (
        <span className='vcv-ui-navbar-logo vcv-ui-navbar-logo--no-click' title='Visual Composer Website Builder'>
          <span className='vcv-ui-navbar-logo-title'>Visual Composer Website Builder</span>
        </span>
      )
    }

    return output
  }
}
