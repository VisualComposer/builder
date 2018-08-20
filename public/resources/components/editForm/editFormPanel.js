import React from 'react'
import PropTypes from 'prop-types'
import ActivitiesManager from './lib/activitiesManager'
import EditForm from './lib/editForm'

export default class EditFormPanel extends ActivitiesManager {
  static propTypes = {
    element: PropTypes.object.isRequired,
    activeTabId: PropTypes.string,
    options: PropTypes.object
  }

  render () {
    const { activeTabId, options } = this.props
    const { element } = this.state
    return (
      <EditForm
        activeTabId={activeTabId}
        element={element}
        setFieldMount={this.setFieldMount}
        setFieldUnmount={this.setFieldUnmount}
        onAttributeChange={this.onAttributeChange}
        callFieldActivities={this.callFieldActivities}
        ref={ref => { this.formWrapper = ref }}
        options={options}
      />
    )
  }
}
