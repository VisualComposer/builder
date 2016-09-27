import React from 'react'
import StyleControl from './styleControl'
import StyleEditor from './styleEditor'

class SettingsCustomStyles extends React.Component {

  render () {
    return (
      <div className='vcv-ui-custom-styles'>
        <StyleControl />
        <StyleEditor />
      </div>
    )
  }
}

// SettingsCustomStyles.propTypes = {
//   api: React.PropTypes.object.isRequired,
//   elements: React.PropTypes.array.isRequired
// }

export default SettingsCustomStyles
