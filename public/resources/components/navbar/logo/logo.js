import React from 'react'
import { env } from 'vc-cake'

export default class Logo extends React.Component {
  static propTypes = {
    editor: React.PropTypes.string
  }

  render () {
    let output = null
    let url = window.vcvGoPremiumUrlLogo + '&vcv-ref=logoBackend'
    if (this.props.editor === 'frontend') {
      url = window.vcvGoPremiumUrlLogo + '&vcv-ref=logoFrontend'
    }

    output = (
      <a href={url} target='_blank' className='vcv-ui-navbar-logo' title='Visual Composer Website Builder'>
        <span className='vcv-ui-navbar-logo-title'>Visual Composer Website Builder</span>
      </a>
    )

    if (env('FE_LOGO_LINK_PREMIUM')) {
      if (typeof window.vcvIsPremium !== 'undefined' && window.vcvIsPremium) {
        output = (
          <span className='vcv-ui-navbar-logo vcv-ui-navbar-logo--no-click' title='Visual Composer Website Builder'>
            <span className='vcv-ui-navbar-logo-title'>Visual Composer Website Builder</span>
          </span>
        )
      }
    }

    return output
  }
}
