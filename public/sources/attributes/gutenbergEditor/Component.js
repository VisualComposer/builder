import React from 'react'
import { getService } from 'vc-cake'
import Attribute from '../attribute'

const dataProcessor = getService('dataProcessor')
/* Working prototype */
export default class Component extends Attribute {
  componentDidMount () {
    this.getEditor()
  }

  spinnerHTML () {
    return '<span class="vcv-ui-content-editable-helper-loader vcv-ui-wp-spinner"></span>'
  }

  // Dry
  loadFiles (data) {
    const assetsWindow = window
    if (data.domNodes && data.domNodes.length) {
      Array.from(data.domNodes).forEach(domNode => {
        let position = ''
        if (domNode.href) {
          position = 'head'
        } else if (domNode.src) {
          !data.ignoreCache && (position = 'body')
        } else if (domNode.id && domNode.type && domNode.type.indexOf('template') >= 0) {
          position = 'head'
        } else if (data.cacheInnerHTML) {
        }
        if (data.addToDocument) {
          if (position) {
            assetsWindow.document[ position ] && assetsWindow.jQuery(assetsWindow.document[ position ]).append(domNode)
          } else {
            data.ref && assetsWindow.jQuery(data.ref) && assetsWindow.jQuery(data.ref).append(domNode)
          }
        }
      })
    }
  }

  getEditor () {
    const { output } = this.state.value
    this.editorWrapper && (this.editorWrapper.innerHTML = this.spinnerHTML())
    this.ajax = dataProcessor.appAdminServerRequest({
      'vcv-action': 'attributes:ajaxGutenberg:adminNonce',
      'vcv-attribute-string': output,
      'vcv-nonce': window.vcvNonce,
      'vcv-source-id': window.vcvSourceID
    }).then((data) => {
      if (this.ajax && this.ajax.cancelled) {
        this.ajax = null
        return
      }
      let jsonData
      try {
        jsonData = JSON.parse(data)
      } catch (e) {
        console.warn('failed to parse json data', e, data)
      }
      try {
        const ref = this.editorWrapper
        const { headerContent, editorContent, footerContent } = jsonData
        ref && (ref.innerHTML = '')

        const headerDom = window.jQuery('<div>' + headerContent + '</div>', document)
        this.loadFiles({ type: 'header', ref: ref, domNodes: headerDom.children(), cacheInnerHTML: true, addToDocument: true })

        const editorDom = window.jQuery('<div>' + editorContent + '</div>', document)
        if (editorDom.children().length) {
          this.loadFiles({ type: 'shortcode', ref: ref, domNodes: editorDom.children(), addToDocument: true })
        }

        const footerDom = window.jQuery('<div>' + footerContent + '</div>', document)
        this.loadFiles({ type: 'footer', ref: ref, domNodes: footerDom.children(), addToDocument: true, ignoreCache: true })
      } catch (e) {
        console.warn('failed to parse json', e, jsonData)
      }
      this.ajax = null
    })
  }

  render () {
    let { value } = this.state
    return (
      <React.Fragment>
        <div className='vcv-ui-form-gutenberg' ref={(node) => { this.editorWrapper = node }} />
        <textarea className='vcv-ui-form-input' onChange={this.handleChange} value={value} />
      </React.Fragment>
    )
  }
}
