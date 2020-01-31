import React from 'react'
import EditFormHeader from './editFormHeader'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import EditFormSection from './editFormSection'
import Scrollbar from 'public/components/scrollbar/scrollbar.js'

export default class EditForm extends React.Component {
  static propTypes = {
    elementAccessPoint: PropTypes.object.isRequired,
    activeTabId: PropTypes.string,
    options: PropTypes.object
  }

  scrollbar = false

  constructor (props) {
    super(props)
    this.allTabs = this.updateTabs(this.props)
    this.state = {
      activeTabIndex: this.getActiveTabIndex(this.props.activeTabId),
      isPresetEnabled: false
    }
    this.scrollBarMounted = this.scrollBarMounted.bind(this)
    this.togglePreset = this.togglePreset.bind(this)
  }

  scrollBarMounted (scrollbar) {
    this.scrollbar = scrollbar
  }

  getActiveTabIndex (activeTabKey) {
    const activeTab = this.allTabs && this.allTabs.findIndex((tab) => {
      return tab.fieldKey === activeTabKey
    })
    return activeTab > -1 ? activeTab : 0
  }

  /* eslint-disable */
  UNSAFE_componentWillReceiveProps (nextProps) {
    this.allTabs = this.updateTabs(nextProps)
    this.setState({
      activeTabIndex: this.getActiveTabIndex(nextProps.activeTabId)
    })
  }
  /* eslint-enable */

  updateTabs (props) {
    return this.editFormTabs(props).map((tab, index) => {
      return {
        fieldKey: tab.key,
        index: index,
        data: tab.data,
        isVisible: true,
        pinned: tab.data.settings && tab.data.settings.options && tab.data.settings.options.pinned ? tab.data.settings.options.pinned : false,
        params: this.editFormTabParams(props, tab),
        key: `edit-form-tab-${props.elementAccessPoint.id}-${index}-${tab.key}`,
        changeTab: this.onChangeActiveTab.bind(this, index),
        ref: (ref) => {
          if (this.allTabs[index]) {
            this.allTabs[index].realRef = ref
          }
        }
      }
    })
  }

  editFormTabs (props) {
    const cookElement = props.elementAccessPoint.cook()
    const group = cookElement.get('metaEditFormTabs')
    if (props.options.nestedAttr) {
      const groups = []
      const attributes = cookElement.settings(props.options.fieldKey)
      const metaEditFormTabs = attributes.settings.options.settings.metaEditFormTabs.value
      metaEditFormTabs.forEach((tab) => {
        const iterator = {
          key: tab,
          value: attributes.settings.options.settings[tab].value,
          data: attributes.settings.options.settings[tab]
        }
        groups.push(iterator)
      })
      return groups
    }
    if (group && group.each) {
      return group.each(item => (this.editFormTabsIterator(props, item)))
    }
    return []
  }

  editFormTabsIterator (props, item) {
    const cookElement = props.elementAccessPoint.cook()
    return {
      key: item,
      value: cookElement.get(item),
      data: cookElement.settings(item)
    }
  }

  editFormTabParams (props, tab) {
    const cookElement = props.elementAccessPoint.cook()
    if (props.options.nestedAttr) {
      const paramGroupValues = cookElement.get(props.options.fieldKey).value
      const currentParamGroupValue = paramGroupValues[props.options.activeParamGroupIndex]

      if (tab.data.type === 'group') {
        return tab.value.map((item) => {
          return {
            key: item,
            value: currentParamGroupValue[item],
            data: cookElement.settings(props.options.fieldKey).settings.options.settings[item]
          }
        })
      } else {
        return [tab]
      }
    }
    if (tab.data.settings.type === 'group' && tab.value) {
      return tab.value.each(item => (this.editFormTabsIterator(props, item)))
    }
    // In case if tab is single param holder
    return [tab]
  }

  onChangeActiveTab (tabIndex) {
    this.setState({
      activeTabIndex: tabIndex
    })
  }

  getAccordionSections () {
    const { activeTabIndex } = this.state
    return this.allTabs.map((tab, index) => {
      return (
        <EditFormSection
          {...this.props}
          sectionIndex={index}
          activeTabIndex={activeTabIndex}
          getSectionContentScrollbar={() => { return this.scrollbar }}
          key={tab.key}
          tab={tab}
        />
      )
    })
  }

  getPresetSections () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const tabLabel = localizations ? localizations.presetSettingsText : 'Element Presets'

    return (
      <EditFormSection
        isPreset
        sectionIndex={0}
        activeTabIndex={0}
        getSectionContentScrollbar={() => { return this.scrollbar }}
        tab={{
          fieldKey: 0,
          data: {
            settings: {
              options: {
                label: tabLabel
              }
            }
          }
        }}
        onAttributeChange={() => false}
      />
    )
  }

  togglePreset () {
    this.setState({
      isPresetEnabled: !this.state.isPresetEnabled
    })
  }

  render () {
    const { activeTabIndex, isPresetEnabled } = this.state
    const activeTab = this.allTabs[activeTabIndex]
    const plateClass = classNames({
      'vcv-ui-editor-plate': true,
      'vcv-ui-state--active': true
    }, `vcv-ui-editor-plate-${activeTab.key}`)
    const content = isPresetEnabled ? this.getPresetSections() : this.getAccordionSections()

    return (
      <div className='vcv-ui-tree-view-content vcv-ui-tree-view-content-accordion'>
        <EditFormHeader isPresetEnabled={isPresetEnabled} handlePresetToggle={this.togglePreset} elementAccessPoint={this.props.elementAccessPoint} options={this.props.options} />
        <div className='vcv-ui-tree-content'>
          <div className='vcv-ui-tree-content-section'>
            <Scrollbar ref={this.scrollBarMounted}>
              <div className='vcv-ui-tree-content-section-inner'>
                <div className='vcv-ui-editor-plates-container'>
                  <div className='vcv-ui-editor-plates'>
                    <div className={plateClass}>
                      {content}
                    </div>
                  </div>
                </div>
              </div>
            </Scrollbar>
          </div>
        </div>
      </div>
    )
  }
}
