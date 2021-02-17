import React from 'react'
import PropTypes from 'prop-types'
import Groups from './lib/groups'
import vcCake from 'vc-cake'

const workspaceStorage = vcCake.getStorage('workspace')
const workspaceSettings = workspaceStorage.state('settings')

export default class AddElementPanel extends React.Component {
  static propTypes = {
    searchValue: PropTypes.string,
    applyFirstElement: PropTypes.string,
    handleScrollToElement: PropTypes.func
  }

  constructor (props) {
    super(props)

    this.state = {
      options: workspaceSettings.get() || {}
    }

    this.handleWorkspaceSettingsChange = this.handleWorkspaceSettingsChange.bind(this)
  }

  componentDidMount () {
    workspaceSettings.onChange(this.handleWorkspaceSettingsChange)
  }

  componentWillUnmount () {
    workspaceSettings.ignoreChange(this.handleWorkspaceSettingsChange)
  }

  handleWorkspaceSettingsChange (value) {
    this.setState({ options: value })
  }

  render () {
    let childrenOutput = this.props.children
    if (!childrenOutput) {
      childrenOutput = (
        <Groups
          key='addElementGroups'
          parent={this.state.options.element ? this.state.options.element : {}}
          searchValue={this.props.searchValue}
          applyFirstElement={this.props.applyFirstElement}
          onScrollToElement={this.props.handleScrollToElement}
        />
      )
    }

    return (
      <div className='vcv-ui-tree-view-content vcv-ui-add-element-content'>
        {childrenOutput}
      </div>
    )
  }
}
