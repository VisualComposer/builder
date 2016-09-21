import React from 'react'
import ReactDOM from 'react-dom'
import EditElementForm from './form'
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
        if (lastTab.realRef) {
          freeSpace -= lastTab.realRef.getRealWidth()
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
