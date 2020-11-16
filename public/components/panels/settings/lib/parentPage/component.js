import React from 'react'
import { getStorage, getService } from 'vc-cake'
import Dropdown from 'public/sources/attributes/dropdown/Component'

const dataManager = getService('dataManager')
const settingsStorage = getStorage('settings')
const localizations = dataManager.get('localizations')
const parentPageTitle = localizations ? localizations.parentPageTitle : 'Parent Page'

export default class ParentPage extends React.Component {
  constructor (props) {
    super(props)
    const data = dataManager.get('pageList')
    const currentParentPage = settingsStorage.state('parentPage').get() || data.current || 'none'

    this.state = {
      data: data,
      isListLoading: false,
      current: currentParentPage
    }

    settingsStorage.state('parentPage').set(currentParentPage)
    this.valueChangeHandler = this.valueChangeHandler.bind(this)
  }

  changeLoadingState = (status) => {
    this.setState({
      isListLoading: status
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
    if (dataList && dataList.findIndex((item) => { return item.value === current }) > -1) {
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
              global: 'VCV_PAGE_LIST'
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
