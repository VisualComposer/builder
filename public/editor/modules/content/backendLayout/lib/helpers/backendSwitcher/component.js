import React from 'react'
import '../../../../../../../sources/less/wpbackend/switcher/init.less'

export default class BackendSwitcher extends React.Component {
  render () {
    return <div className='vcv-wpbackend-switcher'>
      <span className='vcv-wpbackend-switcher-logo' />
      <a href={window.vcvFrontendEditorLink} className='vcv-wpbackend-switcher-option'>Frontend Editor</a>
    </div>
  }
}
