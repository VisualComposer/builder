import React from 'react'
import Attribute from '../attribute'
import { getStorage } from 'vc-cake'
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc'

const workspaceStorage = getStorage('workspace')

export default class ParamsGroupAttribute extends Attribute {
  constructor (props) {
    super(props)
    this.state = {
      groups: this.props.options.groups
    }
    this.clickAdd = this.clickAdd.bind(this)
    this.clickClone = this.clickClone.bind(this)
    this.clickDelete = this.clickDelete.bind(this)
    this.clickEdit = this.clickEdit.bind(this)

    this.getSortableHandle = this.getSortableHandle.bind(this)
    this.getSortableList = this.getSortableList.bind(this)
    this.getSortableItems = this.getSortableItems.bind(this)
  }

  clickEdit (e) {
    const groupName = e.currentTarget.getAttribute('data-group-name')
    const element = this.props.element.toJS()
    const options = {
      descendant: true,
      attributes: this.props.options.parameters,
      activeParamGroup: groupName,
      paramFieldKey: this.props.fieldKey
    }
    workspaceStorage.trigger('edit', element.id, element.tag, options)
  }

  clickAdd () {
    let result = this.state.groups
    result.push('Group title')
    this.setState({
      groups: result
    })
  }

  clickClone (index) {
    let result = this.state.groups
    result.push(this.state.groups[ index ])
    this.setState({
      groups: result
    })
  }

  clickDelete (index) {
    let result = this.state.groups
    result.splice(index, 1)
    this.setState({
      groups: result
    })
  }

  getSortableItems () {
    const SortableItem = SortableElement(({ value, groupIndex }) => {
      let editable = false
      let controlLabelClasses = 'vcv-ui-tree-layout-control-label'
      if (editable) {
        controlLabelClasses += ' vcv-ui-tree-layout-control-label-editable'
      }

      return (
        <div className='vcv-ui-form-params-group-item vcv-ui-tree-layout-control'>
          {this.getSortableHandle()}
          <div className='vcv-ui-tree-layout-control-content'>
            <span className={controlLabelClasses}>
              <span ref={span => { this.span = span }}
                contentEditable={editable}
                suppressContentEditableWarning>
                {value}
              </span>
            </span>
            {this.getChildControls(groupIndex)}
          </div>
        </div>
      )
    })

    let result = []

    this.state.groups.forEach((group, index) => {
      result.push(
        <SortableItem key={`sortable-item-paramgroup-${index}`}
          index={index}
          value={group}
          groupIndex={index} />
      )
    })

    return result
  }

  getSortableList () {
    const SortableList = SortableContainer(() => {
      return (
        <div>
          {this.getSortableItems()}
        </div>
      )
    })

    const onSortEnd = ({ oldIndex, newIndex }) => {
      this.setState({
        groups: arrayMove(this.state.groups, oldIndex, newIndex)
      })
    }

    let useDragHandle = true

    return (
      <SortableList lockAxis={'y'}
        useDragHandle={useDragHandle}
        helperClass={'vcv-ui-form-params-group-item--dragging'}
        onSortEnd={onSortEnd}
        items={this.state.groups} />
    )
  }

  getSortableHandle () {
    const SortableHandler = SortableHandle(() => {
      let dragHelperClasses = 'vcv-ui-tree-layout-control-drag-handler vcv-ui-drag-handler'
      return (
        <div className={dragHelperClasses}>
          <i className='vcv-ui-drag-handler-icon vcv-ui-icon vcv-ui-icon-drag-dots' />
        </div>
      )
    })

    return (<SortableHandler />)
  }

  getChildControls (index) {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const cloneText = localizations ? localizations.clone : 'Clone'
    const removeText = localizations ? localizations.remove : 'Remove'
    const editText = localizations ? localizations.edit : 'Edit'
    return (
      <div className='vcv-ui-tree-layout-control-actions-container'>
        <span className='vcv-ui-tree-layout-control-actions'>
          <span className='vcv-ui-tree-layout-control-action' title={cloneText} onClick={() => { this.clickClone(index) }}>
            <i className='vcv-ui-icon vcv-ui-icon-copy' />
          </span>
          <span className='vcv-ui-tree-layout-control-action' title={removeText} onClick={() => { this.clickDelete(index) }}>
            <i className='vcv-ui-icon vcv-ui-icon-trash' />
          </span>
        </span>
        <span className='vcv-ui-tree-layout-control-action' title={editText} onClick={() => { this.clickEdit(index) }}>
          <i className='vcv-ui-icon vcv-ui-icon-arrow-right' />
        </span>
      </div>
    )
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const addText = localizations ? localizations.add : 'Add'
    return (
      <React.Fragment>
        {this.state.groups.length ? null : (
          <div className='vcv-ui-form-group-heading'>{this.props.options.title}</div>
        )}
        <div className='vcv-ui-form-params-group'>
          {this.getSortableList()}
          <div className='vcv-ui-form-params-group-add-item vcv-ui-icon vcv-ui-icon-add' onClick={this.clickAdd} title={addText} />
        </div>
      </React.Fragment>
    )
  }
}
