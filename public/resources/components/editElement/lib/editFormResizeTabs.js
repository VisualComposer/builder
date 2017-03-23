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
  freeSpace = null
  options = null
  showDropdown = false

  componentWillReceiveProps (nextProps) {
    this.allTabs = nextProps.allTabs
  }

  componentDidMount () {
    this.doRefresh()
  }

  doRefresh = () => {
    this.refreshTabs(ReactDOM.findDOMNode(this.freeSpace), this.options)
  }

  onTabsMount = (freespace, options) => {
    this.options = options
    this.freeSpace = freespace
    Utils.addResizeListener(ReactDOM.findDOMNode(freespace), options, this.refreshTabs)
  }

  onTabsUnmount = (freespace, options) => {
    this.options = options
    this.freeSpace = freespace
    Utils.removeResizeListener(ReactDOM.findDOMNode(freespace), options, this.refreshTabs)
  }

  refreshTabs = ($freeSpace, options) => {
    // get tabs line width
    let freeSpace = $freeSpace.offsetWidth

    // If there is no space show dropdown and hide tabs.
    if (freeSpace === 0 && !this.showDropdown) {
      this.showDropdown = true
      this.forceUpdate(() => {
        this.refreshTabs($freeSpace, options)
      })
      return
    }

    // If we have free space hide dropdown and show tabs.
    if (this.showDropdown && freeSpace) {
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
