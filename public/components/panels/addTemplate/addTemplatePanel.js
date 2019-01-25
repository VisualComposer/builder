import React from 'react'
import classNames from 'classnames'
import SearchTemplate from './lib/searchTemplate'
import Scrollbar from '../../scrollbar/scrollbar.js'
import TemplateControl from './lib/templateControl'
import TransparentOverlayComponent from '../../overlays/transparentOverlay/transparentOverlayComponent'
import { getService, getStorage, env } from 'vc-cake'

const sharedAssetsLibraryService = getService('sharedAssetsLibrary')
const myTemplatesService = getService('myTemplates')
const documentManager = getService('document')
const elementsStorage = getStorage('elements')
const workspaceSettings = getStorage('workspace').state('settings')

export default class AddTemplatePanel extends React.Component {
  static localizations = window.VCV_I18N && window.VCV_I18N()

  errorTimeout = 0

  constructor (props) {
    super(props)
    this.templateServiceData = myTemplatesService.getTemplateData()
    this.setCategoryArray(this.templateServiceData)
    this.state = {
      activeCategoryIndex: 0,
      categoryTitle: 'My Templates',
      templateName: '',
      inputValue: '',
      isSearching: false,
      error: false,
      errorName: '',
      showSpinner: false,
      categories: this.templatesCategories,
      showLoading: false,
      removing: false
    }

    this.changeActiveCategory = this.changeActiveCategory.bind(this)
    this.changeTemplateName = this.changeTemplateName.bind(this)
    this.changeSearchInput = this.changeSearchInput.bind(this)
    this.changeSearchState = this.changeSearchState.bind(this)
    this.displayError = this.displayError.bind(this)
    this.handleSaveTemplate = this.handleSaveTemplate.bind(this)
    this.handleGoToHub = this.handleGoToHub.bind(this)
    this.handleApplyTemplate = this.handleApplyTemplate.bind(this)
    this.handleRemoveTemplate = this.handleRemoveTemplate.bind(this)
    this.onSaveSuccess = this.onSaveSuccess.bind(this)
    this.onSaveFailed = this.onSaveFailed.bind(this)
    this.onRemoveSuccess = this.onRemoveSuccess.bind(this)
    this.onRemoveFailed = this.onRemoveFailed.bind(this)
    this.handleTemplateStorageStateChange = this.handleTemplateStorageStateChange.bind(this)
    this.setCategoryArray = this.setCategoryArray.bind(this)
  }

  componentDidMount () {
    getStorage('hubTemplates').state('templates').onChange(this.handleTemplateStorageStateChange)
  }

  componentWillUnmount () {
    if (this.errorTimeout) {
      window.clearTimeout(this.errorTimeout)
      this.errorTimeout = 0
    }
    getStorage('hubTemplates').state('templates').ignoreChange(this.handleTemplateStorageStateChange)
  }

  setCategoryArray (data) {
    this.templatesCategories = [
      {
        title: 'All',
        index: 0,
        id: 'all',
        visible: true,
        templates: data.getAllTemplates
      },
      {
        title: 'My Templates',
        index: 1,
        id: 'myTemplates',
        visible: data.all.length,
        templates: data.all
      },
      {
        title: 'Content Templates',
        index: 2,
        id: 'hubAndPredefined',
        visible: data.hubAndPredefined.length,
        templates: data.hubAndPredefined
      },
      {
        title: 'Header Templates',
        index: 3,
        id: 'hubHeader',
        visible: data.hubHeader.length,
        templates: data.hubHeader
      },
      {
        title: 'Footer Templates',
        index: 4,
        id: 'hubFooter',
        visible: data.hubFooter.length,
        templates: data.hubFooter
      },
      {
        title: 'Sidebar Templates',
        index: 5,
        id: 'hubSidebar',
        visible: data.hubSidebar.length,
        templates: data.hubSidebar
      },
      {
        title: 'Download More Templates',
        index: 6,
        id: 'downloadMoreTemplates',
        visible: false,
        templates: null
      }
    ]
  }

  handleTemplateStorageStateChange () {
    this.templateServiceData = myTemplatesService.getTemplateData()
    this.setCategoryArray(this.templateServiceData)
    this.setState({ categories: this.templatesCategories })
  }

  // Check state

