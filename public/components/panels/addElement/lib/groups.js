import React from 'react'
import classNames from 'classnames'
import ElementControl from './elementControl'
import Scrollbar from '../../../scrollbar/scrollbar.js'
import vcCake from 'vc-cake'
import PropTypes from 'prop-types'
import ElementsGroup from './elementsGroup'

const dataManager = vcCake.getService('dataManager')
const hubElementsService = vcCake.getService('hubElements')
const sharedAssetsLibraryService = vcCake.getService('sharedAssetsLibrary')
const workspaceStorage = vcCake.getStorage('workspace')
const hubElementsStorage = vcCake.getStorage('hubElements')
const cook = vcCake.getService('cook')
const elementsStorage = vcCake.getStorage('elements')
const dataProcessor = vcCake.getService('dataProcessor')

export default class Groups extends React.Component {
  static propTypes = {
    parent: PropTypes.object,
    onScrollToElement: PropTypes.func
  }

  static localizations = dataManager.get('localizations')

  static allElements = []
  static allGroups = []
  static lastAddedElementId = null

  // static parentElementTag = null

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
    if (this.props.parent.tag !== prevProps.parent.tag) {
      this.reset()
    }
    if (this.props.applyFirstElement && (prevProps.applyFirstElement !== this.props.applyFirstElement)) {
      this.applyFirstElement()
    }
  }

  reset () {
    Groups.allGroups = []
    Groups.allElements = []

    hubElementsService.getSortedElements.cache.clear()
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

  getElements () {
    if (!Groups.allElements.length) {
      const { parent } = this.props
      let relatedTo = ['General', 'RootElements']
      const isParentTag = parent && parent.tag && parent.tag !== 'column'
      if (isParentTag) {
        const parentElement = cook.get(parent)
        if (parentElement) {
          relatedTo = parentElement.containerFor()
        }
      }

      const allElements = hubElementsService.getSortedElements()
      Groups.allElements = allElements.filter((elementData) => {
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
      Groups.allElements = elementPresets.concat(Groups.allElements)
    }

    return Groups.allElements
  }

  getGroups () {
    if (!Groups.allGroups.length) {
      const allElements = this.getElements()
      let usedElements = []
      const groupsStore = {}
      const groups = dataManager.get('hubGetGroups')
      const hubCategories = hubElementsStorage.state('categories').get()

      const getGroupElements = function (group) {
        let groupElements = []
        if (group.categories) {
          group.categories.forEach(category => {
            if (hubCategories[category]) {
              groupElements = groupElements.concat(hubCategories[category].elements)
            }
          })
        }
        groupElements = [...new Set(groupElements.concat(group.elements))]

        // Filter out sub-elements like column
        return groupElements.filter(element => allElements.findIndex(el => el.tag === element) > -1)
      }
      Groups.allGroups = groups.filter((group) => {
        // get all elements by group.categories
        // concatenate with group.elements
        const groupElements = getGroupElements(group)
        groupsStore[group.title] = []
        if (groupElements.length) {
          groupsStore[group.title] = hubElementsService.getSortedElements(groupElements)
        }
        usedElements = usedElements.concat(groupElements)

        return groupsStore[group.title].length > 0
      }).map((group, index) => {
        return {
          id: group.title + index,
          index: index,
          title: group.title,
          elements: groupsStore[group.title]
        }
      })

      // Element Presets Group
      const presetElements = allElements.filter(element => element.presetId)
      if (presetElements.length > 0) {
        const presetElementsGroup = {
          id: 'Presets',
          title: 'Presets',
          elements: presetElements
        }
        Groups.allGroups.unshift(presetElementsGroup)
      }

      // Most User Group
      const mostUsedItems = allElements.filter(element => element.usageCount > 9).sort((elementA, elementB) => elementB.usageCount - elementA.usageCount).slice(0, 9)
      if (mostUsedItems.length > 0) {
        const mostUsedElementsGroup = {
          id: 'usageCount',
          title: 'Most Used',
          elements: mostUsedItems
        }
        Groups.allGroups.unshift(mostUsedElementsGroup)
      }

      usedElements = [...new Set(usedElements)]
      if (allElements.length !== usedElements.length) {
        // There are elements that are not inside any group
        // Move them to Other group
        const otherElements = allElements.filter(element => usedElements.indexOf(element.tag) === -1)
        const otherElementsGroup = {
          id: 'other',
          title: 'Other',
          elements: otherElements
        }
        Groups.allGroups.push(otherElementsGroup)
      }
    }

    return Groups.allGroups
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
    const nothingFoundText = Groups.localizations ? Groups.localizations.nothingFound : 'Nothing found'
    const helperText = Groups.localizations ? Groups.localizations.goToHubButtonDescription : 'Access the Visual Composer Hub - download additional elements, blocks, templates, and addons.'
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
        thirdParty={elementData.thirdParty}
        tag={tag}
        name={name}
        addElement={this.addElement}
        setFocusedElement={this.setFocusedElement}
        applyFirstElement={this.applyFirstElement}
      />
    )
  }

  getFoundElements () {
    const searchResults = this.getSearchResults(this.props.searchValue)
    return searchResults.map((elementData) => {
      return this.getElementControl(elementData)
    })
  }

  getSearchResults (searchValue) {
    searchValue = searchValue.toLowerCase().trim()
    const allElements = [...new Set(this.getElements())]

    return allElements.filter((elementData) => {
      const elName = hubElementsService.getElementName(elementData)
      return elName.indexOf(searchValue) !== -1
    }).sort((a, b) => hubElementsService.getElementName(a).indexOf(searchValue) - hubElementsService.getElementName(b).indexOf(searchValue))
  }

  getElementsByGroups () {
    const allGroups = this.getGroups()
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
    const groupIndex = Groups.allGroups.findIndex(group => group.id === groupID)
    if (groupIndex > -1 && Groups.allGroups[groupIndex]) {
      Groups.allGroups[groupIndex].isOpened = isOpened
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
    Groups.lastAddedElementId = element.id
    const itemTag = presetId ? hubElementsStorage.state('elementPresets').get().find(element => element.id === presetId).tag : element.tag
    dataProcessor.appAdminServerRequest({
      'vcv-action': 'usageCount:updateUsage:adminNonce',
      'vcv-item-tag': itemTag
    })

    const iframe = document.getElementById('vcv-editor-iframe')
    this.iframeWindow = iframe && iframe.contentWindow && iframe.contentWindow.window
    this.iframeWindow.vcv && this.iframeWindow.vcv.on('ready', this.openEditForm)
  }

  openEditForm (action, id) {
    if (action === 'add' && id === Groups.lastAddedElementId) {
      workspaceStorage.trigger('edit', Groups.lastAddedElementId, '')
      this.props.onScrollToElement && this.props.onScrollToElement(Groups.lastAddedElementId, true)
      this.iframeWindow.vcv.off('ready', this.openEditForm)
    }
  }

  getMoreButton () {
    const buttonText = Groups.localizations ? Groups.localizations.getMoreElements : 'Get More Elements'
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
    const hubButtonDescriptionText = Groups.localizations ? Groups.localizations.goToHubButtonDescription : 'Access the Visual Composer Hub - download additional elements, blocks, templates, and addons.'
    const itemsOutput = this.props.searchValue ? this.getFoundElements() : this.getElementsByGroups()
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
