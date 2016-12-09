import React from 'react'
// import ReactDOM from 'react-dom'
import classNames from 'classnames'
import SearchTemplate from './searchTemplate'
// import TemplateTab from './templateTab'
import Scrollbar from '../../../../../resources/scrollbar/scrollbar.js'
// import SaveTemplate from './saveTemplate'
import TemplateControl from './templateControl'
import vcCake from 'vc-cake'
const assetsManager = vcCake.getService('assets-manager')
const wipAssetsManager = vcCake.getService('wipAssetsManager')
const templateManager = vcCake.getService('myTemplates')
const allCategories = []

export default class addTemplate extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    categories: React.PropTypes.array
  }

  static defaultProps = {
    categories: [
      {
        title: 'All',
        index: 0,
        id: 'All',
        templates: templateManager.all().concat([])
      },
      {
        title: 'My Templates',
        index: 1,
        id: 'MyTemplates',
        templates: templateManager.all()
      },
      {
        title: 'Hub Templates',
        index: 2,
        id: 'HubTemplates',
        templates: [] // TODO get templates from HUB
      },
      {
        title: 'Download More Templates',
        index: 3,
        id: 'DownloadMoreTemplates'
      }
    ]
  }

  constructor (props) {
    super(props)
    this.state = {
      activeCategoryIndex: 0,
      categoryTitle: 'My Templates',
      templateName: '',
      inputValue: '',
      isSearching: false,
      error: false,
      errorName: '',
      allTemplates: [],
      visibleCategories: [0, this.props.categories.length - 1]
    }
    this.changeActiveCategory = this.changeActiveCategory.bind(this)
    this.changeTemplateName = this.changeTemplateName.bind(this)
    this.changeSearchInput = this.changeSearchInput.bind(this)
    this.changeSearchState = this.changeSearchState.bind(this)
    this.handleSaveTemplate = this.handleSaveTemplate.bind(this)
    this.handleGoToHub = this.handleGoToHub.bind(this)
    this.handleApplyTemplate = this.handleApplyTemplate.bind(this)
    this.handleRemoveTemplate = this.handleRemoveTemplate.bind(this)
  }

  componentWillMount () {
    this.getAllCategories()
  }

  getAllCategories () {
    this.props.categories.forEach((category) => {
      allCategories.push(category)
    })
    this.updateTemplatesList()
  }

  updateTemplatesList () {
    allCategories.forEach((category) => {
      if (category.id === 'All') {
        this.setState({allTemplates: category.templates})
      }
    })
  }

  // Check state

  isSearching () {
    let { isSearching, inputValue } = this.state
    return isSearching && inputValue.trim()
  }

  // Change state

  changeTemplateName (e) {
    this.setState({
      templateName: e.currentTarget.value,
      error: false
    })
  }

  changeActiveCategory (index) {
    this.setState({
      activeCategoryIndex: index,
      categoryTitle: this.props.categories[index].title
    })
  }

  changeSearchState (state) {
    this.setState({isSearching: state})
  }

  changeSearchInput (value) {
    this.setState({inputValue: value})
  }

  // Get Props

  getSearchProps () {
    return {
      inputValue: this.state.inputValue,
      changeSearchState: this.changeSearchState,
      changeSearchInput: this.changeSearchInput,
      index: this.state.activeCategoryIndex,
      allCategories: this.props.categories,
      changeActiveCategory: this.changeActiveCategory,
      visibleCategories: this.state.visibleCategories
    }
  }

  getTemplateControlProps (template) {
    return {
      api: this.props.api,
      key: 'vcv-element-control-' + template.id,
      data: template.data || {},
      id: template.id,
      name: template.name,
      applyTemplate: this.handleApplyTemplate,
      removeTemplate: this.handleRemoveTemplate
    }
  }

  // Get HTML elements

  getSearch () {
    return <SearchTemplate {...this.getSearchProps()} />
  }

  getNoResultsElement () {
    let source, btnText, helper, button
    if (!this.props.categories[0].templates.length && !this.state.isSearching) {
      btnText = 'Download More Templates'
      helper = `You don't have any templates yet. Try to save your current layout as a template or download templates from Visual Composer Hub.`
      button = <button className='vcv-ui-editor-no-items-action' onClick={this.handleGoToHub}>{btnText}</button>
      if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
        source = wipAssetsManager.getSourcePath('images/add-item.png')
      } else {
        source = assetsManager.getSourcePath('images/add-item.png')
      }
    } else {
      btnText = 'Download More Templates'
      helper = `Didn't find the right template? Check out Visual Composer Hub for more layout templates.`
      button = <button className='vcv-ui-editor-no-items-action' onClick={this.handleGoToHub}>{btnText}</button>
      if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
        source = wipAssetsManager.getSourcePath('images/search-no-result.png')
      } else {
        source = assetsManager.getSourcePath('images/search-no-result.png')
      }
    }
    return <div className='vcv-ui-editor-no-items-container'>
      <div className='vcv-ui-editor-no-items-content'>
        <img
          className='vcv-ui-editor-no-items-image'
          src={source}
          alt='Nothing Found'
        />
      </div>
      <div className='vcv-ui-editor-no-items-content'>
        <p className='vcv-ui-form-helper'>{helper}</p>
      </div>
      <div className='vcv-ui-editor-no-items-content'>
        {button}
      </div>
    </div>
  }

  getTemplateControl (template) {
    return <TemplateControl {...this.getTemplateControlProps(template)} />
  }

  getSearchResults () {
    let { inputValue, allTemplates } = this.state
    return allTemplates.filter((template) => {
      let name = template.name.toLowerCase()
      return template.hasOwnProperty('name') && name.indexOf(inputValue.toLowerCase().trim()) !== -1
    }).map((template) => {
      return this.getTemplateControl(template)
    })
  }

  getTemplatesByCategory () {
    let { activeCategoryIndex } = this.state

    if (allCategories[ activeCategoryIndex ].id === 'DownloadMoreTemplates') {
      this.handleGoToHub()
      return []
    }
    return allCategories[ activeCategoryIndex ].templates.map((template) => {
      return this.getElementControl(template)
    })
  }

  getTemplateListContainer (itemsOutput) {
    return itemsOutput.length ? <div className='vcv-ui-item-list-container'>
      <ul className='vcv-ui-item-list'>
        {itemsOutput}
      </ul>
    </div> : this.getNoResultsElement()
  }

  // Event handlers

  handleSaveTemplate (e) {
    e && e.preventDefault()
    if (this.state.templateName.trim()) {
      let templateExists = this.props.categories[0].templates.findIndex((template) => {
        return template.name === this.state.templateName.trim()
      })
      if (templateExists < 0) {
        templateManager.addCurrentLayout(this.state.templateName)
        this.props.api.request('templates:save', this.state.templateName)
        this.setState({
          templateName: ''
          // myTemplatesList: templateManager.all()
        })
      } else {
        this.setState({
          error: true,
          errorName: 'Template with this title already exist. Please specify another title.'
        })
      }
    } else {
      this.setState({
        error: true,
        errorName: 'Please specify template title.'
      })
    }
  }

  handleGoToHub () {
    console.log('link to hub...')
  }

  handleApplyTemplate (data) {
    this.props.api.request('data:merge', data)
  }

  handleRemoveTemplate (id) {
    templateManager.remove(id)
    this.props.api.request('templates:remove', id)
    // this.setState({myTemplatesList: templateManager.all()})
  }

  render () {
    let itemsOutput = this.isSearching() ? this.getSearchResults() : this.getTemplatesByCategory()

    let innerSectionClasses = classNames({
      'vcv-ui-tree-content-section-inner': true,
      'vcv-ui-state--centered-content': itemsOutput && !itemsOutput.length
    })
    let errorMessageClasses = classNames({
      'vcv-ui-tree-content-error-message': true,
      'vcv-ui-tree-content-error-message--visible': this.state.error
    })
    let listCtaClasses = classNames({
      'vcv-ui-editor-list-cta-wrapper': true,
      'vcv-ui-state--hidden': itemsOutput && !itemsOutput.length
    })

    return (
      <div className='vcv-ui-tree-view-content vcv-ui-add-template-content'>
        <div className='vcv-ui-tree-content'>
          {this.getSearch()}
          <div className='vcv-ui-tree-content-section'>
            <div className='vcv-ui-tree-content-error-message-container'>
              <div className={errorMessageClasses}>{this.state.errorName}</div>
            </div>
            <Scrollbar>
              <div className={innerSectionClasses}>
                <div className='vcv-ui-form-dependency'>
                  <div className='vcv-ui-form-group'>
                    <span className='vcv-ui-form-group-heading'>Template name</span>
                    <form
                      className='vcv-ui-save-template-form'
                      onSubmit={this.handleSaveTemplate}
                    >
                      <input
                        className='vcv-ui-form-input'
                        type='text'
                        value={this.state.templateName}
                        onChange={this.changeTemplateName}
                      />
                      <button
                        className='vcv-ui-save-template-submit vcv-ui-editor-no-items-action'
                        type='submit'
                      >Save Template</button>
                    </form>
                  </div>
                </div>
                <div className='vcv-ui-editor-plates-container'>
                  <div className='vcv-ui-editor-plates'>
                    <div className='vcv-ui-editor-plate vcv-ui-state--active'>
                      {this.getTemplateListContainer(itemsOutput)}
                    </div>
                  </div>
                </div>
                <div className={listCtaClasses}>
                  <button
                    className='vcv-ui-editor-no-items-action'
                    onClick={this.handleGoToHub}
                  >Download More Templates</button>
                </div>
              </div>
            </Scrollbar>
          </div>
        </div>
      </div>
    )
  }
}
