import React from 'react'
import classNames from 'classnames'
import ElementControl from './elementControl'
import Scrollbar from '../../../scrollbar/scrollbar.js'
import vcCake from 'vc-cake'
import PropTypes from 'prop-types'
import ElementsGroup from './elementsGroup'
const dataManager = vcCake.getService('dataManager')
const categoriesService = vcCake.getService('hubCategories')
const groupsService = vcCake.getService('hubGroups')
const sharedAssetsLibraryService = vcCake.getService('sharedAssetsLibrary')
const workspaceStorage = vcCake.getStorage('workspace')
const hubElementsStorage = vcCake.getStorage('hubElements')
const cook = vcCake.getService('cook')
const elementsStorage = vcCake.getStorage('elements')
const dataProcessor = vcCake.getService('dataProcessor')

export default class Categories extends React.Component {
  static propTypes = {
    parent: PropTypes.object,
    onScrollToElement: PropTypes.func
  }

  static localizations = dataManager.get('localizations')

  static allElements = []
  static allCategories = []
  static allGroupData = {}
  static allElementsTags = []
  static hubElements = []
  static addedId = null
  static parentElementTag = null
  static elementPresets = []

  constructor (props) {
    super(props)

    this.state = {
      focusedElement: null
    }

    this.handleGoToHub = this.handleGoToHub.bind(this)
    this.applyFirstElement = this.applyFirstElement.bind(this)
    this.addElement = this.addElement.bind(this)
    this.openEditForm = this.openEditForm.bind(this)
    this.setFocusedElement = this.setFocusedElement.bind(this)
    this.reset = this.reset.bind(this)
    this.handleGroupToggle = this.handleGroupToggle.bind(this)
    Categories.hubElements = hubElementsStorage.state('elements').get()
    hubElementsStorage.once('loaded', this.reset)
    hubElementsStorage.state('elementPresets').onChange(this.reset)
  }

  componentWillUnmount () {
    this.isComponentMounted = false
  }

  componentDidMount () {
    this.isComponentMounted = true
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (this.props.applyFirstElement && (prevProps.applyFirstElement !== this.props.applyFirstElement)) {
      this.applyFirstElement()
    }
  }

  reset () {
    Categories.allCategories = []
    Categories.allElements = []
    Categories.allElementsTags = []
    Categories.elementPresets = []
    Categories.hubElements = hubElementsStorage.state('elements').get()

    categoriesService.getSortedElements.cache.clear()
    this.isComponentMounted && this.forceUpdate()
  }

  hasItemInArray (arr, value) {
    if (Array.isArray(value)) {
      let result = false
      value.find((v) => {
        result = this.hasItemInArray(arr, v)
        return result
      })
      return result
    }
    return arr.indexOf(value) > -1
  }

  getAllElements () {
    const { parent } = this.props
    let relatedTo = ['General', 'RootElements']
    const isParentTag = parent && parent.tag && parent.tag !== 'column'
    if (isParentTag) {
      const parentElement = cook.get(parent)
      if (parentElement) {
        relatedTo = parentElement.containerFor()
      }
    }
    const isAllElements = !Categories.allElements.length || Categories.parentElementTag !== parent.tag
    const isPresetsUpdated = Categories.elementPresets.length !== hubElementsStorage.state('elementPresets').get().length
    if (isAllElements || isPresetsUpdated) {
      const allElements = categoriesService.getSortedElements()
      Categories.allElements = allElements.filter((elementData) => {
        // Do not show custom root element in add element panel
        if (Array.isArray(elementData.relatedTo) && elementData.relatedTo.indexOf('CustomRoot') > -1) {
          return false
        }
        return this.hasItemInArray(relatedTo, elementData.relatedTo)
      })

      const elementPresets = hubElementsStorage.state('elementPresets').get().map((elementPreset) => {
        const cookElement = cook.get(elementPreset.presetData)
        const element = cookElement.toJS()
        element.usageCount = elementPreset.usageCount
        element.name = elementPreset.name
        element.presetId = elementPreset.id
        element.metaDescription = cookElement.get('metaDescription')
        element.metaThumbnailUrl = cookElement.get('metaThumbnailUrl')
        element.metaPreviewUrl = cookElement.get('metaPreviewUrl')
        delete element.id
        return element
      })
      Categories.allElements = elementPresets.concat(Categories.allElements)
    }
    return Categories.allElements
  }

