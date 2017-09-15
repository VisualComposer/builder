import React from 'react'

export default class Logo extends React.Component {
  static propTypes = {
    editor: React.PropTypes.string
  }

  render () {
    let utm = window.VCV_UTM()
    let url = utm && utm.beNavbarLinkLogo ? utm.beNavbarLinkLogo : 'https://visualcomposer.io/?utm_campaign=vcwb&utm_source=vc-wb-navbar&utm_medium=vc-wb-backend'
    if (this.props.editor === 'frontend') {
      url = utm && utm.feNavbarLinkLogo ? utm.feNavbarLinkLogo : 'https://visualcomposer.io/?utm_campaign=vcwb&utm_source=vc-wb-navbar&utm_medium=vc-wb-frontend'
    }

    return (
      <a href={url} target='_blank' className='vcv-ui-navbar-logo' title='Visual Composer Website Builder'>
        <span className='vcv-ui-navbar-logo-title'>Visual Composer Website Builder</span>
      </a>
    )
  }
}
