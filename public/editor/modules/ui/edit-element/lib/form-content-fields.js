import React from 'react'
import classNames from 'classnames'
import EditFormFieldDependencies from './field-dependencies'
import PropTypes from 'prop-types'

export default class EditFormFieldsForm extends React.Component {
  static propTypes = {
    api: PropTypes.object.isRequired,
    element: PropTypes.object.isRequired,
    activeTab: PropTypes.object.isRequired,
    callFieldActivities: PropTypes.func.isRequired,
    onElementChange: PropTypes.func.isRequired
  }

  field = (field) => {
    return (
      <EditFormFieldDependencies
        {...this.props}
        key={`edit-form-field-${field.key}`}
        fieldKey={field.key}
        updater={this.props.onElementChange}
      />
    )
  }

  render () {
    let { activeTab } = this.props

    let plateClass = classNames({
      'vcv-ui-editor-plate': true,
      'vcv-ui-state--active': true
    }, `vcv-ui-editor-plate-${activeTab.key}`)

    return (
      <div key={`plate-visible-${activeTab.key}`} className={plateClass}>
        {this.props.activeTab.params.map(this.field)}
      </div>
    )
  }
}
