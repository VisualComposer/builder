import React from 'react'
import classNames from 'classnames'
import EditFormHeaderTabs from './form-header-tabs'
import EditFormFooter from './form-footer'
import EditFormContent from './form-content'

export default class EditForm extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    element: React.PropTypes.object.isRequired
  }

  render () {
    let treeContentClasses = classNames({
      'vcv-ui-tree-content': true
    })
    // <EditFormContent {...this.props} />
    // <EditFormFooter {...this.props} />

    return (
      <div className='vcv-ui-tree-view-content'>
        <div className={treeContentClasses}>
          <EditFormHeaderTabs {...this.props} />
          <EditFormContent {...this.props} />
          <EditFormFooter {...this.props} />
        </div>
      </div>
    )
  }
}
