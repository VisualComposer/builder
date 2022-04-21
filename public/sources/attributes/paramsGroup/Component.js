import React from 'react'
import Attribute from '../attribute'
import DynamicAttribute from '../dynamicField/dynamicAttribute'
import lodash from 'lodash'
import { getStorage, getService, env } from 'vc-cake'
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc'

const workspaceStorage = getStorage('workspace')
const { getBlockRegexp } = getService('utils')
const blockRegexp = getBlockRegexp()
const dataManager = getService('dataManager')

export default class ParamsGroupAttribute extends Attribute {
  static defaultProps = {
    fieldType: 'paramsGroup'
  }

  constructor (props) {
    super(props)
    this.handleAddClick = this.handleAddClick.bind(this)
    this.clickClone = this.clickClone.bind(this)
    this.clickDelete = this.clickDelete.bind(this)
    this.clickEdit = this.clickEdit.bind(this)
    this.handleEditableClick = this.handleEditableClick.bind(this)
    this.handleEditableBlur = this.handleEditableBlur.bind(this)
    this.handleEditableKeyDown = this.handleEditableKeyDown.bind(this)

    this.getSortableHandle = this.getSortableHandle.bind(this)
    this.getSortableList = this.getSortableList.bind(this)
    this.getSortableItems = this.getSortableItems.bind(this)
  }

  onParamChange (index, elementAccessPoint, paramFieldKey, newValue) {
    const { updater, fieldKey, fieldType } = this.props
    const { value } = this.state
    value.value[index][paramFieldKey] = newValue
    elementAccessPoint.set(fieldKey, value)
    updater(fieldKey, value, null, fieldType)
  }

  updateState (props) {
    if (props.value.value) {
      return {
        value: props.value,
        editable: {}
      }
    } else {
      const value = {}
      value.value = props.value
      return {
        value: value,
        editable: {}
      }
    }
  }

  setFieldValue (value) {
    const { updater, fieldKey, fieldType } = this.props
    updater(fieldKey, value, null, fieldType)
    this.setState({ value: value })
  }

  clickEdit (index) {
    const groupData = this.state.value.value[index]
    const attrOptions = this.props.options.settings.title.options
    const isDynamic = env('VCV_JS_FT_DYNAMIC_FIELDS') && attrOptions && attrOptions.dynamicField && groupData.title.match(blockRegexp)
    let groupTitle = groupData.title
    if (isDynamic) {
      const blockInfo = groupData.title.split(blockRegexp)
      groupTitle = JSON.parse(blockInfo[4].trim()).currentValue
    }
    const options = {
      nestedAttr: true,
      parentElementId: this.props.elementAccessPoint.id,
      activeParamGroup: groupData,
      activeParamGroupTitle: groupTitle,
      activeParamGroupIndex: index,
      fieldKey: this.props.fieldKey,
      customUpdater: this.onParamChange.bind(this)
    }
    // TODO: Improve nesting edit form opening
    workspaceStorage.trigger('edit', this.props.elementAccessPoint.id, this.props.elementAccessPoint.tag, options)
  }

  handleAddClick () {
    const { value } = this.state.value
    const { options } = this.props
    const { settings } = options
    const newValue = {}
    Object.keys(settings).forEach((settingKey) => {
      if (settings[settingKey].access === 'public') {
        newValue[settingKey] = settings[settingKey].value
      }
    })
    newValue.title = options.title || 'Group title'
    value.push(lodash.defaultsDeep({}, newValue))
    const newState = {
      value: value
    }
    this.setFieldValue(newState)
  }

  clickClone (index) {
    const { value } = this.state.value
    value.push(lodash.defaultsDeep({}, value[index]))
    const newState = {
      value: value
    }
    this.setFieldValue(newState)
  }

  clickDelete (index) {
    const { value } = this.state.value
    value.splice(index, 1)
    const newState = {
      value: value
    }
    this.setFieldValue(newState)
  }

  getSortableItems () {
    const SortableItem = SortableElement(({ value, groupIndex }) => {
      const controlLabelClasses = 'vcv-ui-tree-layout-control-label'
      const attrOptions = this.props.options.settings.title.options
      const isDynamic = env('VCV_JS_FT_DYNAMIC_FIELDS') && attrOptions && attrOptions.dynamicField && value.title.match(blockRegexp)
      let title = value.title
      if (isDynamic) {
        const blockInfo = value.title.split(blockRegexp)
        title = JSON.parse(blockInfo[4].trim()).currentValue
      }

      return (
        <div className='vcv-ui-form-params-group-item vcv-ui-tree-layout-control'>
          {this.getSortableHandle()}
          <div className='vcv-ui-tree-layout-control-content'>
            <span className={controlLabelClasses}>
              <span
                className='vcv-ui-forms-params-group-content-editable'
                ref={span => { this[`title${groupIndex}`] = span }}
                contentEditable
                suppressContentEditableWarning
                onKeyDown={this.handleEditableKeyDown}
                onClick={this.handleEditableClick}
                onBlur={this.handleEditableBlur}
                data-index={groupIndex}
              >
                {title}
              </span>
            </span>
            {this.getChildControls(groupIndex)}
          </div>
        </div>
      )
    })

    return this.state.value.value.map((group, index) => {
      return (
        <SortableItem
          key={`sortable-item-paramgroup-${index}`}
          index={index}
          value={group}
          groupIndex={index}
        />
      )
    })
  }

