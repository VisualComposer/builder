import React from 'react'
import ReactDOM from 'react-dom'
import EditForm from './editForm'
import vcCake from 'vc-cake'

const Utils = vcCake.getService('utils')

export default class EditFormResizeTabs extends React.Component {
  static propTypes = {
    allTabs: React.PropTypes.array.isRequired,
    updateTabs: React.PropTypes.func.isRequired
  }
  allTabs = this.props.allTabs
  options = null
  showDropdown = false
  editorNav = null

  componentWillReceiveProps (nextProps) {
    this.allTabs = nextProps.allTabs
  }

  componentDidMount () {
    this.doRefresh()
  }

  doRefresh = () => {
    this.refreshTabs(ReactDOM.findDOMNode(this.editorNav), this.options)
  }

  onTabsMount = (editorNav, options) => {
    this.options = options
    this.editorNav = editorNav
    Utils.addResizeListener(ReactDOM.findDOMNode(editorNav), options, this.refreshTabs)
  }

  onTabsUnmount = (editorNav, options) => {
    this.options = options
    this.editorNav = editorNav
    Utils.removeResizeListener(ReactDOM.findDOMNode(editorNav), options, this.refreshTabs)
  }

  refreshTabs = ($editorNav, options) => {
    let editorNavWidth = $editorNav.offsetWidth
    let editorTabsWidth = options.tabsWrapper.offsetWidth

    // If there is no space show dropdown and hide tabs.
    if (editorNavWidth <= editorTabsWidth && !this.showDropdown) {
      this.showDropdown = true
      this.forceUpdate(() => {
        this.refreshTabs($editorNav, options)
      })
      return
    }

    // If we have free space hide dropdown and show tabs.
    if (this.showDropdown && editorNavWidth > editorTabsWidth) {
      this.showDropdown = false
      this.forceUpdate()
    }
  }

  getVisibleTabs () {
    return this.allTabs.filter((tab) => {
      if (tab.isVisible) {
        return true
      }
    })
  }

  getHiddenTabs () {
    return this.allTabs.filter((tab) => {
      return !tab.isVisible
    }).reverse()
  }

  getVisibleAndUnpinnedTabs () {
    return this.getVisibleTabs().filter((tab) => {
      return tab.isVisible && !tab.pinned
    })
  }

  render () {
    return (
      <EditForm
        {...this.props}
        showDropdown={this.showDropdown}
        allTabs={this.allTabs}
        onTabsMount={this.onTabsMount}
        onTabsUnmount={this.onTabsUnmount}
      />
    )
  }
}
