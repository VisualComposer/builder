import React from 'react'
import classnames from 'classnames'
import Attribute from '../attribute'
import GutenbergModal from './gutenbergModal'

/* Working prototype */
export default class Component extends Attribute {
  openEditor (e) {
    e.preventDefault()
    this.setState({ showEditor: true })
  }

  closeEditor () {
    this.setState({ showEditor: false })
  }

  render () {
    let { value, showEditor } = this.state
    const editor = () => {
      if (showEditor) {
        const closeClasses = classnames({
          'vcv-layout-bar-content-hide-icon': true,
          'vcv-ui-icon': true,
          'vcv-ui-icon-close-thin': true
        })
        const iframeURL = window.ajaxurl
        return (
          <GutenbergModal>
            <i onClick={this.closeEditor.bind(this)} className={closeClasses} style={{ color: '#000' }} />
            <iframe src={iframeURL} />
          </GutenbergModal>
        )
      }
    }
    return (
      <div>
        <button className='vcv-ui-form-button vcv-ui-form-button--default' onClick={this.openEditor.bind(this)}>
          Open Gutenberg
        </button>
        <textarea className='vcv-ui-form-input' onChange={this.handleChange} value={value} />
        {editor()}
      </div>
    )
  }
}
