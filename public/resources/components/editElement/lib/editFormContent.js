import React from 'react'
import EditFormFieldsForm from './editFormFieldsForm'
import Scrollbar from '../../../scrollbar/scrollbar.js'

export default class EditFormContent extends React.Component {
  render () {
    return (
      <div className='vcv-ui-tree-content-section'>
        <Scrollbar>
          <div className='vcv-ui-tree-content-section-inner'>
            <div className='vcv-ui-editor-plates-container'>
              <div className='vcv-ui-editor-plates'>
                <div className='vcv-ui-editor-plate vcv-ui-state--active'>
                  <EditFormFieldsForm {...this.props} />
                </div>
              </div>
            </div>
          </div>
        </Scrollbar>
      </div>
    )
  }
}
