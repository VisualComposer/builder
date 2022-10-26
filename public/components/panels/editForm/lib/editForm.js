import React from 'react'
import EditFormHeader from './editFormHeader'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import EditFormSection from './editFormSection'
import EditFormReplaceElement from './editFormReplaceElement'
import PremiumTeaser from 'public/components/premiumTeasers/component'
import Scrollbar from 'public/components/scrollbar/scrollbar'
import { getService, getStorage, env } from 'vc-cake'

import PanelNavigation from '../../panelNavigation'

const dataManager = getService('dataManager')
const hubElementsService = getService('hubElements')
const hubElementsStorage = getStorage('hubElements')
const workspace = getStorage('workspace')
const workspaceContentState = workspace.state('content')

export default class EditForm extends React.Component {
  static propTypes = {
    elementAccessPoint: PropTypes.object.isRequired,
    activeTabId: PropTypes.string,
    options: PropTypes.object
  }

  scrollbar = false
  permittedTabs = ['layoutTab', 'contentTab', 'designTab', 'advancedTab']

  constructor (props) {
    super(props)
    this.state = {
      activeTabIndex: this.getActiveIndex(this.props.activeTabId, false),
      activeSectionIndex: this.getActiveIndex(this.props.activeTabId, true),
      isEditFormSettingsOpened: false,
      isElementReplaceOpened: props.options && props.options.isReplaceOpened ? props.options.isReplaceOpened : false,
      isVisible: workspaceContentState.get() === 'editElement'
    }
    this.scrollBarMounted = this.scrollBarMounted.bind(this)
    this.toggleEditFormSettings = this.toggleEditFormSettings.bind(this)
    this.toggleShowReplace = this.toggleShowReplace.bind(this)
    this.getPremiumTeaser = this.getPremiumTeaser.bind(this)
    this.setVisibility = this.setVisibility.bind(this)
    this.setActiveTab = this.setActiveTab.bind(this)
  }

  componentDidMount () {
    workspaceContentState.onChange(this.setVisibility)
  }

  componentWillUnmount () {
    workspaceContentState.ignoreChange(this.setVisibility)
  }

  setVisibility (activePanel) {
    this.setState({
      isVisible: activePanel === 'editElement'
    })
  }

  scrollBarMounted (scrollbar) {
    this.scrollbar = scrollbar
  }

  getActiveIndex (activeTabKey, isSection) {
    const activeTab = this.allTabs && this.allTabs.findIndex((tab) => {
      return tab.fieldKey === activeTabKey
    })
    // Backwards compatibility
    // Need to check if it's a tab or section
    const isPermitted = this.permittedTabs.includes(activeTabKey)
    return activeTab > -1 && ((isPermitted && !isSection) || (!isPermitted && isSection)) ? activeTab : 0
  }

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

  getSection (activeTab, activeTabIndex, isAccordion) {
    return (
      <EditFormSection
        {...this.props}
        sectionIndex={activeTab.index}
        activeTabIndex={activeTabIndex}
        getSectionContentScrollbar={() => { return this.scrollbar }}
        key={activeTab.key}
        tab={activeTab}
        accordion={isAccordion}
        activeSectionIndex={isAccordion ? this.state.activeSectionIndex : 0}
        getReplaceShownStatus={this.getReplaceShownStatus}
      />
    )
  }

  getAccordionSections (activeTabIndex, realTabs) {
    const tabsLength = Object.keys(realTabs).length
    if (tabsLength > 1) {
      // Backwards compatibility
      // Show all attributes in General tab if none of the permitted tabs are specified
      const activeTabName = Object.keys(realTabs).find(tab => realTabs[tab].index === activeTabIndex)
      const activeTab = this.allTabs.find(tab => tab.fieldKey === activeTabName)

      if (activeTab && activeTab.fieldKey && this.permittedTabs.includes(activeTab.fieldKey)) {
        return this.getSection(activeTab, activeTabIndex, false)
      } else {
        const deprecatedTabs = this.allTabs.filter(tab => !this.permittedTabs.includes(tab.fieldKey))
        return deprecatedTabs.map((tab) => {
          return this.getSection(tab, activeTabIndex, true)
        })
      }
    } else {
      return this.allTabs.map((tab) => {
        return this.getSection(tab, activeTabIndex, true)
      })
    }
  }

  getPremiumTeaser () {
    const localizations = dataManager.get('localizations')
    const isPremiumActivated = dataManager.get('isPremiumActivated')
    const goPremiumText = localizations.goPremium || 'Go Premium'
    const downloadAddonText = localizations.downloadTheAddon || 'Download The Addon'
    const headingText = localizations.elementSettingsPremiumFeatureHeading || 'Element Settings is a Premium Feature'
    const buttonText = isPremiumActivated ? downloadAddonText : goPremiumText
    const descriptionFree = localizations.elementSettingsPremiumFeatureText || 'With Visual Composer Premium, you can change the default parameters to create a unique element and save it to your Content Library.'
    const descriptionPremium = localizations.elementPresetsActivateAddonText || 'With the Element Presets addon, you can change the default parameters to create a unique element and save it to your Content Library.'
    const description = isPremiumActivated ? descriptionPremium : descriptionFree
    const utm = dataManager.get('utm')
    const utmUrl = utm['editor-hub-popup-teaser'].replace('{medium}', 'elementsettings-editform-editor')

    return (
      <PremiumTeaser
        headingText={headingText}
        buttonText={buttonText}
        description={description}
        url={utmUrl}
        isPremiumActivated={isPremiumActivated}
        addonName='elementPresets'
      />
    )
  }

