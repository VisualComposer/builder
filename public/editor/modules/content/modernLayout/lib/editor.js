import React from 'react'
import vcCake from 'vc-cake'
import HtmlLayout from './htmlLayout'
import Combokeys from 'combokeys'
import MobileDetect from 'mobile-detect'
import PropTypes from 'prop-types'

const workspaceStorage = vcCake.getStorage('workspace')
const elementsStorage = vcCake.getStorage('elements')
const wordpressDataStorage = vcCake.getStorage('wordpressData')
const historyStorage = vcCake.getStorage('history')

export default class LayoutEditor extends React.Component {
  static propTypes = {
    api: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    let data
    if (vcCake.env('IFRAME_RELOAD')) {
      data = elementsStorage.state('document').get() || []
    } else {
      data = []
    }
    this.state = {
      data
    }
    this.updateState = this.updateState.bind(this)
  }

  updateState (data) {
    this.setState({ data })
  }

  componentDidMount () {
    if (vcCake.env('IFRAME_RELOAD')) {
      elementsStorage.state('document').onChange(this.updateState)
    } else {
      elementsStorage.state('document').onChange((data) => {
        this.setState({ data: data }, () => {
          // content.trigger('data:editor:render')
        })
      }, {
        debounce: 50
      })
    }

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
      if (vcCake.env('MOBILE_DETECT')) {
        const mobileDetect = new MobileDetect(window.navigator.userAgent)
        if (mobileDetect.mobile() && (mobileDetect.tablet() || mobileDetect.phone())) {
          workspaceStorage.state('contentStart').set(false)
        }
      }
      if (settings && settings.action === 'add') {
        workspaceStorage.state('settings').set({})
      } else {
        workspaceStorage.trigger('add')
      }
    })
    this.editor.bind('l', (e) => {
      e.preventDefault()
      let settings = workspaceStorage.state('settings').get()
      if (vcCake.env('MOBILE_DETECT')) {
        const mobileDetect = new MobileDetect(window.navigator.userAgent)
        if (mobileDetect.mobile() && (mobileDetect.tablet() || mobileDetect.phone())) {
          workspaceStorage.state('contentStart').set(false)
        }
      }
      if (settings && settings.action === 'addTemplate') {
        workspaceStorage.state('settings').set({})
      } else {
        workspaceStorage.trigger('addTemplate')
      }
    })
    this.editor.bind('t', (e) => {
      e.preventDefault()
      let contentState = vcCake.env('NAVBAR_SINGLE_CONTENT') ? 'content' : 'contentStart'
      let settings = workspaceStorage.state(contentState).get()
      if (vcCake.env('MOBILE_DETECT')) {
        const mobileDetect = new MobileDetect(window.navigator.userAgent)
        if (mobileDetect.mobile() && (mobileDetect.tablet() || mobileDetect.phone())) {
          workspaceStorage.state('contentEnd').set(false)
        }
      }
      if (settings === 'treeView') {
        workspaceStorage.state(contentState).set(false)
      } else {
        workspaceStorage.state(contentState).set('treeView')
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

  componentWillUnmount () {
    if (vcCake.env('IFRAME_RELOAD')) {
      elementsStorage.state('document').ignoreChange(this.updateState)
    }
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
