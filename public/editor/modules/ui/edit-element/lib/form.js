import React from 'react'
import classNames from 'classnames'
import EditFormHeaderTabs from './form-header-tabs'
import EditFormFooter from './editFormFooter'
import EditFormContent from './form-content'
import PropTypes from 'prop-types'

export default class EditForm extends React.Component {
  static propTypes = {
    api: PropTypes.object.isRequired,
    element: PropTypes.object.isRequired
  }

  render () {
    let treeContentClasses = classNames({
      'vcv-ui-tree-content': true
    })

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
