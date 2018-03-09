import React from 'react'
import EditFormFieldsForm from './editFormFieldsForm'
import Scrollbar from '../../../scrollbar/scrollbar.js'

export default class EditFormContent extends React.Component {
  scrollbar = null

  constructor (props) {
    super(props)
    this.state = {
      scrollbar: null
    }
    this.scrollBarMounted = this.scrollBarMounted.bind(this)
  }

  scrollBarMounted (scrollbar) {
    this.setState({ scrollbar: scrollbar })
  }

  render () {
    return (
      <div className='vcv-ui-tree-content-section'>
        <Scrollbar ref={this.scrollBarMounted}>
          <div className='vcv-ui-tree-content-section-inner'>
            <div className='vcv-ui-editor-plates-container'>
              <div className='vcv-ui-editor-plates'>
                <div className='vcv-ui-editor-plate vcv-ui-state--active'>
                  <EditFormFieldsForm {...this.props} sectionContentScrollbar={this.state.scrollbar} />
                </div>
              </div>
            </div>
          </div>
        </Scrollbar>
      </div>
    )
  }
}
