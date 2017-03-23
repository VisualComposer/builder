import React from 'react'
import FormWrapper from './lib/formWrapper'
import ActivitiesManager from './lib/activitiesManager'
import './css/init.less'
import {getStorage, getService} from 'vc-cake'
const elementsStorage = getStorage('elements')
export default class EditElementPanel extends ActivitiesManager {
  static propTypes = {
    element: React.PropTypes.object.isRequired,
    activeTabId: React.PropTypes.string
  }
  constructor (props) {
    super(props)
    this.updateElementOnChange = this.updateElementOnChange.bind(this)
  }
  componentDidMount () {
    const {element} = this.props
    elementsStorage.state(`element:${element.id}`, this.updateElementOnChange)
  }
  componentWillUnmount () {

  }
  updateElementOnChange (data) {
    this.setState({element: data})
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
    const {element, activeTabId} = this.props
    const cook = getService('cook')
    const cookElement = cook.get(element)
    return (
      <FormWrapper
        activeTabId={activeTabId}
        element={cookElement}
        setFieldMount={this.setFieldMount}
        setFieldUnmount={this.setFieldUnmount}
        callFieldActivities={this.callFieldActivities}
        onElementChange={this.onElementChange}
        ref='formWrapper'
      />
    )
  }
}
