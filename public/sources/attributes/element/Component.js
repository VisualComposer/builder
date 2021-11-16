/* eslint react/jsx-no-bind:"off" */
import React from 'react'
import Attribute from '../attribute'
import classNames from 'classnames'
import vcCake from 'vc-cake'
import AttributeElementFieldWrapper from './AttributeElementFieldWrapper'
import Dropdown from '../dropdown/Component'
import PropTypes from 'prop-types'

const Cook = vcCake.getService('cook')
const elementAccessPointService = vcCake.getService('elementAccessPoint')
const hubElementsService = vcCake.getService('hubElements')
const hubElementsStorage = vcCake.getStorage('hubElements')
const workspaceStorage = vcCake.getStorage('workspace')
const dataManager = vcCake.getService('dataManager')
const roleManager = vcCake.getService('roleManager')

export default class ElementAttribute extends Attribute {
  static defaultProps = {
    fieldType: 'element'
  }

  static localizations = dataManager.get('localizations')

  static propTypes = {
    updater: PropTypes.func.isRequired,
    fieldKey: PropTypes.string.isRequired,
    value: PropTypes.object.isRequired,
    elementAccessPoint: PropTypes.object.isRequired,
    options: PropTypes.any,
    id: PropTypes.string
  }

  constructor (props) {
    super(props)
    this.handleAttributeChange = this.handleAttributeChange.bind(this)
    this.onClickReplacement = this.onClickReplacement.bind(this)
    this.handleReplacementsToggle = this.handleReplacementsToggle.bind(this)
    this.handleSectionToggle = this.handleSectionToggle.bind(this)
    this.handleToggleShowReplace = this.handleToggleShowReplace.bind(this)
  }

  updateState (props) {
    // Fix for params group
    if (!props.value.id && props.fieldKeyInner) {
      props.value.id = props.fieldKeyInner
    }
    const valueElementAccessPoint = elementAccessPointService.getInstance(null, props.value, props)
    valueElementAccessPoint.parentElementAccessPoint = this.props.elementAccessPoint

    return {
      allValues: Object.assign({}, props.value),
      value: props.value,
      tag: props.value.tag,
      elementAccessPoint: valueElementAccessPoint,
      allTabs: ElementAttribute.updateTabs(valueElementAccessPoint.cook()),
      isInnerElementReplaceOpened: props.isInnerElementReplaceOpened
    }
  }

  handleGoToHub () {
    const settings = {
      action: 'addHub',
      element: {},
      tag: '',
      options: {
        filterType: 'element',
        id: 0,
        bundleType: undefined
      }
    }
    workspaceStorage.state('settings').set(settings)
  }

  onClickReplacement (tag, presetCookElement) {
    let newElement = { tag: tag }
    if (presetCookElement) {
      newElement = presetCookElement.toJS()
    }
    newElement.id = this.state.value.id
    const valueElementAccessPoint = elementAccessPointService.getInstance(null, newElement)
    valueElementAccessPoint.parentElementAccessPoint = this.props.elementAccessPoint
    const cookElement = valueElementAccessPoint.cook()
    const allValues = Object.assign({}, this.state.allValues, this.state.value)
    if (this.props.options && this.props.options.merge) {
      Object.keys(cookElement.toJS()).forEach((key) => {
        if (allValues[key] !== undefined) {
          // Merge, Type, Key
          const findKey = this.props.options.merge.attributes.findIndex((item) => {
            // eslint-disable-next-line valid-typeof
            return item.key === key && item.type === typeof allValues[key]
          })
          if (findKey > -1) {
            // Merge the value
            cookElement.set(key, allValues[key])
            valueElementAccessPoint.set(key, allValues[key])
          }
        }
      })
    }

    const values = cookElement.toJS()
    this.setState({
      allValues: Object.assign({}, this.state.value, newElement),
      value: values,
      tag: cookElement.get('tag'),
      elementAccessPoint: valueElementAccessPoint,
      allTabs: ElementAttribute.updateTabs(cookElement)
    })
    this.setFieldValue(values)
  }

  onClickReplacementDropdown (fieldKey, newElement) {
    this.onClickReplacement(newElement)
  }

  handleReplacementsToggle () {
    this.setState({ showReplacements: !this.state.showReplacements })
  }

  static updateTabs (element) {
    const tabs = []
    ElementAttribute.editFormTabs(element).map((tab, index) => {
      const tabsData = {
        id: tab.key,
        index: index,
        data: tab.data,
        params: ElementAttribute.editFormTabParams(element, tab.key),
        key: `element-params-tab-${element.get('id')}-${tab.key}`
      }
      tabs.push(tabsData)
    }, ElementAttribute)

    return tabs
  }

