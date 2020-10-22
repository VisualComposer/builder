import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Scrollbar from '../../scrollbar/scrollbar.js'
import TemplateControl from './lib/templateControl'
import TransparentOverlayComponent from '../../overlays/transparentOverlay/transparentOverlayComponent'
import { getService, getStorage, env } from 'vc-cake'
import LoadingOverlayComponent from 'public/components/overlays/loadingOverlay/loadingOverlayComponent'

const sharedAssetsLibraryService = getService('sharedAssetsLibrary')
const myTemplatesService = getService('myTemplates')
const documentManager = getService('document')
const elementsStorage = getStorage('elements')
const workspaceSettings = getStorage('workspace').state('settings')
const settingsStorage = getStorage('settings')
const assetsStorage = getStorage('assets')
const notificationsStorage = getStorage('notifications')
const cook = getService('cook')

export default class AddTemplatePanel extends React.Component {
  static propTypes = {
    searchValue: PropTypes.string,
    handleScrollToElement: PropTypes.func
  }

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
      error: false,
      errorName: '',
      showSpinner: false,
      categories: this.templatesCategories,
      showLoading: false,
      removing: false
    }

    this.handleChangeTemplateName = this.handleChangeTemplateName.bind(this)
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
    notificationsStorage.trigger('portalChange', '.vcv-ui-tree-content-section')
  }

  componentWillUnmount () {
    if (this.errorTimeout) {
      window.clearTimeout(this.errorTimeout)
      this.errorTimeout = 0
    }
    getStorage('hubTemplates').state('templates').ignoreChange(this.handleTemplateStorageStateChange)
    notificationsStorage.trigger('portalChange', null)
  }

  setCategoryArray (data) {
    this.templatesCategories = [
      {
        index: 0,
        title: AddTemplatePanel.localizations.all,
        id: 'all',
        visible: true,
        templates: myTemplatesService.getAllTemplates(null, null, data)
      }
    ]

    const sortedGroups = getStorage('hubTemplates').state('templatesGroupsSorted').get()
    sortedGroups.forEach((group, index) => {
      if (!data[group] || !data[group].templates || !data[group].templates.length) {
        return
      }
      const groupData = {
        index: index + 1,
        id: group,
        title: data[group].name,
        visible: data[group] && data[group].templates && data[group].templates.length,
        templates: data[group] && data[group].templates ? data[group].templates : []
      }
      this.templatesCategories.push(groupData)
      delete data[group]
    })
  }

  handleTemplateStorageStateChange () {
    this.templateServiceData = myTemplatesService.getTemplateData()
    this.setCategoryArray(this.templateServiceData)
    this.setState({ categories: this.templatesCategories })
  }

  // Check state

  isSearching () {
    return this.props.searchValue ? this.props.searchValue.trim() : false
  }

  // Change state

  handleChangeTemplateName (e) {
    this.setState({
      templateName: e.currentTarget.value,
      error: false
    })
  }

  displayError (error) {
    notificationsStorage.trigger('add', {
      position: 'bottom',
      type: 'error',
      text: error,
      time: 5000,
      usePortal: true
    })
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

  getNoResultsElement () {
    const helperText = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.accessVisualComposerHubToDownload : 'Access Visual Composer Hub - download additional elements, templates, and extensions.'
    const nothingFoundText = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.nothingFound : 'Nothing found'

    let source
    if (!this.state.categories[0].templates.length && !this.state.isSearching) {
      source = sharedAssetsLibraryService.getSourcePath('images/add-item.png')
    } else {
      source = sharedAssetsLibraryService.getSourcePath('images/search-no-result.png')
    }

    return (
      <div className='vcv-ui-editor-no-items-container'>
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
    )
  }

  getMoreButton () {
    const buttonText = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.getMoreTemplates : 'Get More Templates'
    return <button className='vcv-ui-form-button vcv-ui-form-button--large' onClick={this.handleGoToHub}>{buttonText}</button>
  }

  getTemplateControl (template) {
    return <TemplateControl {...this.getTemplateControlProps(template)} />
  }

  getSearchResults () {
    const { searchValue } = this.props
    return this.state.categories[0].templates.filter((template) => {
      const name = template.name.toLowerCase()
      return Object.prototype.hasOwnProperty.call(template, 'name') && name.indexOf(searchValue.toLowerCase().trim()) !== -1
    }).map((template) => {
      return this.getTemplateControl(template)
    })
  }

  getTemplatesByCategory () {
    const { activeCategoryIndex } = this.state

    if (this.state.categories[activeCategoryIndex].id === 'downloadMoreTemplates') {
      this.handleGoToHub()
      return []
    }
    const templates = this.state.categories[activeCategoryIndex].templates
    return templates.map((template) => {
      return this.getTemplateControl(template)
    })
  }

  getTemplateListContainer (itemsOutput) {
    if (itemsOutput.length) {
      return (
        <div className='vcv-ui-item-list-container'>
          <div className='vcv-ui-item-list'>
            {itemsOutput}
          </div>
        </div>
      )
    } else {
      return this.getNoResultsElement()
    }
  }

  // Event handlers

  handleSaveTemplate (e) {
    e && e.preventDefault()
    const templateAlreadyExistsText = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.templateAlreadyExists : 'A template with this name already exists. Choose a different template name.'
    const templateContentEmptyText = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.templateContentEmpty : 'There is no content on the page to be saved.'
    const templateSaveFailedText = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.templateSaveFailed : 'Failed to save the template.'
    const specifyTemplateNameText = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.specifyTemplateName : 'Enter the template name to save this page as a template.'
    let { templateName } = this.state
    templateName = templateName.trim()
    if (templateName) {
      if (myTemplatesService.findBy('name', templateName)) {
        this.displayError(templateAlreadyExistsText)
      } else if (!documentManager.size()) {
        this.displayError(templateContentEmptyText)
      } else {
        this.setState({ showSpinner: templateName })
        const templateAddResult = myTemplatesService.addCurrentLayout(templateName, this.onSaveSuccess, this.onSaveFailed)
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
      categoryTitle: this.state.categories[1].title,
      isSearching: false,
      showSpinner: false
    })

    const successText = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.templateSaved : 'The template has been successfully saved.'

    notificationsStorage.trigger('add', {
      position: 'bottom',
      text: successText,
      time: 5000,
      usePortal: true
    })
  }

  onSaveFailed () {
    const errorText = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.templateSaveFailed : 'Failed to save the template.'
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

  getElementExceededLimitStatus (element) {
    const limitData = {}
    if (Object.prototype.hasOwnProperty.call(element, 'metaElementLimit')) {
      const limit = parseInt(element.metaElementLimit)
      const limitedElements = documentManager.getByTag(element.tag) || {}
      if (limit > 0 && Object.keys(limitedElements).length >= limit) {
        limitData.hasExceeded = true
        limitData.limit = limit
      }
    }
    return limitData
  }

  handleApplyTemplate (data, templateType) {
    elementsStorage.state('elementAddList').set([])
    const editorType = window.VCV_EDITOR_TYPE ? window.VCV_EDITOR_TYPE() : 'default'
    if (templateType === 'popup' && editorType === 'popup' && documentManager.children(false).length > 0) {
      const replacePopupTemplateText = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.replacePopupTemplateText : 'The current popup will be replaced with the popup template.'
      if (!window.confirm(replacePopupTemplateText)) {
        return
      }
    }
    const next = (elements) => {
      const existingJobs = assetsStorage.state('jobs').get()
      const existingElementVisibleJobs = existingJobs && existingJobs.elements && existingJobs.elements.filter(job => !job.hidden)
      const existingJobsCount = (existingElementVisibleJobs && existingElementVisibleJobs.length) || 0

      elementsStorage.trigger('merge', elements)

      const handleJobsChange = (data) => {
        const addedElements = elementsStorage.state('elementAddList').get()
        const addedElementsCount = addedElements.length
        const visibleJobs = data.elements.filter(element => !element.hidden)
        if (existingJobsCount + addedElementsCount === visibleJobs.length) {
          const jobsInProgress = data.elements.find(element => element.jobs)
          if (jobsInProgress) {
            return
          }
          this.setState({ showLoading: 0 })
          elementsStorage.state('elementAddList').set([])
          workspaceSettings.set(false)
          assetsStorage.state('jobs').ignoreChange(handleJobsChange)

          window.setTimeout(() => {
            this.props.handleScrollToElement(addedElements[0])
          }, 100)
        }
      }
      assetsStorage.state('jobs').onChange(handleJobsChange)
    }
    const id = data
    this.setState({ showLoading: id })

    if (env('VCV_FT_TEMPLATE_DATA_ASYNC')) {
      myTemplatesService.load(id, (response) => {
        let elementLimitHasExceeded = false
        if (response.data) {
          Object.keys(response.data).forEach((elementId) => {
            const element = response.data[elementId]
            const limitData = this.getElementExceededLimitStatus(element)
            if (limitData.hasExceeded) {
              const cookElement = cook.get(element)
              const elementName = cookElement.get('name')
              let errorText = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.templateContainsLimitElement : 'The template you want to add contains %element element. You already have %element element added - remove it before adding the template.'
              errorText = errorText.split('%element').join(elementName)
              notificationsStorage.trigger('add', {
                position: 'top',
                transparent: false,
                rounded: false,
                type: 'error',
                text: errorText,
                time: 5000,
                showCloseButton: true
              })
              elementLimitHasExceeded = true
            }
          })
        }

        if (elementLimitHasExceeded) {
          this.setState({ showLoading: 0 })
          return
        }

        const customPostData = response && response.allData && response.allData.postFields && response.allData.postFields.dynamicFieldCustomPostData
        if (customPostData) {
          const postData = settingsStorage.state('postData').get()
          const postFields = settingsStorage.state('postFields').get()

          Object.keys(customPostData).forEach((key) => {
            const item = customPostData[key]
            postData[key] = item.postData
            postFields[key] = item.postFields
          })

          settingsStorage.state('postData').set(postData)
          settingsStorage.state('postFields').set(postFields)
        }
        next(response.data)
      })
    } else {
      next(data)
    }
  }

  handleRemoveTemplate (id) {
    const removeTemplateWarning = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.removeTemplateWarning : 'Do you want to delete this template?'
    if (window.confirm(removeTemplateWarning)) {
      this.setState({
        showSpinner: id,
        removing: true
      })
      myTemplatesService.remove(id, this.onRemoveSuccess, this.onRemoveFailed)
    }
  }

  onRemoveSuccess () {
    const index = !this.state.categories[this.state.activeCategoryIndex].templates.length ? 0 : this.state.activeCategoryIndex
    this.setState({
      activeCategoryIndex: index,
      showSpinner: false,
      removing: false
    })
  }

  onRemoveFailed () {
    const templateRemoveFailed = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.templateRemoveFailed : 'Failed to remove the template'

    this.displayError(templateRemoveFailed)
    this.setState({ showSpinner: false })
  }

  render () {
    const templateNameText = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.templateName : 'Template Name'
    const saveTemplateText = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.saveTemplate : 'Save Template'
    const hubButtonDescriptionText = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.goToHubButtonDescription : 'Access Visual Composer Hub - download additional elements, templates, and extensions.'

    const itemsOutput = this.isSearching() ? this.getSearchResults() : this.getTemplatesByCategory()
    if (this.state.showSpinner && !this.state.removing) {
      itemsOutput.push(this.getTemplateControl({
        name: this.state.templateName,
        data: {},
        spinner: true
      }))
    }

    const innerSectionClasses = classNames({
      'vcv-ui-tree-content-section-inner': true,
      'vcv-ui-state--centered-content': itemsOutput && !itemsOutput.length
    })
    const errorMessageClasses = classNames({
      'vcv-ui-tree-content-error-message': true,
      'vcv-ui-tree-content-error-message--visible': this.state.error
    })

    let moreButton = null
    if (itemsOutput.length) {
      moreButton = (
        <div className='vcv-ui-editor-get-more'>
          {this.getMoreButton()}
          <span className='vcv-ui-editor-get-more-description'>{hubButtonDescriptionText}</span>
        </div>
      )
    }

    let transparentOverlay = null
    if (env('VCV_FT_TEMPLATE_DATA_ASYNC') && this.state.showLoading) {
      transparentOverlay = <TransparentOverlayComponent disableNavBar parent='.vcv-layout' />
    }

    return (
      <div className='vcv-ui-tree-view-content vcv-ui-add-template-content'>
        {transparentOverlay}
        {this.state.showLoading ? <LoadingOverlayComponent /> : null}
        <div className='vcv-ui-tree-content'>
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
                      disabled={!!this.state.showSpinner}
                    >
                      <input
                        className='vcv-ui-form-input'
                        type='text'
                        value={this.state.templateName}
                        onChange={this.handleChangeTemplateName}
                        disabled={!!this.state.showSpinner}
                      />
                      <button
                        className='vcv-ui-save-template-submit vcv-ui-editor-no-items-action'
                        type='submit'
                        title={saveTemplateText}
                        disabled={!!this.state.showSpinner}
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
