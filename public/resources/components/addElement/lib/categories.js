import React from 'react'
import classNames from 'classnames'
import ElementControl from './elementControl'
import Scrollbar from '../../../scrollbar/scrollbar.js'
import SearchElement from './searchElement'
import vcCake from 'vc-cake'
import PropTypes from 'prop-types'

const categoriesService = vcCake.getService('hubCategories')
const groupsService = vcCake.getService('hubGroups')
const sharedAssetsLibraryService = vcCake.getService('sharedAssetsLibrary')
const workspaceStorage = vcCake.getStorage('workspace')
const hubElementsStorage = vcCake.getStorage('hubElements')
const cook = vcCake.getService('cook')
const elementsStorage = vcCake.getStorage('elements')

export default class Categories extends React.Component {
  static propTypes = {
    parent: PropTypes.object
  }

  static allElements = []
  static allCategories = []
  static allElementsTags = []
  static hubElements = []
  static addedId = null
  static parentElementTag = null

  constructor (props) {
    super(props)

    this.state = {
      activeCategoryIndex: 0,
      inputValue: '',
      isSearching: '',
      centered: false,
      filterType: 'all',
      focusedElement: null
    }

    this.changeActiveCategory = this.changeActiveCategory.bind(this)
    this.changeSearchState = this.changeSearchState.bind(this)
    this.changeInput = this.changeInput.bind(this)
    this.handleGoToHub = this.handleGoToHub.bind(this)
    this.applyFirstElement = this.applyFirstElement.bind(this)
    this.addElement = this.addElement.bind(this)
    this.openEditForm = this.openEditForm.bind(this)
    this.setFocusedElement = this.setFocusedElement.bind(this)
    this.reset = this.reset.bind(this)
    Categories.hubElements = hubElementsStorage.state('elements').get()
    hubElementsStorage.state('elements').onChange(this.reset)
  }

  reset () {
    Categories.allCategories = []
    Categories.allElements = []
    Categories.allElementsTags = []
    Categories.hubElements = hubElementsStorage.state('elements').get()

    vcCake.getService('hubCategories').getSortedElements.cache.clear()
  }

  getAllElements () {
    const { parent } = this.props
    let relatedTo = [ 'General', 'RootElements' ]
    let isParentTag = parent && parent.tag && parent.tag !== 'column'
    if (isParentTag) {
      const parentElement = cook.get(parent)
      if (parentElement) {
        relatedTo = parentElement.containerFor()
      }
    }
    let isAllElements = !Categories.allElements.length || Categories.parentElementTag !== parent.tag
    if (isAllElements) {
      let allElements = categoriesService.getSortedElements()
      Categories.allElements = allElements.filter((elementData) => {
        let cookElement = cook.get(elementData)
        return cookElement ? cookElement.relatedTo(relatedTo) : false
      })
    }

    return Categories.allElements
  }

  getAllElementsTags () {
    let isElementTags = !Categories.allElementsTags.length || Categories.parentElementTag !== this.props.parent.tag
    if (isElementTags) {
      let allElements = this.getAllElements()

      Categories.allElementsTags = allElements.map((element) => {
        return element.tag
      })
    }

    return Categories.allElementsTags
  }

  getElementsList (groupCategories, tags) {
    let groupElements = []
    let setGroupElements = (element) => {
      if (tags.indexOf(element.tag) > -1) {
        groupElements.push(element)
      }
    }
    if (groupCategories === true) {
      // Get ALL
      groupElements = this.getAllElements()
    } else {
      groupCategories.forEach((category) => {
        let categoryElements = categoriesService.getSortedElements(category)
        categoryElements.forEach(setGroupElements)
      })
    }
    groupElements = [ ...new Set(groupElements) ]

    return groupElements
  }

  getAllCategories () {
    let isCategories = !Categories.allCategories.length || Categories.parentElementTag !== this.props.parent.tag
    if (isCategories) {
      let groupsStore = {}
      let groups = groupsService.all()
      let tags = this.getAllElementsTags()
      Categories.allCategories = groups.filter((group) => {
        groupsStore[ group.title ] = this.getElementsList(group.categories, tags)
        return groupsStore[ group.title ].length > 0
      }).map((group, index) => {
        return {
          id: group.title + index, // TODO: Should it be more unique?
          index: index,
          title: group.title,
          elements: groupsStore[ group.title ],
          isVisible: true
        }
      })
      Categories.parentElementTag = this.props.parent.tag
    }

    return Categories.allCategories
  }

  changeActiveCategory (catIndex) {
    this.setState({
      activeCategoryIndex: catIndex
    })
  }

  changeInput (value) {
    this.setState({
      inputValue: value,
      searchResults: this.getSearchResults(value)
    })
  }

  handleGoToHub () {
    document.querySelector('.vcv-ui-navbar-control[title="Hub"]').click()
  }

