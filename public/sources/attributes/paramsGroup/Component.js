import React from 'react'
import Attribute from '../attribute'

export default class ParamsGroupAttribute extends Attribute {
  constructor (props) {
    super(props)
    this.clickClone = this.clickClone.bind(this)
    this.clickDelete = this.clickDelete.bind(this)
    this.clickEdit = this.clickEdit.bind(this)
  }

  clickEdit () {

  }

  clickClone () {

  }

  clickDelete () {

  }

  getGroupList () {
    let editable = false
    let dragHelperClasses = 'vcv-ui-tree-layout-control-drag-handler vcv-ui-drag-handler'
    let controlLabelClasses = 'vcv-ui-tree-layout-control-label'
    if (editable) {
      controlLabelClasses += ' vcv-ui-tree-layout-control-label-editable'
    }
    let result = []

    if (this.props.options.groups.length) {
      this.props.options.groups.forEach((group, index) => {
        result.push(
          <div className='vcv-ui-form-params-group-item vcv-ui-tree-layout-control' key={`param-group-${group}-${index}`}>
            <div className={dragHelperClasses}>
              <i className='vcv-ui-drag-handler-icon vcv-ui-icon vcv-ui-icon-drag-dots' />
            </div>
            <div className='vcv-ui-tree-layout-control-content'>
              <span className={controlLabelClasses}>
                <span ref={span => { this.span = span }}
                  contentEditable={editable}
                  suppressContentEditableWarning>
                  {group}
                </span>
              </span>
              {this.getChildContols()}
            </div>
          </div>
        )
      })
    } else {
      result = null
    }

    return result
  }

  getChildContols () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const cloneText = localizations ? localizations.clone : 'Clone'
    const removeText = localizations ? localizations.remove : 'Remove'
    const editText = localizations ? localizations.edit : 'Edit'
    return (<span className='vcv-ui-tree-layout-control-actions'>
      <span className='vcv-ui-tree-layout-control-action' title={cloneText} onClick={this.clickClone}>
        <i className='vcv-ui-icon vcv-ui-icon-copy' />
      </span>
      <span className='vcv-ui-tree-layout-control-action' title={removeText} onClick={this.clickDelete}>
        <i className='vcv-ui-icon vcv-ui-icon-trash' />
      </span>
      <span className='vcv-ui-tree-layout-control-action' title={editText} onClick={this.clickEdit}>
        <i className='vcv-ui-icon vcv-ui-icon-arrow-right' />
      </span>
    </span>)
  }

  render () {
    return (
      <div className='vcv-ui-form-params-group'>
        {this.getGroupList()}
        <div className='vcv-ui-form-params-group-add-item vcv-ui-icon vcv-ui-icon-add' />
      </div>
    )
  }
}
