import React from 'react'
import EditElementResizeTabs from './tabs-extenstion-resizer'

export default class EditFormTabs extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    element: React.PropTypes.object.isRequired,
    activeState: React.PropTypes.string
  }
  state = {
    activeTabIndex: 0
  }
  allTabs = []
  componentWillMount () {
    this.allTabs = this.updateTabs(this.props)
    this.state = {
      activeTabIndex: this.getActiveTabIndex(this.props.activeState)
    }
  }
  getActiveTabIndex (activeTabKey) {
    let activeTab = this.allTabs.findIndex((tab) => {
      return tab.fieldKey === activeTabKey
    })
    return activeTab > -1 ? activeTab : 0
  }
  componentWillReceiveProps (nextProps) {
    this.allTabs = this.updateTabs(nextProps)
    this.setState({
      activeTabIndex: this.getActiveTabIndex(nextProps.activeState)
    })
  }
  updateTabs (props) {
    return EditFormTabs.editFormTabs(props).map((tab, index) => {
      return {
        fieldKey: tab.key,
        index: index,
        data: tab.data,
        isVisible: true,
        pinned: tab.data.settings.options && tab.data.settings.options.pinned ? tab.data.settings.options.pinned : false,
        params: EditFormTabs.editFormTabParams(props, tab.key),
        key: `edit-form-tab-${props.element.data.id}-${index}-${tab.key}`,
        changeTab: this.onChangeActiveTab.bind(this, index),
        ref: (ref) => {
          if (this.allTabs[ index ]) {
            this.allTabs[ index ].realRef = ref
          }
        }
      }
    }, EditFormTabs)
  }

  static editFormTabs (props) {
    const group = props.element.get('metaEditFormTabs')
    if (group && group.each) {
      return group.each(EditFormTabs.editFormTabsIterator.bind(this, props))
    }
    return []
  }

  static editFormTabsIterator (props, item) {
    return {
      key: item,
      value: props.element.get(item),
      data: props.element.settings(item)
    }
  }

  static editFormTabParams (props, tabName) {
    const value = props.element.get(tabName)
    const settings = props.element.settings(tabName)
    if (settings.settings.type === 'group' && value && value.each) {
      return value.each(EditFormTabs.editFormTabsIterator.bind(this, props))
    }
    // In case if tab is single param holder
    return [ {
      key: tabName,
      value: value,
      data: settings
    } ]
  }

  onChangeActiveTab (tabIndex) {
    this.setState({
      activeTabIndex: tabIndex
    })
  }

  setTabs = (tabs) => {
    this.allTabs = tabs
  }

  render () {
    return (
      <EditElementResizeTabs
        {...this.props}
        allTabs={this.allTabs}
        activeTabIndex={this.state.activeTabIndex}
        activeTab={this.allTabs[ this.state.activeTabIndex ]}
        updateTabs={this.setTabs}
      />
    )
  }
}
