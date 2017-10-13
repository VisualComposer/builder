import React from 'react'
import vcCake from 'vc-cake'
import HtmlLayout from './htmlLayout'
import Combokeys from 'combokeys'

const workspaceStorage = vcCake.getStorage('workspace')
const elementsStorage = vcCake.getStorage('elements')
const wordpressDataStorage = vcCake.getStorage('wordpressData')
const historyStorage = vcCake.getStorage('history')

export default class LayoutEditor extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      data: []
    }
    this.updateIframeBodyOffset = this.updateIframeBodyOffset.bind(this)
  }

  updateIframeBodyOffset (iframe) {
    let iframeHtml = iframe.contentDocument.querySelector('html')
    let iframeBody = iframe.contentDocument.querySelector('body')
    iframeBody.style.marginTop = (-1 * (iframeHtml.offsetTop)) + 'px'
  }

  componentDidMount () {
    let iframe = document.querySelector('.vcv-layout-iframe-container iframe')
    iframe.contentWindow.addEventListener('resize', () => {
      this.updateIframeBodyOffset(iframe)
    })
    this.updateIframeBodyOffset(iframe)
    elementsStorage.state('document').onChange((data) => {
      this.setState({ data: data }, () => {
        // content.trigger('data:editor:render')
      })
    }, {
      debounce: 50
    })
    this.editor = new Combokeys(this.document)
    this.editor.bind([ 'command+z', 'ctrl+z' ], (e) => {
      e.preventDefault()
      historyStorage.state('canUndo').get() && historyStorage.trigger('undo')
      return false
    })
    this.editor.bind([ 'command+shift+z', 'ctrl+shift+z' ], (e) => {
      e.preventDefault()
      historyStorage.state('canRedo').get() && historyStorage.trigger('redo')
      return false
    })
    this.editor.bind('a', (e) => {
      e.preventDefault()
      let settings = workspaceStorage.state('settings').get()
      if (settings && settings.action === 'add') {
        workspaceStorage.state('settings').set({})
      } else {
        workspaceStorage.trigger('add')
      }
    })
    this.editor.bind('l', (e) => {
      e.preventDefault()
      let settings = workspaceStorage.state('settings').get()
      if (settings && settings.action === 'addTemplate') {
        workspaceStorage.state('settings').set({})
      } else {
        workspaceStorage.trigger('addTemplate')
      }
    })
    this.editor.bind('t', (e) => {
      e.preventDefault()
      let settings = workspaceStorage.state('contentStart').get()
      if (settings === 'treeView') {
        workspaceStorage.state('contentStart').set(false)
      } else {
        workspaceStorage.state('contentStart').set('treeView')
      }
    })
    this.editor.bind([ 'command+s', 'ctrl+s' ], (e) => {
      e.preventDefault()
      wordpressDataStorage.trigger('save', {
        options: {}
      }, 'postSaveControl')
      return false
    })
    this.editor.bind([ 'command+shift+p', 'ctrl+shift+p' ], () => {
      workspaceStorage.state('shortcutPreview').set(true)
      return false
    })
    this.editor.bind('esc', (e) => {
      e.preventDefault()
      workspaceStorage.state('contentStart').set(false)
      workspaceStorage.state('settings').set({})
    }, 'keyup')
  }

  getContent () {
    return (<HtmlLayout data={this.state.data} api={this.props.api} />)
  }

  render () {
    return (
      <div className='vcv-editor-here' ref={(editor) => {
        if (editor && editor.ownerDocument) {
          this.document = editor.ownerDocument
        }
      }}>
        {this.getContent()}
      </div>
    )
  }
}
