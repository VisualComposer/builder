import React from 'react'
import ClassNames from 'classnames'
import { getStorage, onDataChange, ignoreDataChange } from 'vc-cake'
import MobileDetect from 'mobile-detect'
import PropTypes from 'prop-types'
import Combokeys from 'combokeys'

import Resizer from '../resizer/resizer'

const workspaceStorage = getStorage('workspace')
const workspaceStorageNavbarBoundingRectState = workspaceStorage.state('navbarBoundingRect')
const wordpressDataStorage = getStorage('wordpressData')
const historyStorage = getStorage('history')

export default class Workspace extends React.Component {
  static propTypes = {
    contentStart: PropTypes.bool,
    contentEnd: PropTypes.bool,
    content: PropTypes.bool,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    stickyBar: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.state = {
      contentEditableMode: false
    }
    this.handleLayoutCustomModeChange = this.handleLayoutCustomModeChange.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
  }

  componentDidMount () {
    onDataChange('vcv:layoutCustomMode', this.handleLayoutCustomModeChange)
    workspaceStorage.state('layoutBarMount').set({ layoutBarMounted: true })
    this.workspace = new Combokeys(this.document)
    this.workspace.bind([ 'command+z', 'ctrl+z' ], (e) => {
      e.preventDefault()
      historyStorage.state('canUndo').get() && historyStorage.trigger('undo')
      return false
    })
    this.workspace.bind([ 'command+shift+z', 'ctrl+shift+z' ], (e) => {
      e.preventDefault()
      historyStorage.state('canRedo').get() && historyStorage.trigger('redo')
      return false
    })
    this.workspace.bind('a', (e) => {
      e.preventDefault()
      let settings = workspaceStorage.state('settings').get()
      const mobileDetect = new MobileDetect(window.navigator.userAgent)
      if (mobileDetect.mobile() && (mobileDetect.tablet() || mobileDetect.phone())) {
        workspaceStorage.state('contentStart').set(false)
      }
      if (settings && settings.action === 'add') {
        workspaceStorage.state('settings').set({})
      } else {
        workspaceStorage.trigger('add')
      }
    })
    this.workspace.bind('l', (e) => {
      e.preventDefault()
      let settings = workspaceStorage.state('settings').get()
      const mobileDetect = new MobileDetect(window.navigator.userAgent)
      if (mobileDetect.mobile() && (mobileDetect.tablet() || mobileDetect.phone())) {
        workspaceStorage.state('contentStart').set(false)
      }
      if (settings && settings.action === 'addTemplate') {
        workspaceStorage.state('settings').set({})
      } else {
        workspaceStorage.trigger('addTemplate')
      }
    })
    this.workspace.bind('t', (e) => {
      e.preventDefault()
      let contentState = 'content'
      let settings = workspaceStorage.state(contentState).get()
      const mobileDetect = new MobileDetect(window.navigator.userAgent)
      if (mobileDetect.mobile() && (mobileDetect.tablet() || mobileDetect.phone())) {
        workspaceStorage.state('contentEnd').set(false)
      }
      if (settings === 'treeView') {
        workspaceStorage.state(contentState).set(false)
      } else {
        workspaceStorage.state(contentState).set('treeView')
      }
    })
    this.workspace.bind([ 'command+s', 'ctrl+s' ], (e) => {
      e.preventDefault()
      wordpressDataStorage.trigger('save', {
        options: {}
      }, 'postSaveControl')
      return false
    })
    this.workspace.bind([ 'command+shift+p', 'ctrl+shift+p' ], () => {
      workspaceStorage.state('shortcutPreview').set(true)
      return false
    })
    this.document.onkeyup = function (e) {
      e = e || window.event
      if (e && (e.key === 'Esc' || e.keyCode === 27)) {
        e.preventDefault()
        workspaceStorage.state('contentStart').set(false)
        workspaceStorage.state('settings').set({})
      }
    }
  }

  componentWillUnmount () {
    ignoreDataChange('vcv:layoutCustomMode', this.handleLayoutCustomModeChange)
  }

  handleLayoutCustomModeChange (data) {
    if (data === 'contentEditable') {
      this.setState({ contentEditableMode: true })
    } else {
      this.setState({ contentEditableMode: false })
    }
  }

  handleMouseUp () {
    const dragState = workspaceStorage.state('drag').get()
    if (dragState && dragState.hasOwnProperty('active') && dragState.active) {
      workspaceStorage.state('drag').set({ active: false })
    }
  }

  resizeCallback = (e) => {
    if (e && e.direction) {
      const rect = workspaceStorageNavbarBoundingRectState
      if (e.direction === 'top') {
        rect.resizeTop = e.offsetY
        rect.set(rect)
      } else if (e.direction === 'left') {
        rect.resizeLeft = e.offsetX
        rect.set(rect)
      }
    }
  }

  render () {
    const { contentStart, contentEnd, content, stickyBar } = this.props
    let layoutClasses = ClassNames({
      'vcv-layout-bar': true,
      'vcv-ui-content--hidden': !(contentEnd || contentStart || content),
      'vcv-ui-content-start--visible': contentStart,
      'vcv-ui-content-end--visible': contentEnd,
      'vcv-ui-content-all--visible': content,
      'vcv-inline-editor--active': this.state.contentEditableMode
    })
    return (
      <div className={layoutClasses} style={stickyBar} onMouseUp={this.handleMouseUp} ref={(workspace) => {
        if (workspace && workspace.ownerDocument) {
          this.document = workspace.ownerDocument
        }
      }}>
        <div className='vcv-layout-bar-overlay' />
        {this.props.children}
        <Resizer params={{
          resizeTop: true,
          resizerTargetTop: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-n vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-top',
          callback: this.resizeCallback
        }} />
        <Resizer params={{
          resizeBottom: true,
          resizerTargetBottom: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-n vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-bottom',
          callback: this.resizeCallback
        }} />
        <Resizer params={{
          resizeLeft: true,
          resizeTop: true,
          resizerTargetLeft: '.vcv-layout-bar',
          resizerTargetTop: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-nw vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-left-top',
          callback: this.resizeCallback
        }} />
        <Resizer params={{
          resizeLeft: true,
          resizerTargetLeft: '.vcv-layout-bar',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-e vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-left',
          callback: this.resizeCallback
        }} />
        <Resizer params={{
          resizeLeft: true,
          resizeBottom: true,
          resizerTargetLeft: '.vcv-layout-bar',
          resizerTargetBottom: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-ne vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-left-bottom',
          callback: this.resizeCallback
        }} />

        <Resizer params={{
          resizeRight: true,
          resizeTop: true,
          resizerTargetRight: '.vcv-layout-bar',
          resizerTargetTop: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-ne vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-right-top',
          callback: this.resizeCallback
        }} />
        <Resizer params={{
          resizeRight: true,
          resizerTargetRight: '.vcv-layout-bar',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-e vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-right',
          callback: this.resizeCallback
        }} />
        <Resizer params={{
          resizeRight: true,
          resizeBottom: true,
          resizerTargetRight: '.vcv-layout-bar',
          resizerTargetBottom: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-nw vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-right-bottom',
          callback: this.resizeCallback
        }} />
      </div>
    )
  }
}