  handleEditableClick (e) {
    e.currentTarget.closest('.vcv-ui-tree-layout-control-label').classList.add('vcv-ui-tree-layout-control-label-editable')
  }

  handleEditableBlur (event) {
    const groupIndex = event.currentTarget.getAttribute('data-index')
    const value = event.currentTarget.innerText.trim()
    this.updateContent(value, groupIndex)
  }

  handleEditableKeyDown (event) {
    const groupIndex = event.currentTarget.getAttribute('data-index')
    if (event.key === 'Enter') {
      event.preventDefault()
      event.nativeEvent.stopImmediatePropagation()
      event.stopPropagation()
      this[`title${groupIndex}`].blur()
      this.handleEditableBlur(event)
    }
  }

  updateContent (value, groupIndex) {
    const { elementAccessPoint } = this.props
    if (!value) {
      value = this.props.options.title
      this[`title${groupIndex}`].innerText = value
    }

    this.onParamChange(groupIndex, elementAccessPoint, 'title', value)

    this.setState({
      editable: {}
    })
  }

  getSortableList () {
    const SortableList = SortableContainer(() => {
      return (
        <div>
          {this.getSortableItems()}
        </div>
      )
    })

    const handleSortEnd = ({ oldIndex, newIndex }) => {
      const newState = this.state.value
      newState.value = arrayMove(this.state.value.value, oldIndex, newIndex)
      this.setFieldValue(newState)
    }

    const useDragHandle = true

    return (
      <SortableList
        lockAxis='y'
        useDragHandle={useDragHandle}
        helperClass='vcv-ui-form-params-group-item--dragging'
        onSortEnd={handleSortEnd}
        items={this.state.value.value}
      />
    )
  }

  getSortableHandle () {
    const SortableHandler = SortableHandle(() => {
      const dragHelperClasses = 'vcv-ui-tree-layout-control-drag-handler vcv-ui-drag-handler'
      return (
        <div className={dragHelperClasses}>
          <i className='vcv-ui-drag-handler-icon vcv-ui-icon vcv-ui-icon-drag-dots' />
        </div>
      )
    })

    return (<SortableHandler />)
  }

  getChildControls (index) {
    const { value } = this.state
    const { options } = this.props
    let maximum = false
    let minimum = false
    if (options.max && value && value.value && value.value.length >= options.max) {
      maximum = true
    }

    if (options.min && value && value.value && value.value.length <= options.min) {
      minimum = true
    }

    if (value && value.value && value.value.length <= 1) {
      minimum = true
    }

    const localizations = dataManager.get('localizations')
    const cloneText = localizations ? localizations.clone : 'Clone'
    const removeText = localizations ? localizations.remove : 'Remove'
    const editText = localizations ? localizations.edit : 'Edit'

    let cloneContent = null
    if (!maximum) {
      cloneContent = (
        <span className='vcv-ui-tree-layout-control-action' title={cloneText} onClick={() => { this.clickClone(index) }}>
          <i className='vcv-ui-icon vcv-ui-icon-copy' />
        </span>
      )
    }
    let deleteContent = null
    if (!minimum) {
      deleteContent = (
        <span className='vcv-ui-tree-layout-control-action' title={removeText} onClick={() => { this.clickDelete(index) }}>
          <i className='vcv-ui-icon vcv-ui-icon-trash' />
        </span>
      )
    }

    return (
      <div className='vcv-ui-tree-layout-control-actions-container'>
        <span className='vcv-ui-tree-layout-control-actions'>
          <span className='vcv-ui-tree-layout-control-action' title={editText} onClick={() => { this.clickEdit(index) }}>
            <i className='vcv-ui-icon vcv-ui-icon-edit' />
          </span>
          {cloneContent}
          {deleteContent}
        </span>
      </div>
    )
  }

  render () {
    const { value } = this.state
    const { options } = this.props
    let maximum = false
    if (options.max && value && value.value && value.value.length >= options.max) {
      maximum = true
    }

    const localizations = dataManager.get('localizations')
    const addText = localizations ? localizations.add : 'Add'
    let addContent = null
    if (!maximum) {
      addContent = (
        <div className='vcv-ui-form-params-group-add-item vcv-ui-icon vcv-ui-icon-add' onClick={this.handleAddClick} title={addText} />
      )
    }

    return (
      <DynamicAttribute {...this.props} setFieldValue={this.setFieldValue} value={value}>
        {value.value && value.value.length ? null : (
          <div className='vcv-ui-form-group-heading'>{options.title}</div>
        )}
        <div className='vcv-ui-form-params-group'>
          {this.getSortableList()}
          {addContent}
        </div>
      </DynamicAttribute>
    )
  }
}
