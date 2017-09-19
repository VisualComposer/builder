import React from 'react'
import EditFormFieldsForm from './editFormFieldsForm'
import Scrollbar from '../../../scrollbar/scrollbar.js'

export default class EditFormContent extends React.Component {

  scrollbar = null

  constructor (props) {
    super(props)
    this.getSectionContentScrollbar = this.getSectionContentScrollbar.bind(this)
  }

  getSectionContentScrollbar () {
    return this.scrollbar
  }

  render () {
    return (
      <div className='vcv-ui-tree-content-section'>
        <Scrollbar ref={(scrollbar) => { this.scrollbar = scrollbar }}>
          <div className='vcv-ui-tree-content-section-inner'>
            <div className='vcv-ui-editor-plates-container'>
              <div className='vcv-ui-editor-plates'>
                <div className='vcv-ui-editor-plate vcv-ui-state--active'>
                  <EditFormFieldsForm {...this.props} getSectionContentScrollbar={this.getSectionContentScrollbar} />
                </div>
              </div>
            </div>
          </div>
        </Scrollbar>
      </div>
    )
  }
}
