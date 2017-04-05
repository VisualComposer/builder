import React from 'react'
import {env} from 'vc-cake'

export default class startBlank extends React.Component {
  render () {
    if (env('FEATURE_START_BLANK')) {
      return (
        <div className='vcv-start-blank-container'>
          <div className='vcv-start-blank-heading-container'>
            <span className='vcv-blank-page-heading'>Select Blank Canvas or Start With a Template</span>
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}