  getAllElementsTags () {
    const isElementTags = !Categories.allElementsTags.length || Categories.parentElementTag !== this.props.parent.tag
    if (isElementTags) {
      const allElements = this.getAllElements()

      Categories.allElementsTags = allElements.map((element) => {
        return element.tag
      })
    }

    return Categories.allElementsTags
  }

  getAllGroups () {
    const isCategories = !Categories.allCategories.length || Categories.parentElementTag !== this.props.parent.tag
    const isPresetsUpdated = Categories.elementPresets.length !== hubElementsStorage.state('elementPresets').get().length

    if (isCategories || isPresetsUpdated) {
      const groupsStore = {}
      const groups = groupsService.all()
      Categories.allCategories = groups.filter((group) => {
        groupsStore[group.title] = categoriesService.getSortedElements(group.elements)
        return groupsStore[group.title].length > 0
      }).map((group, index) => {
        return {
          id: group.title + index, // TODO: Should it be more unique?
          index: index,
          title: group.title,
          elements: groupsStore[group.title]
        }
      })
      Categories.parentElementTag = this.props.parent.tag
      Categories.elementPresets = hubElementsStorage.state('elementPresets').get()
    }

    return Categories.allCategories
  }

  handleGoToHub () {
    const settings = {
      action: 'addHub',
      element: {},
      tag: '',
      options: {
        filterType: 'element',
        id: '1-0',
        bundleType: undefined
      }
    }
    workspaceStorage.state('settings').set(settings)
  }

