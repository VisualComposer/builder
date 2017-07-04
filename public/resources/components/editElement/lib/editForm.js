import React from 'react'
import classNames from 'classnames'
import EditFormTabsOutput from './editFormTabsOutput.js'
import EditFormContent from './editFormContent'
import vcCake from 'vc-cake'

const hubCategories = vcCake.getService('hubCategories')

export default class EditForm extends React.Component {
  static propTypes = {
    element: React.PropTypes.object.isRequired
  }

  render () {
    const { element } = this.props
    let treeContentClasses = classNames({
      'vcv-ui-tree-content': true
    })

    if (vcCake.env('EDIT_FORM_ACCORDION')) {
      return (
        <div className='vcv-ui-tree-view-content vcv-ui-tree-view-content-accordion'>
          <div className='vcv-ui-edit-form-header'>
            <img src={hubCategories.getElementIcon(element.get('tag'))} title={element.data.name} />
            <span className='vcv-ui-edit-form-header-title'>{element.data.name}</span>
          </div>
          <div className={treeContentClasses}>
            <EditFormContent {...this.props} />
          </div>
        </div>
      )
    }

    return (
      <div className='vcv-ui-tree-view-content'>
        <div className={treeContentClasses}>
          <EditFormTabsOutput {...this.props} />
          <EditFormContent {...this.props} />
        </div>
      </div>
    )
  }
}