  static editFormTabs (element) {
    const group = element.get('metaEditFormTabs')
    if (group && group.each) {
      return group.each(ElementAttribute.editFormTabsIterator.bind(this, element))
    }
    return []
  }

  static editFormTabsIterator (element, item) {
    return {
      key: item,
      value: element.get(item),
      data: element.settings(item)
    }
  }

  static editFormTabParams (element, tabName) {
    const value = element.get(tabName)
    const settings = element.settings(tabName)
    if (settings.settings.type === 'group' && value && value.each) {
      return value.each(ElementAttribute.editFormTabsIterator.bind(this, element))
    }
    // In case if tab is single param holder
    return [{
      key: tabName,
      value: value,
      data: settings
    }]
  }

  handleAttributeChange () {
    this.setFieldValue(this.state.elementAccessPoint.cook().toJS())
  }

  handleSectionToggle (e) {
    if (e.currentTarget === e.target || (e.target && e.target.classList && e.target.classList.contains('vcv-ui-edit-form-section-header-title'))) {
      this.setState({ isActive: !this.state.isActive })
    }
  }

  getReplacementItem (elementData, name) {
    const cookElement = Cook.get(elementData)

    if (!cookElement || !cookElement.get('name') || cookElement.get('name') === '--') {
      return null
    }

    const { tag } = elementData
    const elementName = name || cookElement.get('name')
    const publicPathThumbnail = cookElement.get('metaThumbnailUrl')

    const itemContentClasses = classNames({
      'vcv-ui-item-element-content': true,
      'vcv-ui-item-list-item-content--active': !name && this.state.tag === tag
    })
    const itemClasses = classNames({
      'vcv-ui-item-list-item': true,
      'vcv-ui-item-list-item--preset': !!name
    })
    return (
      <li
        key={`vcv-replace-element-${elementName.replace(/ /g, '')}-${tag}`}
        className={itemClasses}
      >
        <span
          className='vcv-ui-item-element'
          onClick={this.onClickReplacement.bind(this, tag, name ? cookElement : null)}
        >
          <span className={itemContentClasses}>
            <img
              className='vcv-ui-item-element-image' src={publicPathThumbnail}
              alt={elementName}
            />
            <span className='vcv-ui-item-overlay'>
              <span className='vcv-ui-item-add vcv-ui-icon vcv-ui-icon-add' />
            </span>
          </span>
          <span className='vcv-ui-item-element-name'>
            <span>
              {elementName}
            </span>
          </span>
        </span>
      </li>
    )
  }

  getReplacements (categorySettings) {
    return categorySettings.elements.map((tag) => {
      return this.getReplacementItem({ tag: tag })
    })
  }

