import React from 'react'
import VCVLogo from './vcvLogo'
import VersionBox from './versionBox'

export default class FinalScreen extends React.Component {
  render () {
    return (
      <React.Fragment>
        <VCVLogo />
        <VersionBox />
        <div className='vcv-activation-heading'>
          <h2>Create your wordpress website.</h2>
          <h2>Any layout. Fast and easy.</h2>
        </div>
        <div>Parallax mouse move</div>
        <button>Create new page</button>
      </React.Fragment>
    )
  }
}
