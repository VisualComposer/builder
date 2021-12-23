import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Scrollbar from '../../scrollbar/scrollbar.js'
import TemplateControl from './lib/templateControl'
import TransparentOverlayComponent from '../../overlays/transparentOverlay/transparentOverlayComponent'
import { getService, getStorage, env } from 'vc-cake'
import LoadingOverlayComponent from 'public/components/overlays/loadingOverlay/loadingOverlayComponent'
import TemplatesGroup from './lib/templatesGroup'
import store from 'public/editor/stores/store'
import { notificationAdded } from 'public/editor/stores/notifications/slice'

const dataManager = getService('dataManager')
const sharedAssetsLibraryService = getService('sharedAssetsLibrary')
const myTemplatesService = getService('myTemplates')
const documentManager = getService('document')
const elementsStorage = getStorage('elements')
const workspaceStorage = getStorage('workspace')
const workspaceSettings = workspaceStorage.state('settings')
const settingsStorage = getStorage('settings')
const assetsStorage = getStorage('assets')
const cook = getService('cook')
const roleManager = getService('roleManager')

export default class AddTemplatePanel extends React.Component {
  static propTypes = {
    searchValue: PropTypes.string,
    handleScrollToElement: PropTypes.func
  }

  static localizations = dataManager.get('localizations')
  static categoriesOrder = [
    'custom',
    'customHeader',
    'customFooter',
    'customSidebar',
    'popup',
    'hubHeader',
    'hubFooter',
    'hubSidebar',
    'hub',
    'predefined'
  ]

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
      removing: [],
      isRemoveStateActive: workspaceStorage.state('isRemoveStateActive').get() || false
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
    this.handleRemoveStateChange = this.handleRemoveStateChange.bind(this)
    this.handleGroupToggle = this.handleGroupToggle.bind(this)