  getPresetReplacements (presets) {
    return presets.map((preset) => {
      return this.getReplacementItem(preset.presetData, preset.name)
    })
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

  handleToggleShowReplace () {
    this.setState({
      isInnerElementReplaceOpened: !this.state.isInnerElementReplaceOpened
    })
  }

  render () {
    let { category, replaceView, exclude } = this.props.options
    category = category || '*'
    const categorySettings = hubElementsService.get(category)
    let replacementBlock = ''
    if (replaceView && replaceView === 'dropdown') {
      const dropdownValues = categorySettings.elements.map(
        (tag) => {
          const cookElementSettings = Cook.getSettings(tag)
          if (!cookElementSettings) {
            return null
          }
          const cookElement = Cook.get({ tag: tag })
          if (!cookElement) {
            return null
          }

          return {
            label: cookElement.get('name'),
            value: tag
          }
        }
      ).filter(Boolean)
      replacementBlock = (
        <div className='vcv-ui-form-group vcv-ui-replace-element-block-dropdown'>
          <Dropdown
            fieldKey='replaceElement'
            updater={this.onClickReplacementDropdown.bind(this)}
            value={this.state.value.tag}
            options={{
              values: dropdownValues
            }}
          />
        </div>
      )
    } else {
      if (this.state.isInnerElementReplaceOpened) {
        const presetsByCategory = hubElementsStorage.action('getPresetsByCategory', category)
        const replacementPresetItems = this.getPresetReplacements(presetsByCategory)
        const replacementItemsOutput = this.getReplacements(categorySettings)
        const replaceElementText = ElementAttribute.localizations ? ElementAttribute.localizations.replaceElementEditForm : 'Replace the element with a different element from the same category.'
        const substituteElementText = ElementAttribute.localizations ? ElementAttribute.localizations.substituteElement : 'Substitute Element'
        const getMoreButtonText = ElementAttribute.localizations ? ElementAttribute.localizations.getMoreElements : 'Get More Elements'
        const hubButtonDescriptionText = ElementAttribute.localizations ? ElementAttribute.localizations.goToHubButtonDescription : 'Access the Visual Composer Hub - download additional elements, blocks, templates, and addons.'

        let moreButtonOutput = null
        if (roleManager.can('hub_elements_templates_blocks', roleManager.defaultTrue())) {
          moreButtonOutput = (
            <div className='vcv-ui-editor-get-more'>
              <button className='vcv-ui-form-button vcv-ui-form-button--large' onClick={this.handleGoToHub}>
                {getMoreButtonText}
              </button>
              <span className='vcv-ui-editor-get-more-description'>{hubButtonDescriptionText}</span>
            </div>
          )
        }

        replacementBlock = (
          <div className='vcv-ui-replace-element-block vcv-ui-replace-element-block--inner'>
            <div className='vcv-ui-replace-element-container'>
              <h2 className='vcv-ui-replace-element-heading'>{substituteElementText}</h2>
              <p className='vcv-ui-replace-element-description'>
                {replaceElementText}
              </p>
              <ul className='vcv-ui-replace-element-list'>
                {replacementPresetItems}
                {replacementItemsOutput}
              </ul>
            </div>
            {moreButtonOutput}
          </div>
        )
      }
    }

    const workspaceSettings = vcCake.getStorage('workspace').state('settings').get()
    const editableElement = workspaceSettings && workspaceSettings.elementAccessPoint ? workspaceSettings.elementAccessPoint.id : false
    const currentElement = this.props.elementAccessPoint.id

    const attributeElementFieldWrapper = (
      <AttributeElementFieldWrapper
        {...this.props}
        onChange={this.handleAttributeChange}
        elementAccessPoint={this.state.elementAccessPoint}
        onDynamicFieldOpen={this.props.onDynamicFieldOpen}
        onDynamicFieldChange={this.props.onDynamicFieldChange}
        onDynamicFieldClose={this.props.onDynamicFieldClose}
        allTabs={this.state.allTabs}
        exclude={exclude}
      />
    )
    if (editableElement !== currentElement) {
      const { options } = this.props
      let { isActive } = this.state
      if (isActive === undefined) {
        isActive = true
      }
      const sectionClasses = classNames({
        'vcv-ui-edit-form-section': true,
        'vcv-ui-edit-form-section--opened': isActive,
        'vcv-ui-edit-form-section--closed': !isActive
      })

      let showReplaceIcon = false
      let backButton = null
      let innerElementReplaceIcon = null

      if (this.props.fieldType === 'element' && !this.props.options.disableReplaceable && this.props.options.replaceView !== 'dropdown') {
        const category = this.props.options.category || '*'
        showReplaceIcon = this.getReplaceShownStatus(category)
      }

      if (showReplaceIcon) {
        const backToParentTitle = ElementAttribute.localizations ? ElementAttribute.localizations.backToParent : 'Back to parent'

        if (this.state.isInnerElementReplaceOpened) {
          backButton = (
            <span className='vcv-ui-edit-form-section-header-go-back' onClick={this.handleToggleShowReplace} title={backToParentTitle}>
              <i className='vcv-ui-icon vcv-ui-icon-chevron-left' />
            </span>
          )
        }
        innerElementReplaceIcon = (
          <span
            className='vcv-ui-edit-form-section-header-control vcv-ui-icon vcv-ui-icon-swap'
            onClick={this.handleToggleShowReplace}
          />
        )
      }

      return (
        <div className={sectionClasses}>
          <div className='vcv-ui-edit-form-section-header' onClick={this.handleSectionToggle}>
            {backButton}
            <span className='vcv-ui-edit-form-section-header-title'>{options.tabLabel}</span>
            {innerElementReplaceIcon}
          </div>
          <div className='vcv-ui-form-element vcv-ui-edit-form-section-content'>
            {replacementBlock && (!replaceView || replaceView !== 'dropdown') ? replacementBlock : (
              <>
                {replacementBlock}
                {attributeElementFieldWrapper}
              </>
            )}
          </div>
        </div>
      )
    } else {
      return (
        <div className='vcv-ui-form-element'>
          {replacementBlock && (!replaceView || replaceView !== 'dropdown') ? replacementBlock : (
            <>
              {replacementBlock}
              {attributeElementFieldWrapper}
            </>
          )}
        </div>
      )
    }
  }
}
