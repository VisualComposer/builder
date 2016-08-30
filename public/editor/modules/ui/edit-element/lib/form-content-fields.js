import React from 'react'
import classNames from 'classnames'
import EditFormField from './field'

export default class EditFormFieldsForm extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    element: React.PropTypes.object.isRequired,
    activeTab: React.PropTypes.object.isRequired
  }

  field = (field) => {
    const updater = (key, value) => {
      this.props.element.set(key, value)
      this.props.api.notify('element:set', { key: key, value: value })
    }

    return (
      <EditFormField
        {...this.props}
        key={`edit-form-field-${field.key}`}
        fieldKey={field.key}
        updater={updater}
      />
    )
  }

  render () {
    let { activeTab } = this.props

    let plateClass = classNames({
      'vcv-ui-editor-plate': true,
      'vcv-ui-state--active': true
    }, `vcv-ui-editor-plate-${activeTab.id}`)

    return (
      <div key={`plate-visible-${activeTab.id}`} className={plateClass}>
        {this.props.activeTab.params.map(this.field)}
      </div>
    )
  }
}
