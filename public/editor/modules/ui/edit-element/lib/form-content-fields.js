import React from 'react'
import classNames from 'classnames'
import EditFormFieldDependencies from './field-dependencies'

export default class EditFormFieldsForm extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    element: React.PropTypes.object.isRequired,
    activeTab: React.PropTypes.object.isRequired,
    callFieldActivities: React.PropTypes.func.isRequired,
    onElementChange: React.PropTypes.func.isRequired
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