  getNoResultsElement () {
    const nothingFoundText = Categories.localizations ? Categories.localizations.nothingFound : 'Nothing found'
    const helperText = Categories.localizations ? Categories.localizations.goToHubButtonDescription : 'Access the Visual Composer Hub - download additional elements, blocks, templates, and addons.'
    const source = sharedAssetsLibraryService.getSourcePath('images/search-no-result.png')

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

  getElementControl (elementData) {
    const { tag, name } = elementData
    const key = `vcv-element-control-${name.replace(/ /g, '')}-${tag}`

    return (
      <ElementControl
        key={key}
        elementPresetId={elementData.presetId}
        element={elementData}
        hubElement={Categories.hubElements[tag]}
        tag={tag}
        name={name}
        addElement={this.addElement}
        setFocusedElement={this.setFocusedElement}
        applyFirstElement={this.applyFirstElement}
      />
    )
  }

  getAllGroupData () {
    const isAllGroupDataSet = Categories.allGroupData && Categories.allGroupData.elements

    if (!isAllGroupDataSet) {
      Categories.allGroupData = {
        title: 'All',
        elements: [...new Set(this.getAllElements())]
      }
    }

    return Categories.allGroupData
  }

  getFoundElements () {
    const searchResults = this.getSearchResults(this.props.searchValue)
    return searchResults.map((elementData) => {
      return this.getElementControl(elementData)
    })
  }

  getSearchResults (value) {
    value = value.toLowerCase().trim()
    const allGroupData = this.getAllGroupData()

    function getElementName (elementData) {
      let elName = ''
      if (elementData.name) {
        elName = elementData.name.toLowerCase()
      } else if (elementData.tag) {
        const element = cook.get(elementData)
        if (element.get('name')) {
          elName = element.get('name').toLowerCase()
        }
      }

      return elName
    }

    return allGroupData.elements.filter((elementData) => {
      const elName = getElementName(elementData)
      return elName.indexOf(value.trim()) !== -1
    }).sort((a, b) => getElementName(a).indexOf(value.trim()) - getElementName(b).indexOf(value.trim()))
  }

  getElementsByGroup () {
    const allGroups = this.getAllGroups()
    const presetsCategory = allGroups.find(group => group.id === 'Presets')
    const mostUsedElementsCategory = allGroups.find(group => group.id === 'usageCount')

    if (!Categories.allElements.length) {
      this.getAllElements()
    }
    if (!presetsCategory) {
      const presetElements = Categories.allElements.filter(element => element.presetId)
      if (presetElements.length > 0) {
        const presetElementsCategory = {
          id: 'Presets',
          title: 'Presets',
          elements: presetElements
        }
        allGroups.unshift(presetElementsCategory)
      }
    }

    if (!mostUsedElementsCategory) {
      const mostUsedItems = Categories.allElements.filter(element => element.usageCount > 9).sort((elementA, elementB) => elementB.usageCount - elementA.usageCount).slice(0, 9)
      if (mostUsedItems.length > 0) {
        const mostUsedElementsCategory = {
          id: 'usageCount',
          title: 'Most Used',
          elements: mostUsedItems
        }
        allGroups.unshift(mostUsedElementsCategory)
      }
    }

    const allElements = []

    allGroups.forEach((groupData) => {
      const groupElements = []
      groupData.elements.forEach((element) => {
        groupElements.push(this.getElementControl(element))
      })
      groupElements.sort((a, b) => {
        const x = a.props.name
        const y = b.props.name
        return ((x < y) ? -1 : ((x > y) ? 1 : 0))
      })
      allElements.push(
        <ElementsGroup
          key={`vcv-element-category-${groupData.id}`}
          groupData={groupData}
          isOpened={Object.prototype.hasOwnProperty.call(groupData, 'isOpened') ? groupData.isOpened : true}
          onGroupToggle={this.handleGroupToggle}
        >
          {groupElements}
        </ElementsGroup>
      )
    })

    return allElements
  }

  handleGroupToggle (groupID, isOpened) {
    const groupIndex = Categories.allCategories.findIndex(group => group.id === groupID)
    if (groupIndex > -1 && Categories.allCategories[groupIndex]) {
      Categories.allCategories[groupIndex].isOpened = isOpened
    }
  }

  getElementListContainer (itemsOutput) {
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

  applyFirstElement () {
    const searchResults = this.getSearchResults(this.props.searchValue)
    const { focusedElement } = this.state
    if ((searchResults && searchResults.length) || focusedElement) {
      const element = focusedElement || searchResults[0]
      this.addElement(element)
    }
  }

  addElement (element, presetId = false) {
    const workspace = workspaceStorage.state('settings').get() || false
    element.parent = workspace && workspace.element ? workspace.element.id : false
    element = cook.get(element).toJS()

    elementsStorage.trigger('add', element, true, {
      insertAfter: workspace && workspace.options && workspace.options.insertAfter ? workspace.options.insertAfter : false
    })
    this.addedId = element.id
    const itemTag = presetId ? Categories.elementPresets.find(element => element.id === presetId).tag : element.tag
    dataProcessor.appAdminServerRequest({
      'vcv-action': 'usageCount:updateUsage:adminNonce',
      'vcv-item-tag': itemTag,
      'vcv-nonce': dataManager.get('nonce')
    })

    const iframe = document.getElementById('vcv-editor-iframe')
    this.iframeWindow = iframe && iframe.contentWindow && iframe.contentWindow.window
    this.iframeWindow.vcv && this.iframeWindow.vcv.on('ready', this.openEditForm)
  }

  openEditForm (action, id) {
    if (action === 'add' && id === this.addedId) {
      workspaceStorage.trigger('edit', this.addedId, '')
      this.props.onScrollToElement(this.addedId, true)
      this.iframeWindow.vcv.off('ready', this.openEditForm)
    }
  }

  getMoreButton () {
    const buttonText = Categories.localizations ? Categories.localizations.getMoreElements : 'Get More Elements'
    return (
      <button className='vcv-ui-form-button vcv-ui-form-button--large' onClick={this.handleGoToHub}>
        {buttonText}
      </button>
    )
  }

  setFocusedElement (element) {
    this.setState({ focusedElement: element })
  }

  render () {
    const hubButtonDescriptionText = Categories.localizations ? Categories.localizations.goToHubButtonDescription : 'Access the Visual Composer Hub - download additional elements, blocks, templates, and addons.'
    const itemsOutput = this.props.searchValue ? this.getFoundElements() : this.getElementsByGroup()
    const innerSectionClasses = classNames({
      'vcv-ui-tree-content-section-inner': true,
      'vcv-ui-state--centered-content': !itemsOutput.length
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

    return (
      <div className='vcv-ui-tree-content'>
        <div className='vcv-ui-tree-content-section'>
          <Scrollbar>
            <div className={innerSectionClasses}>
              <div className='vcv-ui-editor-plates-container'>
                <div className='vcv-ui-editor-plates'>
                  <div className='vcv-ui-editor-plate vcv-ui-state--active'>
                    {this.getElementListContainer(itemsOutput)}
                  </div>
                </div>
              </div>
              {moreButton}
            </div>
          </Scrollbar>
        </div>
      </div>
    )
  }
}