    workspaceStorage.state('isRemoveStateActive').onChange(this.handleRemoveStateChange)
  }

  componentDidMount () {
    getStorage('hubTemplates').state('templates').onChange(this.handleTemplateStorageStateChange)
  }

  componentWillUnmount () {
    if (this.errorTimeout) {
      window.clearTimeout(this.errorTimeout)
      this.errorTimeout = 0
    }
    workspaceStorage.state('isRemoveStateActive').ignoreChange(this.handleRemoveStateChange)
    getStorage('hubTemplates').state('templates').ignoreChange(this.handleTemplateStorageStateChange)
  }

  handleRemoveStateChange (newState) {
    this.setState({ isRemoveStateActive: newState })
  }

  setCategoryArray (data) {
    const allTemplates = myTemplatesService.getAllTemplates(null, null, data).filter(template => !['customBlock', 'block'].includes(template.type))
    this.templatesCategories = [
      {
        index: 0,
        title: AddTemplatePanel.localizations.all,
        id: 'all',
        visible: true,
        templates: allTemplates
      }
    ]

    const sortedGroups = getStorage('hubTemplates').state('templatesGroupsSorted').get()
    // Sort categories according to predefined order in AddTemplatePanel.categoriesOrder
    const sorter = (a, b) => {
      return AddTemplatePanel.categoriesOrder.indexOf(a) - AddTemplatePanel.categoriesOrder.indexOf(b)
    }
    sortedGroups.sort(sorter)

    sortedGroups.forEach((group, index) => {
      if (!data[group] || !data[group].templates || !data[group].templates.length) {
        return
      }
      // Merge hub and predefined groups together for BC
      if (group === 'predefined' && this.templatesCategories.find(category => category.id === 'predefined')) {
        const predefinedTemplates = data[group] && data[group].templates ? data[group].templates : []
        const hubTemplates = this.templatesCategories.find(category => category.id === 'hub')
        if (hubTemplates) {
          hubTemplates.templates = [...hubTemplates.templates, ...predefinedTemplates]
        }
      } else if (!group.toLowerCase().includes('block')) {
        const groupData = {
          index: index + 1,
          id: group,
          title: data[group].name,
          visible: data[group] && data[group].templates && data[group].templates.length,
          templates: data[group] && data[group].templates ? data[group].templates : []
        }
        this.templatesCategories.push(groupData)
      }

      delete data[group]
    })

    const mostUsedItems = allTemplates.filter(template => template.usageCount > 9).sort((templateA, templateB) => templateB.usageCount - templateA.usageCount).slice(0, 9)
    // Most User Group
    if (mostUsedItems.length > 0) {
      const mostUsedTemplatesGroup = {
        id: 'usageCount',
        title: 'Most Used',
        templates: mostUsedItems
      }
      this.templatesCategories.unshift(mostUsedTemplatesGroup)
    }
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

  displaySuccess (successText) {
    store.dispatch(notificationAdded({
      text: successText,
      time: 5000
    }))
  }

  displayError (error) {
    store.dispatch(notificationAdded({
      type: 'error',
      text: error,
      time: 5000
    }))
  }

  getTemplateControlProps (template) {
    template = Object.assign({}, template)
    if (
      (env('VCV_FT_TEMPLATE_DATA_ASYNC') && this.state.showLoading === template.id) ||
      (this.state.removing.indexOf(template.id) > -1)
    ) {
      template.spinner = true
    }
    if (!template.type) {
      template.type = 'custom'
    }

    return {
      key: 'vcv-element-control-' + template.id,
      applyTemplate: this.handleApplyTemplate,
      removeTemplate: this.handleRemoveTemplate,
      isRemoveStateActive: this.state.isRemoveStateActive,
      ...template
    }
  }

  getNoResultsElement () {
    const helperText = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.accessVisualComposerHubToDownload : 'Access the Visual Composer Hub - download additional elements, blocks, templates, and addons.'
    const nothingFoundText = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.nothingFound : 'Nothing found'

    let source
    if (!this.state.categories[0].templates.length && !this.state.isSearching) {
      source = sharedAssetsLibraryService.getSourcePath('images/add-item.png')
    } else {
      source = sharedAssetsLibraryService.getSourcePath('images/search-no-result.png')
    }
    let moreButtonOutput = null
    if (roleManager.can('hub_elements_templates_blocks', roleManager.defaultTrue())) {
      moreButtonOutput = (
        <div>
          <div className='vcv-ui-editor-no-items-content'>
            {this.getMoreButton()}
          </div>
          <div className='vcv-ui-editor-no-items-content'>
            <p className='vcv-start-blank-helper'>{helperText}</p>
          </div>
        </div>
      )
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
        {moreButtonOutput}
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
    const searchValue = this.props.searchValue.toLowerCase()
    const allCategories = this.state.categories.find(category => category.id === 'all')

    return allCategories.templates.filter((template) => {
      const name = template.name && template.name.toLowerCase()
      if (name && name.indexOf(searchValue) !== -1) {
        return true
      } else {
        const description = template.description && template.description.toLowerCase()
        return description && description.indexOf(searchValue) !== -1
      }
    }).sort((a, b) => {
      let firstIndex = a.name.indexOf(searchValue)
      let secondIndex = b.name.indexOf(searchValue)

      // In case if found by description it goes last
      firstIndex = firstIndex === -1 ? 100 : firstIndex
      secondIndex = secondIndex === -1 ? 100 : secondIndex

      return firstIndex - secondIndex
    })
      .map((template) => {
        return this.getTemplateControl(template)
      })
  }

  getTemplatesByGroup () {
    const allGroups = this.state.categories.filter(category => category.id !== 'all')
    const allTemplates = []

    allGroups.forEach((groupData) => {
      const groupTemplates = []
      groupData.templates.forEach((template) => {
        groupTemplates.push(this.getTemplateControl(template))
      })
      groupTemplates.sort((a, b) => {
        const x = a.props.name
        const y = b.props.name
        return ((x < y) ? -1 : ((x > y) ? 1 : 0))
      })
      allTemplates.push(
        <TemplatesGroup
          key={`vcv-element-category-${groupData.id}`}
          groupData={groupData}
          isOpened={Object.prototype.hasOwnProperty.call(groupData, 'isOpened') ? groupData.isOpened : true}
          onGroupToggle={this.handleGroupToggle}
        >
          {groupTemplates}
        </TemplatesGroup>
      )
    })

    return allTemplates
  }

  handleGroupToggle (groupID, isOpened) {
    const groupIndex = this.templatesCategories.id === groupID
    if (groupIndex > -1 && this.templatesCategories[groupIndex]) {
      this.templatesCategories[groupIndex].isOpened = isOpened
    }
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
          this.setState({
            showSpinner: false
          })
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

    store.dispatch(notificationAdded({
      text: successText,
      time: 5000
    }))
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
        id: 1,
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

  handleApplyTemplate (id, templateType) {
    elementsStorage.state('elementAddList').set([])
    const editorType = dataManager.get('editorType')
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
              store.dispatch(notificationAdded({
                type: 'error',
                text: errorText,
                time: 5000,
                showCloseButton: true
              }))
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
    }
  }

  handleRemoveTemplate (id, type) {
    const removeTemplateWarning = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.removeTemplateWarning : 'Do you want to delete this template?'
    if (window.confirm(removeTemplateWarning)) {
      const newRemovingState = this.state.removing
      newRemovingState.push(id)
      this.setState({
        showSpinner: id,
        removing: newRemovingState
      })

      myTemplatesService.remove(id, type, this.onRemoveSuccess.bind(this, id), this.onRemoveFailed)
    }
  }

  onRemoveSuccess (id) {
    const index = !this.state.categories[this.state.activeCategoryIndex].templates.length ? 0 : this.state.activeCategoryIndex
    const templateRemovedSuccessfullyText = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.templateRemoved : 'The template has been successfully removed.'
    this.displaySuccess(templateRemovedSuccessfullyText)
    const newRemoveState = this.state.removing
    newRemoveState.splice(newRemoveState.indexOf(id), 1)

    this.setState({
      activeCategoryIndex: index,
      showSpinner: false,
      removing: newRemoveState
    })
  }

  onRemoveFailed (response) {
    const templateRemoveFailed = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.templateRemoveFailed : 'Failed to remove the template'

    this.displayError(response && response.message ? response.message : templateRemoveFailed)
    this.setState({ showSpinner: false })
  }

  render () {
    const enterTemplateNameText = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.enterTemplateName : 'Enter template name'
    const saveTemplateText = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.saveTemplate : 'Save Template'
    const hubButtonDescriptionText = AddTemplatePanel.localizations ? AddTemplatePanel.localizations.goToHubButtonDescription : 'Access the Visual Composer Hub - download additional elements, blocks, templates, and addons.'

    const itemsOutput = this.isSearching() ? this.getSearchResults() : this.getTemplatesByGroup()
    if (this.state.showSpinner && !this.state.removing.length) {
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

    let moreButtonOutput = null
    if (itemsOutput.length && roleManager.can('hub_elements_templates_blocks', roleManager.defaultTrue())) {
      moreButtonOutput = (
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

    const isAbleToSave = roleManager.can('editor_content_user_templates_management', roleManager.defaultTrue())
    const buttonClasses = classNames({
      'vcv-ui-form-button': true,
      'vcv-ui-form-button--action': true,
      'vcv-ui-form-button--loading': !!this.state.showSpinner
    })
    const editorType = dataManager.get('editorType')

    const saveTemplate = (this.state.isRemoveStateActive || !isAbleToSave) || (editorType === 'vcv_layouts') ? null : (
      <div className='vcv-ui-form-dependency'>
        <div className='vcv-ui-form-group'>
          <form
            className='vcv-ui-save-template-form'
            onSubmit={this.handleSaveTemplate}
            disabled={!!this.state.showSpinner}
          >
            <input
              className='vcv-ui-form-input vcv-ui-editor-save-template-field'
              type='text'
              value={this.state.templateName}
              onChange={this.handleChangeTemplateName}
              disabled={!!this.state.showSpinner}
              placeholder={enterTemplateNameText}
            />
            <button
              className={buttonClasses}
              type='submit'
              title={saveTemplateText}
              disabled={!!this.state.showSpinner}
            >{saveTemplateText}
            </button>
          </form>
        </div>
      </div>
    )

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
                {saveTemplate}
                <div className='vcv-ui-editor-plates-container'>
                  <div className='vcv-ui-editor-plates'>
                    <div className='vcv-ui-editor-plate vcv-ui-state--active'>
                      {this.getTemplateListContainer(itemsOutput)}
                    </div>
                  </div>
                </div>
                {moreButtonOutput}
              </div>
            </Scrollbar>
          </div>
        </div>
      </div>
    )
  }
}
