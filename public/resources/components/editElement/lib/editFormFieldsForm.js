import React from 'react'
import classNames from 'classnames'
import FieldDependencyManager from './fieldDependencyManager'
import EditFormField from './editFormField'
import vcCake from 'vc-cake'

export default class EditFormFieldsForm extends React.Component {
  static propTypes = {
    element: React.PropTypes.object.isRequired,
    activeTab: React.PropTypes.object.isRequired,
    callFieldActivities: React.PropTypes.func.isRequired,
    onElementChange: React.PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.getAccordionSections = this.getAccordionSections.bind(this)
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
      return <EditFormField
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

    if (vcCake.env('EDIT_FORM_ACCORDION')) {
      return <div className={plateClass}>
        {this.getAccordionSections()}
      </div>
    }

    return (
      <div key={`plate-visible-${activeTab.key}`} className={plateClass}>
        {this.props.activeTab.params.map(this.field)}
      </div>
    )
  }
}
