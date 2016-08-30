import React from 'react'
import ReactDOM from 'react-dom'
import EditElementForm from './form'
import vcCake from 'vc-cake'

const Utils = vcCake.getService('utils')

export default class EditFormResizeTabs extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    element: React.PropTypes.object.isRequired,
    allTabs: React.PropTypes.array.isRequired,
    updateTabs: React.PropTypes.func.isRequired
  }
  allTabs = this.props.allTabs

  componentWillReceiveProps (nextProps) {
    this.allTabs = nextProps.allTabs
  }

  onTabsMount = (freespace, options) => {
    Utils.addResizeListener(ReactDOM.findDOMNode(freespace), options, this.refreshTabs)
  }

  onTabsUnmount = (freespace, options) => {
    Utils.removeResizeListener(ReactDOM.findDOMNode(freespace), options, this.refreshTabs)
  }

  refreshTabs = ($freeSpace, options) => {
    // get tabs line width
    let freeSpace = $freeSpace.offsetWidth

    // If there is no space move tab from visible to hidden tabs.
    let visibleAndUnpinnedTabs = this.getVisibleAndUnpinnedTabs()
    if (freeSpace === 0 && visibleAndUnpinnedTabs.length > 0) {
      let lastTab = visibleAndUnpinnedTabs.pop()
      this.allTabs[ lastTab.index ].isVisible = false
      this.props.updateTabs(this.allTabs)
      this.forceUpdate(() => {
        this.refreshTabs($freeSpace, options)
      })
      return
    }

    // If we have free space move tab from hidden tabs to visible.
    let hiddenTabs = this.getHiddenTabs()
    if (hiddenTabs.length) {
      let $dropdown = options.getDropdown()
      // if it is las hidden tab than add dropdown width to free space
      if (hiddenTabs.length === 1) {
        freeSpace += $dropdown.offsetWidth
      }
      while (freeSpace > 0 && hiddenTabs.length) {
        let lastTab = hiddenTabs.pop()
        if (lastTab.ref) {
          freeSpace -= lastTab.ref.getRealWidth()
          if (freeSpace > 0) {
            this.allTabs[ lastTab.index ].isVisible = true
          }
        }
      }
      this.props.updateTabs(this.allTabs)
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
    let tabs = this.allTabs.filter((tab) => {
      return !tab.isVisible
    })
    return tabs
  }

  getVisibleAndUnpinnedTabs () {
    return this.getVisibleTabs().filter((tab) => {
      return tab.isVisible && !tab.pinned
    })
  }

  render () {
    return (
      <EditElementForm
        {...this.props}
        allTabs={this.allTabs}
        visibleTabs={this.getVisibleTabs()}
        hiddenTabs={this.getHiddenTabs()}
        onTabsMount={this.onTabsMount}
        onTabsUnmount={this.onTabsUnmount}
      />
    )
  }
}
