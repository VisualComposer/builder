import React from 'react'
import { getStorage, getService } from 'vc-cake'
import Dropdown from 'public/sources/attributes/dropdown/Component'
import StringAttribute from 'public/sources/attributes/string/Component'
import Checkbox from 'public/sources/attributes/checkbox/Component'

const dataManager = getService('dataManager')
const settingsStorage = getStorage('settings')
const localizations = dataManager.get('localizations')
const categoriesTitle = localizations ? localizations.categories : 'Categories'

export default class Categories extends React.Component {
  constructor (props) {
    super(props)
    const data = dataManager.get('categories')
    const categories = settingsStorage.state('categories').get() || data || []

    this.state = {
      isListLoading: false,
      value: categories.value,
      options: categories.options,
      newCategory: '',
      parentCategory: '',
      parentCategoryOptions: [...categories.options],
      isNewCategoryVisible: false
    }

    settingsStorage.state('categories').set(categories)
    this.stringChangeHandler = this.stringChangeHandler.bind(this)
    this.dropdownChangeHandler = this.dropdownChangeHandler.bind(this)
    this.checkboxChangeHandler = this.checkboxChangeHandler.bind(this)
    this.handleAddCategory = this.handleAddCategory.bind(this)
    this.handleExpand = this.handleExpand.bind(this)
  }

  changeLoadingState = (status) => {
    this.setState({
      isListLoading: status
    })
  }

  checkboxChangeHandler (fieldKey, value) {
    this.setState({
      value: value
    })
    const currentStorageState = settingsStorage.state('categories').get()
    currentStorageState.value = value
    settingsStorage.state('categories').set(currentStorageState)
  }

  handleAddCategory () {
    const currentStorageState = settingsStorage.state('categories').get()
    const newCategory = {
      label: this.state.newCategory,
      value: this.state.newCategory.split(' ').map(word => word.toLowerCase()).join('-')
    }
    currentStorageState.values = currentStorageState.values.push(newCategory)
    settingsStorage.state('categories').set(currentStorageState)
    this.setState({
      newCategory: ''
    })
  }

  stringChangeHandler (fieldKey, value) {
    this.setState({
      newCategory: value
    })
  }

  dropdownChangeHandler (fieldKey, value) {
    this.setState({
      parentCategory: value
    })
  }

  handleExpand (e) {
    e.preventDefault()
    this.setState({ isNewCategoryVisible: !this.state.isNewCategoryVisible })
  }

  render () {
    let spinnerHtml = null
    if (this.state.isListLoading) {
      spinnerHtml = (
        <span className='vcv-ui-wp-spinner' />
      )
    }

    let newCategory = null
    if (this.state.isNewCategoryVisible) {
      if (!this.state.parentCategoryOptions.find(option => option.label === 'Select Parent Category')) {
        this.state.parentCategoryOptions.unshift({ label: 'Select Parent Category', value: '' })
      }
      newCategory = (
        <div className='vcv-ui-form-group-container'>
          <div className='vcv-ui-form-group'>
          <span className='vcv-ui-form-group-heading'>
            Category
          </span>
            <StringAttribute
              api={this.props.api}
              fieldKey='newCategory'
              updater={this.stringChangeHandler}
              value={this.state.newCategory}
            />
          </div>
          <div className='vcv-ui-form-group'>
            <span className='vcv-ui-form-group-heading'>
              Parent Category
              {spinnerHtml}
            </span>
            <Dropdown
              api={this.props.api}
              fieldKey='parentCategory'
              options={{
                values: this.state.parentCategoryOptions,
                reloadAction: 'categories',
                global: 'VCV_CATEGORIES'
              }}
              setLoadingState={this.changeLoadingState}
              updater={this.dropdownChangeHandler}
              value={this.state.parentCategory}
            />
          </div>
          <div className='vcv-ui-form-group'>
            <button className='vcv-ui-form-button vcv-ui-form-button--action' onClick={this.handleAddCategory}>Add New Category</button>
          </div>
        </div>
      )
    }

    return (
      <>
        <div className='vcv-ui-edit-form-section-header vcv-ui-wordpress-setting-header'>
          <span className='vcv-ui-edit-form-section-header-title'>{categoriesTitle}</span>
        </div>
        <div className='vcv-ui-form-group vcv-ui-form-group--category'>
          <Checkbox
            api={this.props.api}
            fieldKey='category'
            options={{
              listView: true,
              itemLimit: 10,
              values: this.state.options,
              reloadAction: 'categories',
              global: 'VCV_CATEGORIES'
            }}
            // setLoadingState={this.changeLoadingState}
            updater={this.checkboxChangeHandler}
            value={this.state.value}
          />
          <p className='vcv-ui-form-helper'>Select categories for the post or <a className='vcv-ui-form-link' href='#' onClick={this.handleExpand}>add a new category</a>.</p>
        </div>
        {newCategory}
      </>
    )
  }
}
