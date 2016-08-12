import React from 'react'

class EditFormContent extends React.Component {
  static propTypes = {
    plateContent: React.PropTypes.element.isRequired
  }

  render () {
    return (
      <div className='vcv-ui-tree-content-section'>
        <div className='vcv-ui-scroll-container'>
          <div className='vcv-ui-scroll'>
            <div className='vcv-ui-scroll-content'>
              <div className='vcv-ui-tree-content-section-inner'>
                <div className='vcv-ui-editor-plates-container'>
                  <div className='vcv-ui-editor-plates'>
                    <div className='vcv-ui-editor-plate vcv-ui-state--active'>
                      {this.props.plateContent}
                    </div>
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

export default EditFormContent
