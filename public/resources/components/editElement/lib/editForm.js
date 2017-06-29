import React from 'react'
import classNames from 'classnames'
import EditFormTabsOutput from './editFormTabsOutput.js'
import EditFormContent from './editFormContent'
import vcCake from 'vc-cake'

export default class EditForm extends React.Component {
  static propTypes = {
    element: React.PropTypes.object.isRequired
  }

  render () {
    let treeContentClasses = classNames({
      'vcv-ui-tree-content': true
    })

    if (vcCake.env('EDIT_FORM_ACCORDION')) {
      return (
        <div className='vcv-ui-tree-view-content'>
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