  getNoResultsElement () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const nothingFoundText = localizations ? localizations.nothingFound : 'Nothing found'
    const helperText = localizations ? localizations.accessVisualComposerHubToDownload : 'Access Visual Composer Hub - to download additional elements, templates and extensions.'
    let source = sharedAssetsLibraryService.getSourcePath('images/search-no-result.png')

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

  getElementControl (elementData) {
    const element = cook.get(elementData)
    let tag = element.get('tag')

    return <ElementControl
      key={'vcv-element-control-' + tag}
      element={elementData}
      hubElement={Categories.hubElements[ tag ]}
      tag={tag}
      workspace={workspaceStorage.state('settings').get() || {}}
      name={element.get('name')}
      addElement={this.addElement}
      setFocusedElement={this.setFocusedElement}
      applyFirstElement={this.applyFirstElement}
    />
  }

  changeSearchState (state) {
    this.setState({
      isSearching: state
    })
  }

  getSearchProps () {
    return {
      allCategories: this.getAllCategories(),
      index: this.state.activeCategoryIndex,
      changeActive: this.changeActiveCategory,
      changeTerm: this.changeSearchState,
      changeInput: this.changeInput,
      applyFirstElement: this.applyFirstElement
    }
  }

  getSearchElement () {
    let searchProps = this.getSearchProps()
    return <SearchElement {...searchProps} />
  }

  getFoundElements () {
    return this.state.searchResults.map((elementData) => {
      return this.getElementControl(elementData)
    })
  }

  getSearchResults (value) {
    let allCategories = this.getAllCategories()
    let getIndex = allCategories.findIndex((val) => {
      return val.title === 'All' || val.title === 'All Elements'
    })

    return allCategories[ getIndex ].elements.filter((elementData) => {
      let elName = ''
      if (elementData.name) {
        elName = elementData.name.toLowerCase()
      } else if (elementData.tag) {
        const element = cook.get(elementData)
        if (element.get('name')) {
          elName = element.get('name').toLowerCase()
        }
      }

      return elName.indexOf(value.trim()) !== -1
    })
  }

  getElementsByCategory () {
    const { activeCategoryIndex } = this.state
    const allCategories = this.getAllCategories()
    const i = activeCategoryIndex

    return allCategories && allCategories[ i ] && allCategories[ i ].elements ? allCategories[ i ].elements.map((tag) => {
      return this.getElementControl(tag)
    }) : []
  }

  getElementListContainer (itemsOutput) {
    return itemsOutput.length ? <div className='vcv-ui-item-list-container'>
      <ul className='vcv-ui-item-list'>
        {itemsOutput}
      </ul>
    </div> : this.getNoResultsElement()
  }

  isSearching () {
    let { isSearching, inputValue } = this.state
    return isSearching && inputValue.trim()
  }

  applyFirstElement () {
    const { searchResults, focusedElement } = this.state
    if ((searchResults && searchResults.length) || focusedElement) {
      let tag = focusedElement || searchResults[ 0 ].tag
      this.addElement(tag)
    }
  }

  addElement (tag) {
    const workspace = workspaceStorage.state('settings').get() || {}
    const parentElementId = workspace.element ? workspace.element.id : false
    const data = cook.get({ tag: tag, parent: parentElementId })
    elementsStorage.trigger('add', data.toJS(), true, {
      insertAfter: workspace.options && workspace.options.insertAfter ? workspace.options.insertAfter : false
    })
    this.addedId = data.toJS().id

    let iframe = document.getElementById('vcv-editor-iframe')
    this.iframeWindow = iframe && iframe.contentWindow && iframe.contentWindow.window
    this.iframeWindow.vcv.on('ready', this.openEditForm)
  }

  openEditForm (action, id) {
    if (action === 'add' && id === this.addedId) {
      workspaceStorage.trigger('edit', this.addedId, '')
      this.iframeWindow.vcv.off('ready', this.openEditForm)
    }
  }

  getMoreButton () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const buttonText = localizations ? localizations.getMoreElements : 'Get More Elements'
    return <button className='vcv-start-blank-button' onClick={this.handleGoToHub}>
      {buttonText}
    </button>
  }

  setFocusedElement (tag) {
    this.setState({ focusedElement: tag })
  }

  render () {
    let itemsOutput = this.isSearching() ? this.getFoundElements() : this.getElementsByCategory()
    let innerSectionClasses = classNames({
      'vcv-ui-tree-content-section-inner': true,
      'vcv-ui-state--centered-content': !itemsOutput.length
    })

    return <div className='vcv-ui-tree-content'>
      {this.getSearchElement()}
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
            <div className='vcv-ui-editor-get-more'>
              {itemsOutput.length ? this.getMoreButton() : null}
            </div>
          </div>
        </Scrollbar>
      </div>
    </div>
  }
}
