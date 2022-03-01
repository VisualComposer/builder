import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Scrollbar from '../../scrollbar/scrollbar.js'
import BlockControl from './lib/blockControl'
import TransparentOverlayComponent from '../../overlays/transparentOverlay/transparentOverlayComponent'
import { getService, getStorage, env } from 'vc-cake'
import LoadingOverlayComponent from 'public/components/overlays/loadingOverlay/loadingOverlayComponent'
import BlockGroup from './lib/blockGroup'
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

export default class AddBlockPanel extends React.Component {
  static propTypes = {
    searchValue: PropTypes.string,
    handleScrollToElement: PropTypes.func
  }

  static localizations = dataManager.get('localizations')
  static categoriesOrder = [
    'customBlock',
    'customBlockLayoutarchiveTemplate',
    'customBlockLayoutpostTemplate',
    'customBlockpopup',
    'block'
  ]

  errorTimeout = 0

  constructor (props) {
    super(props)
    this.templateServiceData = myTemplatesService.getTemplateData()
    this.setCategoryArray(this.templateServiceData)
    this.state = {
      activeCategoryIndex: 0,
      categoryTitle: 'My Blocks',
      error: false,
      showSpinner: false,
      categories: this.templatesCategories,
      showLoading: false,
      removing: [],
      isRemoveStateActive: workspaceStorage.state('isRemoveStateActive').get() || false
    }

    this.displayError = this.displayError.bind(this)
    this.handleGoToHub = this.handleGoToHub.bind(this)
    this.handleApplyBlock = this.handleApplyBlock.bind(this)
    this.handleRemoveBlock = this.handleRemoveBlock.bind(this)
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
    getStorage('settings').state('layoutType').onChange(this.handleTemplateStorageStateChange)
  }

  componentWillUnmount () {
    if (this.errorTimeout) {
      window.clearTimeout(this.errorTimeout)
      this.errorTimeout = 0
    }
    workspaceStorage.state('isRemoveStateActive').ignoreChange(this.handleRemoveStateChange)
    getStorage('hubTemplates').state('templates').ignoreChange(this.handleTemplateStorageStateChange)
    getStorage('settings').state('layoutType').ignoreChange(this.handleTemplateStorageStateChange)
  }

  handleRemoveStateChange (newState) {
    this.setState({ isRemoveStateActive: newState })
  }