  isSearching () {
    return this.state.isSearching && this.state.inputValue.trim()
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
      categoryTitle: this.state.categories[ index ].title
    })
  }

  changeSearchState (state) {
    this.setState({ isSearching: state })
  }

  changeSearchInput (value) {
    this.setState({ inputValue: value })
  }

  displayError (error, state) {
    state = Object.assign({}, state, {
      error: true,
      errorName: error,
      showSpinner: false
    })
    this.setState(state)
    this.errorTimeout = setTimeout(() => {
      this.setState({
        error: false
      })
    }, 2300)
  }

  // Get Props

  getSearchProps () {
    return {
      inputValue: this.state.inputValue,
      changeSearchState: this.changeSearchState,
      changeSearchInput: this.changeSearchInput,
      index: this.state.activeCategoryIndex,
      allCategories: this.state.categories,
      changeActiveCategory: this.changeActiveCategory
    }
  }

  getTemplateControlProps (template) {
    template = Object.assign({}, template)
    if (
      (env('VCV_FT_TEMPLATE_DATA_ASYNC') && this.state.showLoading === template.id) ||
      (this.state.removing && template.id === this.state.showSpinner)
    ) {
      template.spinner = true
    }
    return {
      key: 'vcv-element-control-' + template.id,
      applyTemplate: this.handleApplyTemplate,
      removeTemplate: this.handleRemoveTemplate,
      ...template
    }
  }

  // Get HTML elements

  getSearch () {
    return <SearchTemplate {...this.getSearchProps()} />
  }

  getNoResultsElement () {
    const helperText = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.accessVisualComposerHubToDownload : 'Access Visual Composer Hub - to download additional elements, templates and extensions.'
    const nothingFoundText = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.nothingFound : 'Nothing found'

    let source
    if (!this.state.categories[ 0 ].templates.length && !this.state.isSearching) {
      source = sharedAssetsLibraryService.getSourcePath('images/add-item.png')
    } else {
      source = sharedAssetsLibraryService.getSourcePath('images/search-no-result.png')
    }

    return <div className='vcv-ui-editor-no-items-container'>
      <div className='vcv-ui-editor-no-items-content'>
        <img
          className='vcv-ui-editor-no-items-image'
          src={source}
          alt={nothingFoundText}
        />
      </div>
      <div>
        <div className='vcv-ui-editor-no-items-content'>
          {this.getMoreButton()}
        </div>
        <div className='vcv-ui-editor-no-items-content'>
          <p className='vcv-start-blank-helper'>{helperText}</p>
        </div>
      </div>
    </div>
  }

  getMoreButton () {
    const buttonText = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.getMoreTemplates : 'Get More Templates'
    return <button className='vcv-start-blank-button' onClick={this.handleGoToHub}>
      {buttonText}
    </button>
  }

  getTemplateControl (template) {
    return <TemplateControl {...this.getTemplateControlProps(template)} />
  }

  getSearchResults () {
    let { inputValue } = this.state
    return this.state.categories[ 0 ].templates.filter((template) => {
      let name = template.name.toLowerCase()
      return template.hasOwnProperty('name') && name.indexOf(inputValue.toLowerCase().trim()) !== -1
    }).map((template) => {
      return this.getTemplateControl(template)
    })
  }

  getTemplatesByCategory () {
    let { activeCategoryIndex } = this.state

    if (this.state.categories[ activeCategoryIndex ].id === 'downloadMoreTemplates') {
      this.handleGoToHub()
      return []
    }
    let templates = this.state.categories[ activeCategoryIndex ].templates
    return templates.map((template) => {
      return this.getTemplateControl(template)
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
    const templateAlreadyExistsText = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.templateAlreadyExists : 'Template with this name already exist. Please specify another name.'
    const templateContentEmptyText = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.templateContentEmpty : 'There is no content on your page - nothing to save'
    const templateSaveFailedText = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.templateSaveFailed : 'Template save failed'
    const specifyTemplateNameText = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.specifyTemplateName : 'Enter template name to save your page as a template'
    let { templateName } = this.state
    templateName = templateName.trim()
    if (templateName) {
      if (myTemplatesService.findBy('name', templateName)) {
        this.displayError(templateAlreadyExistsText)
      } else if (!documentManager.size()) {
        this.displayError(templateContentEmptyText)
      } else {
        this.setState({ showSpinner: templateName })
        let templateAddResult = myTemplatesService.addCurrentLayout(templateName, this.onSaveSuccess, this.onSaveFailed)
        if (!templateAddResult) {
          this.displayError(templateSaveFailedText)
        }
      }
    } else {
      this.displayError(specifyTemplateNameText)
    }
  }

  onSaveSuccess () {
    this.setState({
      templateName: '',
      categoryTitle: this.state.categories[ 1 ].title,
      isSearching: false,
      inputValue: '',
      showSpinner: false
    })
  }

  onSaveFailed () {
    const errorText = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.templateSaveFailed : 'Template save failed'
    this.displayError(errorText)
  }

  handleGoToHub () {
    const settings = {
      action: 'addHub',
      element: {},
      tag: '',
      options: {
        filterType: 'template',
        id: '2',
        bundleType: undefined
      }
    }
    workspaceSettings.set(settings)
  }

  handleApplyTemplate (data) {
    const next = (elements) => {
      elementsStorage.trigger('merge', elements)
      workspaceSettings.set(false)
    }
    if (env('VCV_FT_TEMPLATE_DATA_ASYNC')) {
      let id = data
      this.setState({ showLoading: id })
      myTemplatesService.load(id, (response) => {
        this.setState({ showLoading: 0 })
        next(response.data)
      })
    } else {
      next(data)
    }
  }

  handleRemoveTemplate (id) {
    const removeTemplateWarning = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.removeTemplateWarning : 'Do you want to remove this template?'
    if (window.confirm(removeTemplateWarning)) {
      this.setState({
        showSpinner: id,
        removing: true
      })
      myTemplatesService.remove(id, this.onRemoveSuccess, this.onRemoveFailed)
    }
  }

  onRemoveSuccess () {
    const index = !this.state.categories[ this.state.activeCategoryIndex ].templates.length ? 0 : this.state.activeCategoryIndex
    this.setState({
      activeCategoryIndex: index,
      showSpinner: false,
      removing: false
    })
  }

  onRemoveFailed () {
    const templateRemoveFailed = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.templateRemoveFailed : 'Failed to remove template'

    this.displayError(templateRemoveFailed)
    this.setState({ showSpinner: false })
  }

  render () {
    // const buttonText = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.premiumTemplatesButton : 'Go Premium'
    const templateNameText = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.templateName : 'Template Name'
    const saveTemplateText = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.saveTemplate : 'Save Template'
    const hubButtonDescriptionText = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.goToHubButtonDescription : 'Access Visual Composer Hub - download additional elements, templates and extensions.'

    let itemsOutput = this.isSearching() ? this.getSearchResults() : this.getTemplatesByCategory()

    if (this.state.showSpinner && !this.state.removing) {
      itemsOutput.unshift(this.getTemplateControl({
        name: this.state.showSpinner,
        data: {},
        spinner: true
      }))
    }

    let innerSectionClasses = classNames({
      'vcv-ui-tree-content-section-inner': true,
      'vcv-ui-state--centered-content': itemsOutput && !itemsOutput.length
    })
    let errorMessageClasses = classNames({
      'vcv-ui-tree-content-error-message': true,
      'vcv-ui-tree-content-error-message--visible': this.state.error
    })

    const moreButton = itemsOutput.length
      ? <div className='vcv-ui-editor-get-more'>
        {this.getMoreButton()}
        <span className='vcv-ui-editor-get-more-description'>{hubButtonDescriptionText}</span>
      </div>
      : null

    return (
      <div className='vcv-ui-tree-view-content vcv-ui-add-template-content'>
        {env('VCV_FT_TEMPLATE_DATA_ASYNC') && this.state.showLoading ? <TransparentOverlayComponent disableNavBar parent='.vcv-layout' /> : null}
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
                    <span className='vcv-ui-form-group-heading'>{templateNameText}</span>
                    <form
                      className='vcv-ui-save-template-form'
                      onSubmit={this.handleSaveTemplate}
                      disabled={this.state.showSpinner}
                    >
                      <input
                        className='vcv-ui-form-input'
                        type='text'
                        value={this.state.templateName}
                        onChange={this.changeTemplateName}
                        disabled={this.state.showSpinner}
                      />
                      <button
                        className='vcv-ui-save-template-submit vcv-ui-editor-no-items-action'
                        type='submit'
                        title={saveTemplateText}
                        disabled={this.state.showSpinner}
                      >{saveTemplateText}
                      </button>
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
                {moreButton}
              </div>
            </Scrollbar>
          </div>
        </div>
      </div>
    )
  }
}
