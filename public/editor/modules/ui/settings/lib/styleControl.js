import React from 'react'

class StyleControl extends React.Component {
  render () {
    return (
      <div className='vcv-ui-style-control-container'>
        <button className='vcv-ui-style-control vcv-ui-style-control-active'>Local CSS</button>
        <button className='vcv-ui-style-control'>Global CSS</button>
      </div>
    )
  }
}

export default StyleControl