  setCategoryArray (data) {
    const allTemplates = myTemplatesService.getAllTemplates(null, null, data)
    this.templatesCategories = []
    let allBlocksArray = []

    const sortedGroups = getStorage('hubTemplates').state('templatesGroupsSorted').get()
    const checkForLayoutTemplates = dataManager.get('editorType') === 'vcv_layouts'
    let layoutType = ''
    if (checkForLayoutTemplates) {
      layoutType = settingsStorage.state('layoutType').get()
    }

    sortedGroups.forEach((group, index) => {
      if (!data[group] || !data[group].templates || !data[group].templates.length) {
        return
      }
      if (AddBlockPanel.categoriesOrder.includes(group)) {
        if (!checkForLayoutTemplates && group.indexOf('customBlockLayout') !== -1) {
          // Remove layout template from regular pages
          return
        }
        if (group.indexOf('customBlockLayout') !== -1 && group.indexOf('customBlockLayout' + layoutType) === -1) {
          // Remove layout template from other type
          return
        }
        const blocks = data[group] && data[group].templates ? data[group].templates : []
        const groupData = {
          index: index + 1,
          id: group,
          title: data[group].name,
          visible: data[group] && data[group].templates && data[group].templates.length,
          templates: blocks
        }
        allBlocksArray = allBlocksArray.concat(blocks)
        this.templatesCategories.push(groupData)
      }

      delete data[group]
    })

    const allBlocksItems = {
      title: AddBlockPanel.localizations.all,
      id: 'all',
      visible: true,
      templates: allBlocksArray
    }
    this.templatesCategories.unshift(allBlocksItems)

    const mostUsedItems = allTemplates.filter(template => template.usageCount > 9).sort((templateA, templateB) => templateB.usageCount - templateA.usageCount).slice(0, 9)
    // Most Used Group
    if (mostUsedItems.length > 0) {
      const mostUsedBlocksGroup = {
        id: 'usageCount',
        title: 'Most Used',
        templates: mostUsedItems
      }
      this.templatesCategories.unshift(mostUsedBlocksGroup)
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

  getBlockControlProps (template) {
    template = Object.assign({}, template)
    if (
      (env('VCV_FT_TEMPLATE_DATA_ASYNC') && this.state.showLoading === template.id) ||
      (this.state.removing.indexOf(template.id) > -1)
    ) {
      template.spinner = true
    }
    if (!template.type) {
      template.type = 'customBlock'
    }

    return {
      key: 'vcv-element-control-' + template.id,
      applyBlock: this.handleApplyBlock,
      removeBlock: this.handleRemoveBlock,
      isRemoveStateActive: this.state.isRemoveStateActive,
      ...template
    }
  }

  getNoResultsElement () {
    const helperText = AddBlockPanel.localizations.accessVisualComposerHubToDownload || 'Access the Visual Composer Hub - download additional elements, blocks, templates, and addons.'
    const nothingFoundText = AddBlockPanel.localizations.nothingFound || 'Nothing found'

    let source
    if (this.state.categories[0] && !this.state.categories[0].templates.length && !this.state.isSearching) {
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
    const buttonText = AddBlockPanel.localizations.getMoreBlocks || 'Get More Blocks'
    return <button className='vcv-ui-form-button vcv-ui-form-button--large' onClick={this.handleGoToHub}>{buttonText}</button>
  }

  getBlockControl (block) {
    return <BlockControl {...this.getBlockControlProps(block)} />
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
        return this.getBlockControl(template)
      })
  }

  getBlocksByGroup () {
    const allGroups = this.state.categories.filter(category => category.id !== 'all')
    const allBlocks = []

    allGroups.forEach((groupData) => {
      const groupTemplates = []
      groupData.templates.forEach((template) => {
        groupTemplates.push(this.getBlockControl(template))
      })
      groupTemplates.sort((a, b) => {
        const x = a.props.name
        const y = b.props.name
        return ((x < y) ? -1 : ((x > y) ? 1 : 0))
      })
      allBlocks.push(
        <BlockGroup
          key={`vcv-element-category-${groupData.id}`}
          groupData={groupData}
          isOpened={Object.prototype.hasOwnProperty.call(groupData, 'isOpened') ? groupData.isOpened : true}
          onGroupToggle={this.handleGroupToggle}
        >
          {groupTemplates}
        </BlockGroup>
      )
    })

    return allBlocks
  }

  handleGroupToggle (groupID, isOpened) {
    const groupIndex = this.templatesCategories.id === groupID
    if (groupIndex > -1 && this.templatesCategories[groupIndex]) {
      this.templatesCategories[groupIndex].isOpened = isOpened
    }
  }

  getBlockListContainer (itemsOutput) {
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

  handleGoToHub () {
    const settings = {
      action: 'addHub',
      element: {},
      tag: '',
      options: {
        filterType: 'block',
        id: 2,
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

  handleApplyBlock (id, templateType) {
    elementsStorage.state('elementAddList').set([])
    const editorType = dataManager.get('editorType')
    if (templateType === 'popup' && editorType === 'popup' && documentManager.children(false).length > 0) {
      const replacePopupTemplateText = AddBlockPanel.localizations ? AddBlockPanel.localizations.replacePopupTemplateText : 'The current popup will be replaced with the popup template.'
      if (!window.confirm(replacePopupTemplateText)) {
        return
      }
    }
    const next = (elements) => {
      const existingJobs = assetsStorage.state('jobs').get()
      const existingElementVisibleJobs = existingJobs && existingJobs.elements && existingJobs.elements.filter(job => !job.hidden)
      const existingJobsCount = (existingElementVisibleJobs && existingElementVisibleJobs.length) || 0

      elementsStorage.trigger('merge', elements, true)

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
              let errorText = AddBlockPanel.localizations.templateContainsLimitElement || 'The block you want to add contains %element element. You already have %element element added - remove it before adding the block.'
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

  handleRemoveBlock (id, type) {
    const removeBlockWarning = AddBlockPanel.localizations.removeBlockWarning || 'Do you want to delete this block?'
    if (window.confirm(removeBlockWarning)) {
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
    const templateRemovedSuccessfullyText = AddBlockPanel.localizations.blockRemoved || 'The block has been successfully removed.'
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
    const templateRemoveFailed = AddBlockPanel.localizations.blockRemoveFailed || 'Failed to remove the block'

    this.displayError(response && response.message ? response.message : templateRemoveFailed)
    this.setState({ showSpinner: false })
  }

  render () {
    const hubButtonDescriptionText = AddBlockPanel.localizations.goToHubButtonDescription || 'Access the Visual Composer Hub - download additional elements, blocks, templates, and addons.'

    const itemsOutput = this.isSearching() ? this.getSearchResults() : this.getBlocksByGroup()

    const innerSectionClasses = classNames({
      'vcv-ui-tree-content-section-inner': true,
      'vcv-ui-state--centered-content': itemsOutput && !itemsOutput.length
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

    return (
      <div className='vcv-ui-tree-view-content vcv-ui-add-template-content'>
        {transparentOverlay}
        {this.state.showLoading ? <LoadingOverlayComponent /> : null}
        <div className='vcv-ui-tree-content'>
          <div className='vcv-ui-tree-content-section'>
            <Scrollbar>
              <div className={innerSectionClasses}>
                <div className='vcv-ui-editor-plates-container'>
                  <div className='vcv-ui-editor-plates'>
                    <div className='vcv-ui-editor-plate vcv-ui-state--active'>
                      {this.getBlockListContainer(itemsOutput)}
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
