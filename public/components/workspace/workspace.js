import React from 'react'
import ClassNames from 'classnames'
import { getStorage, onDataChange, ignoreDataChange } from 'vc-cake'
import PropTypes from 'prop-types'
import Resizer from '../resizer/resizer'
import { bindEditorKeys } from 'public/tools/comboKeys'

const workspaceStorage = getStorage('workspace')

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
      contentEditableMode: false,
      isNavbarDisabled: true
    }
    this.handleLayoutCustomModeChange = this.handleLayoutCustomModeChange.bind(this)
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
    if (this.state.isNavbarDisabled && !isDisabled) {
      bindEditorKeys(this.document)
      this.setState({ isNavbarDisabled: false })
    }
  }

  handleLayoutCustomModeChange (data) {
    if (data && data.mode === 'contentEditable') {
      this.setState({ contentEditableMode: true })
    } else {
      this.setState({ contentEditableMode: false })
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
        className={layoutClasses} style={stickyBar} ref={(workspace) => {
          if (workspace && workspace.ownerDocument) {
            this.document = workspace.ownerDocument
          }
        }}
      >
        <div className='vcv-layout-bar-overlay' />
        {this.props.children}
      </div>
    )
  }
}
