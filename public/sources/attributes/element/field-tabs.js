import React from 'react'
import ActivitiesManager from './../../../editor/modules/ui/edit-element/lib/activities-manager'
import EditFormFieldDependencies from './../../../editor/modules/ui/edit-element/lib/field-dependencies'
import classNames from 'classnames'
import PropTypes from 'prop-types'

export default class AttributeElementFieldWrapper extends ActivitiesManager {
  static propTypes = {
    element: PropTypes.object.isRequired,
    exclude: PropTypes.array
  }

  field = (field) => {
    if (field.key === 'designOptions' || field.key === 'metaCustomId') {
      return
    }

    if (this.props.exclude && this.props.exclude.length && field.key.indexOf(this.props.exclude) >= 0) {
      return
    }

    return (
      <EditFormFieldDependencies
        {...this.props}
        setFieldMount={this.setFieldMount}
        setFieldUnmount={this.setFieldUnmount}
        key={`element-edit-form-field-${this.props.element.get('id')}-${field.key}`}
        fieldKey={field.key}
        updater={this.onElementChange}
      />
    )
  }

  onElementChange = (key, value) => {
    this.props.element.set(key, value)
    this.callFieldActivities(null, key)
    this.props.onChange()
  }

  render () {
    let content = []

    this.props.allTabs.forEach((tab) => {
      let plateClass = classNames({}, `vcv-ui-editor-plate-${tab.id}`)
      content.push(
        <div key={`element-plate-visible-${this.props.element.get('id')}-${tab.id}`} className={plateClass}>
          {tab.params.map(this.field)}
        </div>
      )
    })

    return (
      <div>{content}</div>
    )
  }
}
