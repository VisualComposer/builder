import React from 'react'
import { getStorage, getService } from 'vc-cake'
import Dropdown from 'public/sources/attributes/dropdown/Component'
import StringAttribute from 'public/sources/attributes/string/Component'
import Checkbox from 'public/sources/attributes/checkbox/Component'

const dataManager = getService('dataManager')
const settingsStorage = getStorage('settings')
const localizations = dataManager.get('localizations')
const categoriesTitle = localizations ? localizations.categories : 'Categories'
const categoryTitle = localizations ? localizations.category : 'Category'
const parentCategoryTitle = localizations ? localizations.parentCategory : 'Parent Category'
const addNewCategory = localizations ? localizations.addNewCategory : 'Add New Category'
const selectCategoriesForPostOr = localizations ? localizations.selectCategoriesForPostOr : 'Select categories for the post or '
const addANewCategory = localizations ? localizations.addANewCategory : 'add a new category'
const selectParentCategory = localizations ? localizations.selectParentCategory : 'Select Parent Category'

export default class Categories extends React.Component {
  constructor (props) {
    super(props)
    const data = dataManager.get('categories')
    const categoriesData = settingsStorage.state('categories').get() || data || []

    this.state = {
      isListLoading: false,
      value: categoriesData.used,
      options: categoriesData.categories,
      newCategory: '',
      parentCategory: '',
      parentCategoryOptions: [...categoriesData.categories],
      isNewCategoryVisible: false
    }

    settingsStorage.state('categories').set(categoriesData)
    this.stringChangeHandler = this.stringChangeHandler.bind(this)
    this.dropdownChangeHandler = this.dropdownChangeHandler.bind(this)
    this.checkboxChangeHandler = this.checkboxChangeHandler.bind(this)
    this.handleAddCategory = this.handleAddCategory.bind(this)
    this.handleExpand = this.handleExpand.bind(this)
    this.updateCategories = this.updateCategories.bind(this)
  }

  componentDidMount () {
    settingsStorage.state('categories').onChange(this.updateCategories)
  }

  componentWillUnmount () {
    settingsStorage.state('categories').ignoreChange(this.updateCategories)
  }

  updateCategories (data) {
    this.setState({
      value: data.used,
      options: data.categories,
      parentCategoryOptions: [...data.categories],
    })
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
    currentStorageState.used = value
    settingsStorage.state('categories').set(currentStorageState)
  }

  handleAddCategory () {
    const currentStorageState = settingsStorage.state('categories').get()
    const newCategorySlug = this.state.newCategory.split(' ').map(word => word.toLowerCase()).join('-')
    const newValue = this.state.value
    newValue.push(newCategorySlug)
    const newOptions = currentStorageState.categories

    // TODO replace random id with a server request
    const newCategory = {
      label: this.state.newCategory,
      value: newCategorySlug,
      id:  Math.floor(Math.random() * 10000),
      parent: 0
    }
    if (this.state.parentCategory) {
      newCategory.parent = newOptions.find(option => option.value === this.state.parentCategory).id
    }
    newOptions.push(newCategory)
    currentStorageState.used = newValue
    currentStorageState.categories = newOptions
    settingsStorage.state('categories').set(currentStorageState)

    this.setState({
      newCategory: '',
      parentCategory: '',
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
      if (!this.state.parentCategoryOptions.find(option => option.label === selectParentCategory)) {
        this.state.parentCategoryOptions.unshift({ label: selectParentCategory, value: '' })
      }
      newCategory = (
        <div className='vcv-ui-form-group-container'>
          <div className='vcv-ui-form-group'>
          <span className='vcv-ui-form-group-heading'>
            {categoryTitle}
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
              {parentCategoryTitle}
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
            <button className='vcv-ui-form-button vcv-ui-form-button--action' onClick={this.handleAddCategory}>{addNewCategory}</button>
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
              nesting: true,
              values: this.state.options,
              reloadAction: 'categories',
              global: 'VCV_CATEGORIES'
            }}
            updater={this.checkboxChangeHandler}
            value={this.state.value}
          />
          <p className='vcv-ui-form-helper'>{selectCategoriesForPostOr}<a className='vcv-ui-form-link' href='#' onClick={this.handleExpand}>{addANewCategory}</a>.</p>
        </div>
        {newCategory}
      </>
    )
  }
}
