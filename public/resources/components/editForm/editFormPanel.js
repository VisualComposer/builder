import React from 'react'
import PropTypes from 'prop-types'
import lodash from 'lodash'
import ActivitiesManager from './lib/activitiesManager'
import EditForm from './lib/editForm'

export default class EditFormPanel extends ActivitiesManager {
  static propTypes = {
    element: PropTypes.object.isRequired,
    activeTabId: PropTypes.string
  }

  shouldComponentUpdate (nextProps, nextState) {
    let isEqual = lodash.isEqual(this.props, nextProps)
    let isEqualState = lodash.isEqual(this.state, nextState)
    return !(isEqual && isEqualState)
  }

  getActiveTabId () {
    let formWrapper = this.formWrapper
    return formWrapper.allTabs[ formWrapper.state.activeTabIndex ].data.id
  }

  setActiveTabId (tabId) {
    let formWrapper = this.formWrapper
    formWrapper.onChangeActiveTab(formWrapper.getActiveTabIndex(tabId))
  }

  render () {
    const { activeTabId } = this.props
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
      />
    )
  }
}
