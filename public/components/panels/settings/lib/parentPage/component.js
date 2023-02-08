import React from 'react'
import { env, getStorage, getService } from 'vc-cake'
import Dropdown from 'public/sources/attributes/dropdown/Component'

const dataManager = getService('dataManager')
const settingsStorage = getStorage('settings')
const localizations = dataManager.get('localizations')
const parentPageTitle = localizations ? localizations.parentPageTitle : 'Parent Page'

export default class ParentPage extends React.Component {
  constructor (props) {
    super(props)
    const data = dataManager.get('pageList')
    const currentParentPage = settingsStorage.state('parentPage').get() || data.current || '0'

    this.state = {
      data: data,
      isListLoading: false,
      current: currentParentPage
    }

    settingsStorage.state('parentPage').set(currentParentPage)
    this.valueChangeHandler = this.valueChangeHandler.bind(this)

    this.setAllPagesAjaxRequest()
  }

  changeLoadingState = (status) => {
    this.setState({
      isListLoading: status
    })
  }

  setAllPagesAjaxRequest = () => {
    const dataProcessor = getService('dataProcessor')

    dataProcessor.appServerRequest({
      'vcv-action': 'dropdown:parentPage:updateList:adminNonce',
      'vcv-nonce': dataManager.get('nonce')
    }).then((data) => {
      try {
        const jsonData = JSON.parse(data)

        if (jsonData.data && jsonData.status) {
          const allData = this.state.data
          allData.all = jsonData.data

          if (jsonData.current) {
            allData.current = jsonData.current
          }
          this.valueChangeHandler('parentPage', allData.current)
          this.setState({
            data: allData
          })
        } else {
          if (env('VCV_DEBUG')) {
            console.warn('Page list error', jsonData)
          }
        }
      } catch (e) {
        if (env('VCV_DEBUG')) {
          console.warn('Page list error', e)
        }
      }
    })
  }

  valueChangeHandler (fieldKey, value) {
    this.setState({
      current: value
    })
    settingsStorage.state('parentPage').set(value)
  }

  getSelectedValue () {
    const { data, current } = this.state
    const dataList = data.all || data
    // Is current page id exist inside all page list
    if (dataList && dataList.findIndex((item) => { return parseInt(item.value) === parseInt(current) }) > -1) {
      return current
    }
    return 'none'
  }

  render () {
    const { data } = this.state
    const selectedValue = this.getSelectedValue()

    let spinnerHtml = null
    if (this.state.isListLoading) {
      spinnerHtml = (
        <span className='vcv-ui-wp-spinner' />
      )
    }

    return (
      <>
        <div className='vcv-ui-form-group'>
          <span className='vcv-ui-form-group-heading'>
            {parentPageTitle}
            {spinnerHtml}
          </span>
          <Dropdown
            api={this.props.api}
            fieldKey='parentPage'
            options={{
              values: data.all,
              reloadAction: 'parentPage',
              global: 'VCV_PAGE_LIST',
              nesting: true
            }}
            setLoadingState={this.changeLoadingState}
            updater={this.valueChangeHandler}
            value={selectedValue}
          />
        </div>
      </>
    )
  }
}
