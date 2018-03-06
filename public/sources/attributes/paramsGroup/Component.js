import React from 'react'
import Attribute from '../attribute'

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
  }

  clickAdd () {
    let result = this.state.groups
    result.push('Group title')
    this.setState({
      groups: result
    })
  }

  clickEdit () {

  }

  clickClone (index) {
    let result = this.state.groups
    result.push(this.state.groups[index])
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

  getGroupList () {
    let editable = false
    let dragHelperClasses = 'vcv-ui-tree-layout-control-drag-handler vcv-ui-drag-handler'
    let controlLabelClasses = 'vcv-ui-tree-layout-control-label'
    if (editable) {
      controlLabelClasses += ' vcv-ui-tree-layout-control-label-editable'
    }
    let result = []

    if (this.state.groups.length) {
      this.state.groups.forEach((group, index) => {
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
              {this.getChildContols(index)}
            </div>
          </div>
        )
      })
    } else {
      result = null
    }

    return result
  }

  getChildContols (index) {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const cloneText = localizations ? localizations.clone : 'Clone'
    const removeText = localizations ? localizations.remove : 'Remove'
    const editText = localizations ? localizations.edit : 'Edit'
    return (<span className='vcv-ui-tree-layout-control-actions'>
      <span className='vcv-ui-tree-layout-control-action' title={cloneText} onClick={() => { this.clickClone(index) }}>
        <i className='vcv-ui-icon vcv-ui-icon-copy' />
      </span>
      <span className='vcv-ui-tree-layout-control-action' title={removeText} onClick={() => { this.clickDelete(index) }}>
        <i className='vcv-ui-icon vcv-ui-icon-trash' />
      </span>
      <span className='vcv-ui-tree-layout-control-action' title={editText} onClick={() => { this.clickEdit(index) }}>
        <i className='vcv-ui-icon vcv-ui-icon-arrow-right' />
      </span>
    </span>)
  }

  render () {
    return (
      <React.Fragment>
        {this.state.groups.length ? null : (<div className='vcv-ui-form-group-heading'>{this.props.options.title}</div>
        )}
        <div className='vcv-ui-form-params-group'>
          {this.getGroupList()}
          <div className='vcv-ui-form-params-group-add-item vcv-ui-icon vcv-ui-icon-add' onClick={this.clickAdd} />
        </div>
      </React.Fragment>
    )
  }
}
