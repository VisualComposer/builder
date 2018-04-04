import React from 'react'
import classnames from 'classnames'
import Attribute from '../attribute'
import GutenbergModal from './gutenbergModal'

/* Working prototype */
export default class Component extends Attribute {
  constructor (props) {
    super(props)
    this.openEditor = this.openEditor.bind(this)
    this.iframeLoaded = this.iframeLoaded.bind(this)
    this.updateValueFromIframe = this.updateValueFromIframe.bind(this)
  }
  openEditor (e) {
    e.preventDefault()
    this.setState({ showEditor: true })
  }

  closeEditor () {
    this.setState({ showEditor: false })
  }

  iframeLoaded (e) {
    const wpData = document.getElementById('vcv-gutenberg-attribute-modal-iframe').contentWindow.wp.data
    wpData.subscribe(this.updateValueFromIframe.bind(this))
  }
  updateValueFromIframe () {
    const wpData = document.getElementById('vcv-gutenberg-attribute-modal-iframe').contentWindow.wp.data
    const value = wpData.select('core/editor').getEditedPostContent()
    this.setFieldValue(value)
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
        const iframeURL = '/wp-admin/post-new.php?post_type=page' // change with action
        return (
          <GutenbergModal>
            <i onClick={this.closeEditor.bind(this)} className={closeClasses} style={{ color: '#000', position: 'fixed', top: '12px', right: '12px' }} />
            <iframe id='vcv-gutenberg-attribute-modal-iframe' src={iframeURL} style={{ width: '100%', height: '100%' }} onLoad={this.iframeLoaded} />
          </GutenbergModal>
        )
      }
    }
    return (
      <React.Fragment>
        <button className='vcv-ui-form-button vcv-ui-form-button--default' onClick={this.openEditor}>
          Open Gutenberg
        </button>
        <textarea className='vcv-ui-form-input' onChange={this.handleChange} value={value} />
        {editor()}
      </React.Fragment>
    )
  }
}
