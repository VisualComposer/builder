import React from 'react'
import SettingsSection from './settingsSection'
import Scrollbar from '../../../../resources/scrollbar/scrollbar.js'

export default class SettingsContent extends React.Component {

  getSections () {
    return this.props.sections.map((section, key) => {
      let Component = section.content
      return (
        <SettingsSection title={section.title} key={key}>
          <Component />
        </SettingsSection>
      )
    })
  }

  render () {
    return (
      <div className='vcv-ui-tree-content-section'>
        <Scrollbar>
          <div className='vcv-ui-tree-content-section-inner'>
            <div className='vcv-ui-editor-plates-container'>
              <div className='vcv-ui-editor-plates'>
                <div className='vcv-ui-editor-plate vcv-ui-state--active'>
                  {this.getSections()}
                </div>
              </div>
            </div>
          </div>
        </Scrollbar>
      </div>
    )
  }
}

