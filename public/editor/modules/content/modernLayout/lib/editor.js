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
  }

  componentDidMount () {
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
    this.editor.bind([ 'command+shift+z', 'ctrl+' ], (e) => {
      e.preventDefault()
      historyStorage.state('canRedo').get() && historyStorage.trigger('redo')
      return false
    })
    this.editor.bind('a', (e) => {
      e.preventDefault()
      workspaceStorage.trigger('add')
    })
    this.editor.bind('l', (e) => {
      e.preventDefault()
      workspaceStorage.trigger('addTemplate')
    })
    this.editor.bind('t', (e) => {
      e.preventDefault()
      workspaceStorage.state('contentStart').set('treeView')
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
