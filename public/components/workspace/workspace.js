import React from 'react'
import ClassNames from 'classnames'
import { getStorage, onDataChange, ignoreDataChange } from 'vc-cake'
import PropTypes from 'prop-types'
import Resizer from '../resizer/resizer'
import { bindEditorKeys } from 'public/tools/comboKeys'

const workspaceStorage = getStorage('workspace')
const workspaceStorageNavbarBoundingRectState = workspaceStorage.state('navbarBoundingRect')

export default class Workspace extends React.Component {
  static propTypes = {
    hasContent: PropTypes.bool,
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
    this.handleNavbarStateChange = this.handleNavbarStateChange.bind(this)
  }

  componentDidMount () {
    onDataChange('vcv:layoutCustomMode', this.handleLayoutCustomModeChange)
    workspaceStorage.state('layoutBarMount').set({ layoutBarMounted: true })
    workspaceStorage.state('navbarDisabled').onChange(this.handleNavbarStateChange)
  }

  componentWillUnmount () {
    ignoreDataChange('vcv:layoutCustomMode', this.handleLayoutCustomModeChange)
    workspaceStorage.state('navbarDisabled').ignoreChange(this.handleNavbarStateChange)
  }

  handleNavbarStateChange (isDisabled) {
    if (!isDisabled) {
      bindEditorKeys(this.document)
    }
  }

  handleLayoutCustomModeChange (data) {
    if (data && data.mode === 'contentEditable') {
      this.setState({ contentEditableMode: true })
    } else {
      this.setState({ contentEditableMode: false })
    }
  }

  handleMouseUp () {
    const dragState = workspaceStorage.state('drag').get()
    if (dragState && Object.prototype.hasOwnProperty.call(dragState, 'active') && dragState.active) {
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
    const { hasContent, stickyBar } = this.props
    const layoutClasses = ClassNames({
      'vcv-layout-bar': true,
      'vcv-ui-content--hidden': !hasContent,
      'vcv-ui-content-all--visible': hasContent,
      'vcv-inline-editor--active': this.state.contentEditableMode
    })

    return (
      <div
        className={layoutClasses} style={stickyBar} onMouseUp={this.handleMouseUp} ref={(workspace) => {
          if (workspace && workspace.ownerDocument) {
            this.document = workspace.ownerDocument
          }
        }}
      >
        <div className='vcv-layout-bar-overlay' />
        {this.props.children}
        <Resizer params={{
          resizeTop: true,
          resizerTargetTop: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-n vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-top',
          callback: this.resizeCallback
        }}
        />
        <Resizer params={{
          resizeBottom: true,
          resizerTargetBottom: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-n vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-bottom',
          callback: this.resizeCallback
        }}
        />
        <Resizer params={{
          resizeLeft: true,
          resizeTop: true,
          resizerTargetLeft: '.vcv-layout-bar',
          resizerTargetTop: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-nw vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-left-top',
          callback: this.resizeCallback
        }}
        />
        <Resizer params={{
          resizeLeft: true,
          resizerTargetLeft: '.vcv-layout-bar',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-e vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-left',
          callback: this.resizeCallback
        }}
        />
        <Resizer params={{
          resizeLeft: true,
          resizeBottom: true,
          resizerTargetLeft: '.vcv-layout-bar',
          resizerTargetBottom: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-ne vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-left-bottom',
          callback: this.resizeCallback
        }}
        />

        <Resizer params={{
          resizeRight: true,
          resizeTop: true,
          resizerTargetRight: '.vcv-layout-bar',
          resizerTargetTop: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-ne vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-right-top',
          callback: this.resizeCallback
        }}
        />
        <Resizer params={{
          resizeRight: true,
          resizerTargetRight: '.vcv-layout-bar',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-e vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-right',
          callback: this.resizeCallback
        }}
        />
        <Resizer params={{
          resizeRight: true,
          resizeBottom: true,
          resizerTargetRight: '.vcv-layout-bar',
          resizerTargetBottom: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-nw vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-right-bottom',
          callback: this.resizeCallback
        }}
        />
      </div>
    )
  }
}
