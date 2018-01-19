import React from 'react'
// import EditForm from './editForm'
import PropTypes from 'prop-types'

export default class FormWrapper extends React.Component {
  static propTypes = {
    element: PropTypes.object.isRequired,
    activeTabId: PropTypes.string
  }

  constructor (props) {
    super(props)
    this.allTabs = this.updateTabs(this.props)
    this.state = {
      activeTabIndex: this.getActiveTabIndex(this.props.activeTabId)
    }
    this.setTabs = this.setTabs.bind(this)
  }

  componentWillMount () {
    this.allTabs = this.updateTabs(this.props)
    this.setState({
      activeTabIndex: this.getActiveTabIndex(this.props.activeTabId)
    })
  }

  getActiveTabIndex (activeTabKey) {
    let activeTab = this.allTabs && this.allTabs.findIndex((tab) => {
      return tab.fieldKey === activeTabKey
    })
    return activeTab > -1 ? activeTab : 0
  }

  componentWillReceiveProps (nextProps) {
    this.allTabs = this.updateTabs(nextProps)
    this.setState({
      activeTabIndex: this.getActiveTabIndex(nextProps.activeTabId)
    })
  }

  updateTabs (props) {
    return this.editFormTabs(props).map((tab, index) => {
      return {
        fieldKey: tab.key,
        index: index,
        data: tab.data,
        isVisible: true,
        pinned: tab.data.settings.options && tab.data.settings.options.pinned || false,
        params: this.editFormTabParams(props, tab),
        key: `edit-form-tab-${props.element.id}-${index}-${tab.key}`,
        changeTab: this.onChangeActiveTab.bind(this, index),
        ref: (ref) => {
          if (this.allTabs[ index ]) {
            this.allTabs[ index ].realRef = ref
          }
        }
      }
    })
  }

  editFormTabs (props) {
    const group = props.element.metaEditFormTabs
    if (group && group.length) {
      return group.map(item => (this.editFormTabsIterator(props, item)))
    }
    return []
  }

  editFormTabsIterator (props, item) {
    return {
      key: item,
      value: props.element[ item ],
      data: props.element.cook().settings(item)
    }
  }

  editFormTabParams (props, tab) {
    if (tab.data.settings.type === 'group' && tab.value && tab.value.length) {
      return tab.value.map(item => (this.editFormTabsIterator(props)))
    }
    // In case if tab is single param holder
    return [ tab ]
  }

  onChangeActiveTab (tabIndex) {
    this.setState({
      activeTabIndex: tabIndex
    })
  }

  setTabs (tabs) {
    this.allTabs = tabs
  }

  render () {
    const { activeTabIndex } = this.state
    return (
      <div>
        form wrapper {activeTabIndex}
      </div>
    )
    // return (
    //   <EditForm
    //     {...this.props}
    //     allTabs={this.allTabs}
    //     activeTabIndex={activeTabIndex}
    //     activeTab={this.allTabs[ activeTabIndex ]}
    //     updateTabs={this.setTabs}
    //   />
    // )
  }
}
