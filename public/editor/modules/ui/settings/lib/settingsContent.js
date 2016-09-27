import React from 'react'

class SettingsContent extends React.Component {
  render () {
    return (
      <div ref='scrollable' className='vcv-ui-tree-content-section'>
        <div className='vcv-ui-scroll-container'>
          <div className='vcv-ui-scroll'>
            <div className='vcv-ui-scroll-content'>
              <div className='vcv-ui-tree-content-section-inner'>
                <div className='vcv-ui-editor-plates-container'>
                  <div className='vcv-ui-editor-plates'>
                    Content
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
// SettingsContent.propTypes = {
//   api: React.PropTypes.object.isRequired,
//   elements: React.PropTypes.array.isRequired
// }

export default SettingsContent
