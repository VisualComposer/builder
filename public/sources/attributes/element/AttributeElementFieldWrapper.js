import React from 'react'
import ActivitiesManager from 'public/components/panels/editForm/lib/activitiesManager'
import EditFormField from './lib/field'
import classNames from 'classnames'
import PropTypes from 'prop-types'

export default class AttributeElementFieldWrapper extends ActivitiesManager {
  static propTypes = {
    elementAccessPoint: PropTypes.object.isRequired,
    exclude: PropTypes.array
  }

  field = (field) => {
    if (field.key === 'designOptions' || field.key === 'metaCustomId') {
      return
    }

    if (this.props.exclude && this.props.exclude.length && this.props.exclude.indexOf(field.key) >= 0) {
      return
    }

    return (
      <EditFormField
        {...this.props}
        setFieldMount={this.setFieldMount}
        setFieldUnmount={this.setFieldUnmount}
        key={`element-edit-form-field-${this.props.elementAccessPoint.id}-${field.key}`}
        fieldKey={field.key}
        fieldType={field.data.type.name || field.data.settings.type}
        updater={this.onElementChange}
      />
    )
  }

  onElementChange = (key, value) => {
    this.props.elementAccessPoint.set(key, value)
    this.callFieldActivities(null, key)
    this.props.onChange()
  }

  render () {
    let content = []

    this.props.allTabs.forEach((tab) => {
      let plateClass = classNames({}, `vcv-ui-editor-plate-${tab.id}`)
      content.push(
        <div key={`element-plate-visible-${this.props.elementAccessPoint.id}-${tab.id}`} className={plateClass}>
          {tab.params.map(this.field)}
        </div>
      )
    })

    return (
      <div>{content}</div>
    )
  }
}
