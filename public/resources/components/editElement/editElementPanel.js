import React from 'react'
import FormWrapper from './lib/FormWrapper'
import ActivitiesManager from './lib/activitiesManager'
import {getStorage, getService} from 'vc-cake'
const elementsStorage = getStorage('elements')
const cook = getService('cook')
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
    const id = element.get('id')
    elementsStorage.state(`element:${id}`).onChange(this.updateElementOnChange)
  }
  componentWillUnmount () {
    const {element} = this.props
    const id = element.get('id')
    elementsStorage.state(`element:${id}`).ignoreChange(this.updateElementOnChange)
  }
  updateElementOnChange (data, source) {
    const {element} = this.props
    const id = element.get('id')
    if (source !== 'editForm') {
      const cookElement = cook.get(data)
      const publicKeys = cookElement.filter((key, value, settings) => {
        return settings.access === 'public'
      })
      publicKeys.forEach((key) => {
        const newValue = cookElement.get(key)
        elementsStorage.state(`element:${id}:attribute:${key}`).set(newValue, cookElement)
      })
    }
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
    return (
      <FormWrapper
        activeTabId={activeTabId}
        element={element}
        setFieldMount={this.setFieldMount}
        setFieldUnmount={this.setFieldUnmount}
        callFieldActivities={this.callFieldActivities}
        onElementChange={this.onElementChange}
        ref='formWrapper'
      />
    )
  }
}
