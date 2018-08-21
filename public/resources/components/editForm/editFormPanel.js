import React from 'react'
import PropTypes from 'prop-types'
import lodash from 'lodash'
import ActivitiesManager from './lib/activitiesManager'
import EditForm from './lib/editForm'
import { env } from 'vc-cake'

export default class EditFormPanel extends ActivitiesManager {
  static propTypes = {
    element: PropTypes.object.isRequired,
    activeTabId: PropTypes.string,
    options: PropTypes.object
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (!env('FT_EDIT_FORM_PERFORMANCE_OPTIMIZATION')) {
      let isEqual = lodash.isEqual(this.props, nextProps)
      let isEqualState = lodash.isEqual(this.state, nextState)
      return !(isEqual && isEqualState)
    } else {
      return true // This method should be removed once FT enabled
    }
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
