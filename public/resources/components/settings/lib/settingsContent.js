import React from 'react'
import SettingsCustomStyles from './settingsCustomStyles'
import Scrollbar from '../../../../resources/scrollbar/scrollbar.js'

export default class SettingsContent extends React.Component {
  render () {
    return (
      <div className='vcv-ui-tree-content-section'>
        <Scrollbar>
          <div className='vcv-ui-tree-content-section-inner'>
            <div className='vcv-ui-editor-plates-container'>
              <div className='vcv-ui-editor-plates'>
                <SettingsCustomStyles />
              </div>
            </div>
          </div>
        </Scrollbar>
      </div>
    )
  }
}

