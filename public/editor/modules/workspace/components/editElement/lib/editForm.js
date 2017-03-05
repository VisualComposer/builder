import React from 'react'
import classNames from 'classnames'
import EditFormTabsOutput from './editFormTabsOutput.js'
import EditFormFooter from './editFormFooter'
import EditFormContent from './editFormContent'

export default class EditForm extends React.Component {
  static propTypes = {
    element: React.PropTypes.object.isRequired
  }

  render () {
    let treeContentClasses = classNames({
      'vcv-ui-tree-content': true
    })

    return (
      <div className='vcv-ui-tree-view-content'>
        <div className={treeContentClasses}>
          <EditFormTabsOutput {...this.props} />
          <EditFormContent {...this.props} />
          <EditFormFooter {...this.props} />
        </div>
      </div>
    )
  }
}
