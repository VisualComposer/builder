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
const hubCategoriesService = vcCake.getService('hubCategories')

export default class ElementAttribute extends Attribute {
  static defaultProps = {
    fieldType: 'element'
  }

  static propTypes = {
    updater: PropTypes.func.isRequired,
    // api: PropTypes.object.isRequired,
    fieldKey: PropTypes.string.isRequired,
    value: PropTypes.object.isRequired,
    elementAccessPoint: PropTypes.object.isRequired,
    options: PropTypes.any,
    id: PropTypes.string
  }

  constructor (props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.onClickReplacement = this.onClickReplacement.bind(this)
    this.changeShowReplacements = this.changeShowReplacements.bind(this)
    this.toggleSection = this.toggleSection.bind(this)
  }

  updateState (props) {
    let valueElementAccessPoint = elementAccessPointService.getInstance(null, props.value)

    return {
      allValues: Object.assign({}, props.value),
      value: props.value,
      tag: props.value.tag,
      elementAccessPoint: valueElementAccessPoint,
      allTabs: ElementAttribute.updateTabs(valueElementAccessPoint.cook())
    }
  }

  onClickReplacement (newElement) {
    newElement.id = this.state.value.id
    let valueElementAccessPoint = elementAccessPointService.getInstance(null, newElement)
    let cookElement = valueElementAccessPoint.cook()
    let allValues = Object.assign({}, this.state.allValues, this.state.value)
    if (this.props.options && this.props.options.merge) {
      Object.keys(cookElement.toJS()).forEach((key) => {
        if (allValues[ key ] !== undefined) {
          // Merge, Type, Key
          let findKey = this.props.options.merge.attributes.findIndex((item) => {
            // eslint-disable-next-line valid-typeof
            return item.key === key && item.type === typeof allValues[ key ]
          })
          if (findKey > -1) {
            // Merge the value
            cookElement.set(key, allValues[ key ])
            valueElementAccessPoint.set(key, allValues[ key ])
          }
        }
      })
    }

    let values = cookElement.toJS()
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
    this.onClickReplacement({ tag: newElement })
  }

  changeShowReplacements () {
    this.setState({ showReplacements: !this.state.showReplacements })
  }

