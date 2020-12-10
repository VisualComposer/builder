import React from 'react'
import classNames from 'classnames'
import { getStorage, getService } from 'vc-cake'
import Dropdown from 'public/sources/attributes/dropdown/Component'
import StringAttribute from 'public/sources/attributes/string/Component'
import Checkbox from 'public/sources/attributes/checkbox/Component'
import { getResponse } from 'public/tools/response'

const dataProcessor = getService('dataProcessor')
const dataManager = getService('dataManager')
const settingsStorage = getStorage('settings')
const localizations = dataManager.get('localizations')

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
      value: categoriesData.used,
      options: categoriesData.categories,
      newCategory: '',
      parentCategory: '',
      parentCategoryOptions: [...categoriesData.categories],
      isNewCategoryVisible: false,
      isSaving: false,
      topDots: false,
      bottomDots: true
    }

    settingsStorage.state('categories').set(categoriesData)
    this.stringChangeHandler = this.stringChangeHandler.bind(this)
    this.dropdownChangeHandler = this.dropdownChangeHandler.bind(this)
    this.checkboxChangeHandler = this.checkboxChangeHandler.bind(this)
    this.handleAddCategory = this.handleAddCategory.bind(this)
    this.handleExpand = this.handleExpand.bind(this)
    this.updateCategories = this.updateCategories.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
    this.handleScrollFallback = this.handleScrollFallback.bind(this)
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
      parentCategoryOptions: [...data.categories]
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
    if (!this.state.newCategory) {
      return
    }
    const currentStorageState = settingsStorage.state('categories').get()
    const newValue = this.state.value
    const newOptions = currentStorageState.categories
    let parentCategoryId = 0
    if (this.state.parentCategory) {
      parentCategoryId = newOptions.find(option => option.value === parseInt(this.state.parentCategory)).id
    }
    this.setState({ isSaving: true })

    dataProcessor.appAdminServerRequest({
      'vcv-action': 'editors:settings:add:category:adminNonce',
      'vcv-category': this.state.newCategory,
      'vcv-parent-category': parseInt(parentCategoryId),
      'vcv-nonce': window.vcvNonce,
      'vcv-source-id': window.vcvSourceID
    }).then((responseData) => {
      const response = getResponse(responseData)
      if (response && response.status) {
        const newCategory = {
          label: this.state.newCategory,
          value: response.id,
          id: response.id,
          parent: parseInt(parentCategoryId)
        }
        newValue.push(response.id + '')
        newOptions.push(newCategory)
        currentStorageState.used = newValue
        currentStorageState.categories = newOptions
        settingsStorage.state('categories').set(currentStorageState)
        this.setState({
          newCategory: '',
          parentCategory: '',
          isSaving: false
        })
      } else {
        console.warn(response)
        this.setState({ isSaving: false })
      }
    }, (error) => {
      console.warn(error)
      this.setState({ isSaving: false })
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

  handleScrollFallback (target) {
    const isTopPosition = target.scrollTop === 0
    const isBottomPosition = target.scrollTop === (target.scrollHeight - target.offsetHeight)
    if (!isTopPosition && !this.state.topDots) {
      this.setState({ topDots: true })
    } else if (isTopPosition && this.state.topDots) {
      this.setState({ topDots: false })
    } else if (isBottomPosition && this.state.bottomDots) {
      this.setState({ bottomDots: false })
    } else if (!isBottomPosition && !this.state.bottomDots) {
      this.setState({ bottomDots: true })
    }
  }

  handleScroll (scrollbars) {
    const { top } = scrollbars.getValues()
    if (top > 0.25 && !this.state.topDots) {
      this.setState({ topDots: true })
    } else if (top < 0.25 && this.state.topDots) {
      this.setState({ topDots: false })
    } else if (top > 0.8 && this.state.bottomDots) {
      this.setState({ bottomDots: false })
    } else if (top < 0.8 && !this.state.bottomDots) {
      this.setState({ bottomDots: true })
    }
  }

  render () {
    let spinnerHtml = null
    if (this.state.isSaving) {
      spinnerHtml = (
        <span className='vcv-ui-wp-spinner' />
      )
    }

    let newCategory = null
    if (this.state.isNewCategoryVisible) {
      if (!this.state.parentCategoryOptions.find(option => option.label === selectParentCategory)) {
        this.state.parentCategoryOptions.unshift({ label: selectParentCategory, value: '', parent: 0, id: '' })
      }
      const containerClasses = classNames({
        'vcv-ui-form-group-container': true,
        'vcv-ui-form-group-container--saving': this.state.isSaving
      })
      newCategory = (
        <div className={containerClasses}>
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
            </span>
            <Dropdown
              api={this.props.api}
              fieldKey='parentCategory'
              options={{
                values: this.state.parentCategoryOptions,
                nesting: true
              }}
              updater={this.dropdownChangeHandler}
              value={this.state.parentCategory}
            />
          </div>
          <div className='vcv-ui-form-group'>
            <button
              className='vcv-ui-form-button vcv-ui-form-button--action'
              onClick={this.handleAddCategory}
              disabled={this.state.isSaving}
            >
              {addNewCategory}
              {spinnerHtml}
            </button>
          </div>
        </div>
      )
    }

    const topDotsClasses = classNames({
      'vcv-scroll-dots': true,
      'vcv-scroll-dots--before': true,
      'vcv-scroll-dots--visible': this.state.topDots
    })
    const bottomDotsClasses = classNames({
      'vcv-scroll-dots': true,
      'vcv-scroll-dots--after': true,
      'vcv-scroll-dots--visible': this.state.bottomDots
    })
    return (
      <>
        <div className='vcv-ui-form-group vcv-ui-form-group--category'>
          <div className={topDotsClasses} />
          <Checkbox
            api={this.props.api}
            fieldKey='category'
            options={{
              listView: true,
              itemLimit: 10,
              nesting: true,
              values: this.state.options
            }}
            updater={this.checkboxChangeHandler}
            value={this.state.value}
            onScroll={this.handleScroll}
            handleScrollFallback={this.handleScrollFallback}
          />
          <div className={bottomDotsClasses} />
          <p className='vcv-ui-form-helper'>{selectCategoriesForPostOr}<a className='vcv-ui-form-link' href='#' onClick={this.handleExpand}>{addANewCategory}</a>.</p>
        </div>
        {newCategory}
      </>
    )
  }
}
