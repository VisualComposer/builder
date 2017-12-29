import React from 'react'
import FormWrapper from './form-wrapper'
import ActivitiesManager from './activities-manager'
import PropTypes from 'prop-types'

export default class EditElementController extends ActivitiesManager {
  static propTypes = {
    api: PropTypes.object.isRequired,
    element: PropTypes.object.isRequired,
    activeTabId: PropTypes.string
  }

  getActiveTabId () {
    let formWrapper = this.refs[ 'formWrapper' ]
    return formWrapper.allTabs[ formWrapper.state.activeTabIndex ].data.id
  }

  setActiveTabId (tabId) {
    let formWrapper = this.refs[ 'formWrapper' ]
    formWrapper.onChangeActiveTab(formWrapper.getActiveTabIndex(tabId))
  }

  render () {
    return (
      <FormWrapper
        {...this.props}
        setFieldMount={this.setFieldMount}
        setFieldUnmount={this.setFieldUnmount}
        callFieldActivities={this.callFieldActivities}
        onElementChange={this.onElementChange}
        ref='formWrapper'
      />
    )
  }
}
