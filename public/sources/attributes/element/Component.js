import React from 'react'
import Attribute from '../attribute'
import _ from 'lodash'
import classNames from 'classnames'
import './css/styles.less'
import DependencyManager from '../../../editor/modules/ui/edit-element/lib/dependencies'
import {format} from 'util'
import vcCake from 'vc-cake'
const Cook = vcCake.getService('cook')
const AssetsManager = vcCake.getService('assets-manager')
class ElementAttribute extends Attribute {
  static propTypes = {
    updater: React.PropTypes.func.isRequired,
    api: React.PropTypes.object.isRequired,
    fieldKey: React.PropTypes.string.isRequired,
    value: React.PropTypes.object.isRequired
  }

  updateState (props) {
    let element = Cook.get(props.value)

    return {
      value: props.value,
      tag: props.value.tag,
      update: true,
      element: element,
      allTabs: ElementAttribute.updateTabs(element)
    }
  }

  onClickReplacement = (element, e) => {
    let cookElement = Cook.get(element)

    this.setState({
      value: element,
      tag: element.tag,
      update: true,
      element: cookElement,
      allTabs: ElementAttribute.updateTabs(cookElement)
    })
  }

  static updateTabs (element) {
    let tabs = []
    ElementAttribute.editFormTabs(element).map((tab, index) => {
      let tabsData = {
        id: tab.key,
        index: index,
        data: tab.data,
        params: ElementAttribute.editFormTabParams(element, tab.key),
        key: `element-params-tab-${tab.key}`
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

  getForm (tabIndex) {
    let tab = this.state.allTabs[ tabIndex ]

    return tab.params.map(this.getFormParamField.bind(this, tabIndex))
  }

  getFormParamField (tabIndex, param) {
    const updater = (key, value) => {
      this.state.element.set(key, value)
      this.props.updater(this.props.fieldKey, this.state.element.toJS(true))
      this.setState({
        value: this.state.element.toJS(true),
        update: false
      })
    }

    return this.field(this.state.element, param.key, updater, tabIndex)
  }

  field (element, key, updater, tabIndex) {
    let { type, settings } = element.settings(key)
    let AttributeComponent = type.component
    if (!AttributeComponent) {
      return null
    }
    let label = ''
    if (!settings) {
      throw new Error(format('Wrong attribute %s', key))
    }
    const { options } = settings
    if (!type) {
      throw new Error(format('Wrong type of attribute %s', key))
    }
    if (options && typeof (options.label) === 'string') {
      label = (<span className='vcv-ui-form-group-heading'>{options.label}</span>)
    }
    let description = ''
    if (options && typeof (options.description) === 'string') {
      description = (<p className='vcv-ui-form-helper'>{options.description}</p>)
    }
    let rawValue = type.getRawValue(element.data, key)
    let value = type.getValue(settings, element.data, key)

    let content = (
      <div className='vcv-ui-form-group' key={'form-group-' + key}>
        {label}
        <AttributeComponent
          key={'element-attribute-' + key + element.get('id')}
          fieldKey={key}
          options={options}
          value={rawValue}
          updater={updater}
          update={this.state.update}
          api={this.props.api}
        />
        {description}
      </div>
    )
    let data = {
      key: key,
      options: options,
      type: type,
      value: value,
      rawValue: rawValue,
      updater: updater,
      getRef: (key) => {
        return this.refs[ 'form-element-' + key ]
      },
      tabIndex: tabIndex,
      getRefTab: (index) => {
        return this.refs[ 'form-element-tab-' + index ]
      }
    }

    return (
      <DependencyManager
        ref={'form-element-' + key}
        key={'element-dependency-' + key}
        api={this.props.api}
        data={data}
        element={element}
        content={content} />
    )
  }

  render () {
    let content = []

    this.state.allTabs.forEach((tab) => {
      let plateClass = classNames({}, `vcv-ui-editor-plate-${tab.id}`)
      content.push(
        <div key={'element-plate-visible' + this.state.allTabs[ tab.index ].id} className={plateClass}>
          {this.getForm(tab.index)}
        </div>
      )
    })
    let elementsList = Cook.list.settings()

    let replacements = []

    _.filter(elementsList, (element) => {
      if (element.group === 'icon') {
        let cookElement = Cook.get(element)

        let nameClasses = classNames({
          'vcv-ui-add-element-badge vcv-ui-badge-success': false,
          'vcv-ui-add-element-badge vcv-ui-badge-warning': false
        })

        // Possible overlays:

        // <span className="vcv-ui-add-element-add vcv-ui-icon vcv-ui-icon-add"></span>

        // <span className='vcv-ui-add-element-edit'>
        //   <span className='vcv-ui-add-element-move vcv-ui-icon vcv-ui-icon-drag-dots'></span>
        //   <span className='vcv-ui-add-element-remove vcv-ui-icon vcv-ui-icon-close'></span>
        // </span>
        let publicPathThumbnail = AssetsManager.getPublicPath(cookElement.get('tag'), cookElement.get('metaThumbnail'))

        replacements.push(
          <li className='vcv-ui-add-element-list-item'>
            <a className='vcv-ui-add-element-element' onClick={this.onClickReplacement.bind(this, element)}>
              <span className='vcv-ui-add-element-element-content'>
                <img className='vcv-ui-add-element-element-image' src={publicPathThumbnail}
                  alt='' />
                <span className='vcv-ui-add-element-overlay'>
                  <span className='vcv-ui-add-element-add vcv-ui-icon vcv-ui-icon-add'></span>
                </span>
              </span>
              <span className='vcv-ui-add-element-element-name'>
                <span className={nameClasses}>
                  {element.name}
                </span>
              </span>
            </a>
          </li>)
      }
    })

    return (
      <div className='vcv-ui-form-element'>
        <ul className='vcv-ui-replace-element-list'>
          {replacements}
        </ul>
        {content}
        {JSON.stringify(this.state)}
      </div>
    )
  }
}

export default ElementAttribute
