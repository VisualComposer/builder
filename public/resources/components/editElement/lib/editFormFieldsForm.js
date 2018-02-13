import React from 'react'
import classNames from 'classnames'
import FieldDependencyManager from './fieldDependencyManager'
import EditFormSection from './editFormSection'
import EditFormReplaceElement from './editFormReplaceElement'
import PropTypes from 'prop-types'
import { env } from 'vc-cake'

export default class EditFormFieldsForm extends React.Component {
  static propTypes = {
    element: PropTypes.object.isRequired,
    activeTab: PropTypes.object.isRequired,
    callFieldActivities: PropTypes.func.isRequired,
    onElementChange: PropTypes.func.isRequired
  }

  field = (field) => {
    return (
      <FieldDependencyManager
        {...this.props}
        key={`edit-form-field-${field.key}`}
        fieldKey={field.key}
        updater={this.props.onElementChange}
      />
    )
  }

  /**
   * Get an array of all edit form fields that act as accordion sections
   * @return Array
   */
  getAccordionSections () {
    return this.props.allTabs.map((tab) => {
      return <EditFormSection
        {...this.props}
        key={tab.key}
        tab={tab}
      />
    })
  }

  render () {
    let { activeTab } = this.props

    let plateClass = classNames({
      'vcv-ui-editor-plate': true,
      'vcv-ui-state--active': true
    }, `vcv-ui-editor-plate-${activeTab.key}`)

    let replaceElement = null

    if (env('REPLACE_ELEMENTS')) {
      replaceElement = (
        <EditFormReplaceElement {...this.props} />
      )
    }

    return <div className={plateClass}>
      {replaceElement}
      {this.getAccordionSections()}
    </div>
  }
}
