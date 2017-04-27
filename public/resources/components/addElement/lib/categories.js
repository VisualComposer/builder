import React from 'react'
import classNames from 'classnames'
import ElementControl from './elementControl'
import Scrollbar from '../../../scrollbar/scrollbar.js'
import SearchElement from './searchElement'
import vcCake from 'vc-cake'
const categoriesService = vcCake.getService('hubCategories')
const groupsService = vcCake.getService('hubGroups')
const sharedAssetsLibraryService = vcCake.getService('sharedAssetsLibrary')
const workspaceStorage = vcCake.getStorage('workspace')
const cook = vcCake.getService('cook')

export default class Categories extends React.Component {
  static propTypes = {
    options: React.PropTypes.object
  }

  allElements = []
  allCategories = []
  allElementsTags = []

  constructor (props) {
    super(props)
    this.state = {
      activeCategoryIndex: 0,
      inputValue: '',
      isSearching: '',
      centered: false
    }
    this.changeActiveCategory = this.changeActiveCategory.bind(this)
    this.changeSearchState = this.changeSearchState.bind(this)
    this.changeInput = this.changeInput.bind(this)
  }

  getAllElements () {
    if (!this.allElements.length) {
      let allElements = categoriesService.getSortedElements()
      this.allElements = allElements.filter((elementData) => {
        let cookElement = cook.get(elementData)
        return cookElement ? cookElement.relatedTo([ 'General' ]) : false
      })
    }

    return this.allElements
  }

  getAllElementsTags () {
    if (!this.allElementsTags.length) {
      let allElements = this.getAllElements()

      this.allElementsTags = allElements.map((element) => {
        return element.tag
      })
    }

    return this.allElementsTags
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
    if (!this.allCategories.length) {
      let groupsStore = {}
      let groups = groupsService.all()
      let tags = this.getAllElementsTags()
      this.allCategories = groups.filter((group) => {
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
    }

    return this.allCategories
  }

  changeActiveCategory (catIndex) {
    this.setState({
      activeCategoryIndex: catIndex
    })
  }

  changeInput (value) {
    this.setState({
      inputValue: value
    })
  }

  getNoResultsElement () {
    let source = sharedAssetsLibraryService.getSourcePath('images/search-no-result.png')

    return <div className='vcv-ui-editor-no-items-container'>
      <div className='vcv-ui-editor-no-items-content'>
        <img
          className='vcv-ui-editor-no-items-image'
          src={source}
          alt='Nothing Found'
        />
      </div>
      <div className='vcv-ui-editor-no-items-content'>
        <button className='vcv-ui-editor-no-items-action'>No Results. Open Visual Composer Hub</button>
      </div>
      <div className='vcv-ui-editor-no-items-content'>
        <p className='vcv-ui-form-helper'>
          Didn't find the right element? Check out Visual Composer Hub for more content elements.
        </p>
      </div>
    </div>
  }

  getElementControl (elementData) {
    return <ElementControl
      key={'vcv-element-control-' + elementData.tag}
      element={elementData}
      tag={elementData.tag}
      workspace={workspaceStorage.state('settings').get() || {}}
      name={elementData.name} />
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
      changeInput: this.changeInput
    }
  }

  getSearchElement () {
    let searchProps = this.getSearchProps()
    return <SearchElement {...searchProps} />
  }

  getSearchResults () {
    let { inputValue } = this.state
    let allCategories = this.getAllCategories()
    let getIndex = allCategories.findIndex((val) => {
      return val.title === 'All'
    })

    return allCategories[ getIndex ].elements.filter((elementData) => {
      let elName = elementData.name.toLowerCase()
      return elName.indexOf(inputValue.trim()) !== -1
    }).map((elementData) => {
      return this.getElementControl(elementData)
    })
  }

  getElementsByCategory () {
    let { activeCategoryIndex } = this.state
    let allCategories = this.getAllCategories()

    return allCategories && allCategories[ activeCategoryIndex ] && allCategories[ activeCategoryIndex ].elements ? allCategories[ activeCategoryIndex ].elements.map((tag) => {
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

  render () {
    let itemsOutput = this.isSearching() ? this.getSearchResults() : this.getElementsByCategory()
    let innerSectionClasses = classNames({
      'vcv-ui-tree-content-section-inner': true,
      'vcv-ui-state--centered-content': !itemsOutput.length
    })
    let listCtaClasses = classNames({
      'vcv-ui-editor-list-cta-wrapper': true,
      'vcv-ui-state--hidden': itemsOutput && !itemsOutput.length
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
            <div className={listCtaClasses}>
              <button
                className='vcv-ui-editor-no-items-action vcv-ui-editor-button-disabled'
                disabled
                onClick={this.handleGoToHub}
              >
                Premium Elements - Coming Soon
              </button>
            </div>
          </div>
        </Scrollbar>
      </div>
    </div>
  }
}
