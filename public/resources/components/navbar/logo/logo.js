import React from 'react'
import { env } from 'vc-cake'

export default class Logo extends React.Component {
  static propTypes = {
    editor: React.PropTypes.string
  }

  render () {
    let output = null
    let utm = window.VCV_UTM()
    let url = utm && utm.beNavbarLinkLogo ? utm.beNavbarLinkLogo : 'https://visualcomposer.io/?utm_medium=backend-editor&utm_source=vcwb-navbar&utm_campaign=vcwb&utm_content=logo'
    if (this.props.editor === 'frontend') {
      url = utm && utm.feNavbarLinkLogo ? utm.feNavbarLinkLogo : 'https://visualcomposer.io/?utm_medium=frontend-editor&utm_source=vcwb-navbar&utm_campaign=vcwb&utm_content=logo'
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