  getEditFormSettingsSections () {
    const isRootElement = this.props.elementAccessPoint.cook().relatedTo('RootElements')
    const isContainerElement = Boolean(this.props.elementAccessPoint.cook().containerFor().length)
    const localizations = dataManager.get('localizations')
    const editFormSettingsText = localizations ? localizations.editFormSettingsText : 'Element Settings'
    const editRowSettingsText = localizations ? localizations.editRowSettingsText : 'Block Template'
    const tabLabel = isRootElement ? editRowSettingsText : editFormSettingsText

    return (
      <EditFormSection
        isEditFormSettings
        isRootElement={isRootElement || isContainerElement}
        sectionIndex={0}
        activeTabIndex={0}
        getSectionContentScrollbar={() => { return this.scrollbar }}
        elementId={this.props.elementAccessPoint.id}
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

  toggleEditFormSettings () {
    this.setState({
      isEditFormSettingsOpened: !this.state.isEditFormSettingsOpened,
      isElementReplaceOpened: false
    })
  }

  toggleShowReplace () {
    this.setState({
      isElementReplaceOpened: !this.state.isElementReplaceOpened,
      isEditFormSettingsOpened: false
    })
  }

  getReplaceElementBlock () {
    return <EditFormReplaceElement {...this.props} />
  }

  getReplaceShownStatus (category) {
    const categorySettings = hubElementsService.get(category)
    let showElementReplaceIcon = false
    const presetsByCategory = hubElementsStorage.action('getPresetsByCategory', category)

    if (presetsByCategory.length) {
      showElementReplaceIcon = true
    }

    if (!showElementReplaceIcon && categorySettings && categorySettings.elements && categorySettings.elements.length > 1) {
      const replaceElements = categorySettings.elements.filter(categoryTag => Object.keys(hubElementsStorage.state('elements').get()).includes(categoryTag))
      showElementReplaceIcon = replaceElements.length > 1
    }

    return showElementReplaceIcon
  }

  setActiveTab (type, index) {
    this.setState({ activeTabIndex: index, activeSectionIndex: 0 })
  }

  getTabs () {
    const tabs = {}
    // Backwards compatibility
    // Show General tab if none of the permitted tabs are specified
    const isDeprecatedTabs = this.allTabs.filter(tab => !this.permittedTabs.includes(tab.fieldKey))
    if (isDeprecatedTabs.length) {
      tabs.general = {
        index: 0,
        title: 'General',
        type: 'general',
        key: `edit-form-tab-${this.props.elementAccessPoint.id}-0-general`
      }
    }
    this.allTabs.forEach((tab, i) => {
      if (this.permittedTabs.includes(tab.fieldKey) && tab.params.length) {
        tabs[tab.fieldKey] = {
          index: isDeprecatedTabs.length ? i + 1 : i,
          title: tab.data.settings.options.label || tab.data.settings.options.tabLabel,
          type: tab.fieldKey,
          key: tab.key
        }
      }
    })
    return tabs
  }

  render () {
    this.allTabs = this.updateTabs(this.props)
    const { isEditFormSettingsOpened, showElementReplaceIcon, isElementReplaceOpened, activeTabIndex } = this.state
    const isAddonEnabled = env('VCV_ADDON_ELEMENT_PRESETS_ENABLED')
    const tabs = this.getTabs()
    let activeTab = Object.keys(tabs).find(tab => tabs[tab].index === activeTabIndex)
    activeTab = tabs[activeTab]

    let content = null
    if (isEditFormSettingsOpened) {
      if (isAddonEnabled) {
        content = this.getEditFormSettingsSections()
      } else {
        content = this.getPremiumTeaser()
      }
    } else if (isElementReplaceOpened) {
      content = this.getReplaceElementBlock()
    } else {
      content = this.getAccordionSections(activeTabIndex, tabs)
    }

    const plateClass = classNames({
      'vcv-ui-editor-plate': true,
      'vcv-ui-state--centered': !isAddonEnabled,
      'vcv-ui-state--active': true
    }, `vcv-ui-editor-plate-${activeTab.key}`)

    const editFormClasses = classNames({
      'vcv-ui-tree-view-content': true,
      'vcv-ui-tree-view-content-accordion': true,
      'vcv-ui-state--hidden': !this.state.isVisible
    })

    let navigation = null
    if (Object.keys(tabs).length > 1) {
      navigation = <PanelNavigation
        controls={tabs}
        activeSection={activeTab.type}
        setActiveSection={this.setActiveTab}
      />
    }

    return (
      <div className={editFormClasses}>
        <EditFormHeader
          isEditFormSettingsOpened={isEditFormSettingsOpened}
          handleEditFormSettingsToggle={this.toggleEditFormSettings}
          elementAccessPoint={this.props.elementAccessPoint}
          options={this.props.options}
          showElementReplaceIcon={showElementReplaceIcon}
          isElementReplaceOpened={isElementReplaceOpened}
          handleReplaceElementToggle={this.toggleShowReplace}
          getReplaceShownStatus={this.getReplaceShownStatus}
        />
        <div className='vcv-ui-tree-content'>
          {navigation}
          <div className='vcv-ui-tree-content-section'>
            <Scrollbar ref={this.scrollBarMounted} initialScrollTop={this.props.options && this.props.options.replaceElementScrollTop}>
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