  static updateTabs (element) {
    let tabs = []
    ElementAttribute.editFormTabs(element).map((tab, index) => {
      let tabsData = {
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
    return [ {
      key: tabName,
      value: value,
      data: settings
    } ]
  }

  onChange () {
    this.setFieldValue(this.state.elementAccessPoint.cook().toJS())
  }

  toggleSection () {
    this.setState({ isActive: !this.state.isActive })
  }

  render () {
    let { category, tabLabel, replaceView, exclude } = this.props.options
    let replacements = ''
    category = category || '*'
    let elementLabel = (tabLabel && tabLabel.toLowerCase()) || category.toLowerCase() || 'element'
    let categorySettings = hubCategoriesService.get(category)
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const replaceElementText = localizations.replaceElementText.split('{elementLabel}').join(elementLabel)
    if (categorySettings && this.state.showReplacements) {
      let replacementItemsOutput = categorySettings.elements.map((tag) => {
        let cookElement = Cook.get({ tag: tag })
        if (!cookElement || !cookElement.get('name') || cookElement.get('name') === '--') {
          return null
        }
        let nameClasses = classNames({
          'vcv-ui-item-badge vcv-ui-badge--success': false,
          'vcv-ui-item-badge vcv-ui-badge--warning': false
        })
        let itemContentClasses = classNames({
          'vcv-ui-item-element-content': true,
          'vcv-ui-item-list-item-content--active': this.state.tag === tag
        })

        let publicPathThumbnail = cookElement.get('metaThumbnailUrl')

        return <li key={'vcv-replace-element-' + cookElement.get('tag')} className='vcv-ui-item-list-item'>
          <span
            className='vcv-ui-item-element'
            onClick={this.onClickReplacement.bind(this, { tag: tag })}
          >
            <span className={itemContentClasses}>
              <img className='vcv-ui-item-element-image' src={publicPathThumbnail}
                alt={cookElement.get('name')} />
              <span className='vcv-ui-item-overlay'>
                <span className='vcv-ui-item-add vcv-ui-icon vcv-ui-icon-add' />
              </span>
            </span>
            <span className='vcv-ui-item-element-name'>
              <span className={nameClasses}>
                {cookElement.get('name')}
              </span>
            </span>
          </span>
        </li>
      })

      replacements = (
        <div className='vcv-ui-replace-element-container'>
          <span className='vcv-ui-replace-element-hide' title='Close' onClick={this.changeShowReplacements}>
            <i className='vcv-layout-bar-content-hide-icon vcv-ui-icon vcv-ui-icon-close-thin' />
          </span>
          <ul className='vcv-ui-replace-element-list'>
            {replacementItemsOutput}
          </ul>
        </div>
      )
    } else {
      replacements = (
        <div>
          <p
            className='vcv-ui-form-helper'
          >
            {replaceElementText}

          </p>
          <button type='button' className='vcv-ui-form-button vcv-ui-form-button--default'
            onClick={this.changeShowReplacements}>
            Replace {elementLabel}
          </button>
        </div>
      )
    }

    let replacementBlock = ''
    if (categorySettings && categorySettings.elements && categorySettings.elements.length > 1) {
      // TODO: show another wrapper
      if (replaceView && replaceView === 'dropdown') {
        let dropdownValues = categorySettings.elements.map(
          (tag) => {
            let cookElement = Cook.get({ tag: tag })
            if (!cookElement) {
              return {}
            }
            return {
              label: cookElement.get('name'),
              value: tag
            }
          }
        )
        replacementBlock = (
          <div className='vcv-ui-form-group vcv-ui-replace-element-block-dropdown'>
            <Dropdown
              fieldKey='replaceElement'
              updater={this.onClickReplacementDropdown.bind(this)} // TODO: Tag
              value={this.state.value.tag}
              options={{
                values: dropdownValues
              }}
            />
          </div>
        )
      } else {
        replacementBlock = (
          <div className='vcv-ui-replace-element-block'>
            {replacements}
          </div>
        )
      }
    }

    const workspaceSettings = vcCake.getStorage('workspace').state('settings').get()
    const editableElement = workspaceSettings && workspaceSettings.elementAccessPoint ? workspaceSettings.elementAccessPoint.id : false
    const currentElement = this.props.elementAccessPoint.id

    if (editableElement !== currentElement) {
      const { options } = this.props
      let { isActive } = this.state
      let sectionClasses = classNames({
        'vcv-ui-edit-form-section': true,
        'vcv-ui-edit-form-section--opened': isActive,
        'vcv-ui-edit-form-section--closed': !isActive
      })
      return <div className={sectionClasses}>
        <div className='vcv-ui-edit-form-section-header' onClick={this.toggleSection}>
          {options.tabLabel}
        </div>
        <div className='vcv-ui-form-element vcv-ui-edit-form-section-content'>
          {replacementBlock}
          <AttributeElementFieldWrapper
            onChange={this.onChange}
            elementAccessPoint={this.state.elementAccessPoint}
            allTabs={this.state.allTabs}
            exclude={exclude}
          />
        </div>
      </div>
    } else {
      return <div className='vcv-ui-form-element'>
        {replacementBlock}
        <AttributeElementFieldWrapper
          onChange={this.onChange}
          elementAccessPoint={this.state.elementAccessPoint}
          handleDynamicFieldOpen={this.props.handleDynamicFieldOpen}
          handleDynamicFieldChange={this.props.handleDynamicFieldChange}
          handleDynamicFieldClose={this.props.handleDynamicFieldClose}
          allTabs={this.state.allTabs}
          exclude={exclude}
        />
      </div>
    }
  }
}
