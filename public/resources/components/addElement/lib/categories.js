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
const hubElementsStorage = vcCake.getStorage('hubElements')
const cook = vcCake.getService('cook')

export default class Categories extends React.Component {
  static propTypes = {
    parent: React.PropTypes.object
  }

  static allElements = []
  static allCategories = []
  static allElementsTags = []

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
    this.reset = this.reset.bind(this)
    if (vcCake.env('HUB_TEASER_ELEMENT_DOWNLOAD')) {
      hubElementsStorage.state('elements').onChange(this.reset)
    }
  }

  reset () {
    Categories.allCategories = []
    Categories.allElements = []
    Categories.allElementsTags = []

    vcCake.getService('hubCategories').getSortedElements.cache.clear()
  }

  getAllElements () {
    const { parent } = this.props
    let relatedTo = [ 'General', 'RootElements' ]
    if (parent && parent.tag) {
      const parentElement = cook.get(parent)
      if (parentElement) {
        relatedTo = parentElement.containerFor()
      }
    }
    if (!Categories.allElements.length) {
      let allElements = categoriesService.getSortedElements()
      Categories.allElements = allElements.filter((elementData) => {
        let cookElement = cook.get(elementData)
        return cookElement ? cookElement.relatedTo(relatedTo) : false
      })
    }

    return Categories.allElements
  }

  getAllElementsTags () {
    if (!Categories.allElementsTags.length) {
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
    if (!Categories.allCategories.length) {
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
      inputValue: value
    })
  }

  getNoResultsElement () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    // const noResultsButtonText = localizations ? localizations.noResultOpenHub : 'No Results. Open Visual Composer Hub'
    // const notRightElementText = localizations ? localizations.notRightElementsFound : 'Didn\'t find the right element? Check out Visual Composer Hub for more content elements.'
    const nothingFoundText = localizations ? localizations.nothingFound : 'Nothing Found'
    const buttonText = localizations ? localizations.premiumElementsButton : 'Premium Elements - Coming Soon'
    const helperText = localizations ? localizations.blankPageHelperText : 'Visual Composer Hub will offer you unlimited downloads of premium quality templates, elements, extensions and more.'

    let source = sharedAssetsLibraryService.getSourcePath('images/search-no-result.png')

    let buttonUrl = window.VCV_UTM().feAddElementSearchPremiumVersion
    if (vcCake.env('editor') === 'backend') {
      buttonUrl = window.VCV_UTM().beAddElementSearchPremiumVersion
    }

    // return <div className='vcv-ui-editor-no-items-container'>
    //   <div className='vcv-ui-editor-no-items-content'>
    //     <img
    //       className='vcv-ui-editor-no-items-image'
    //       src={source}
    //       alt={nothingFoundText}
    //     />
    //   </div>
    //   <div className='vcv-ui-editor-no-items-content'>
    //     <button className='vcv-ui-editor-no-items-action'>{noResultsButtonText}</button>
    //   </div>
    //   <div className='vcv-ui-editor-no-items-content'>
    //     <p className='vcv-ui-form-helper'>{notRightElementText}</p>
    //   </div>
    // </div>
    let premium = null
    if (typeof window.vcvIsPremium !== 'undefined' && !window.vcvIsPremium) {
      premium = (<div>
        <div className='vcv-ui-editor-no-items-content'>
          <a href={buttonUrl} target='_blank' className='vcv-start-blank-button' disabled>{buttonText}</a>
        </div>
        <div className='vcv-ui-editor-no-items-content'>
          <p className='vcv-start-blank-helper'>{helperText}</p>
        </div>
      </div>)
    }
    return <div className='vcv-ui-editor-no-items-container'>
      <div className='vcv-ui-editor-no-items-content'>
        <img
          className='vcv-ui-editor-no-items-image'
          src={source}
          alt={nothingFoundText}
        />
      </div>
      {premium}
    </div>
  }

  getElementControl (elementData) {
    const element = cook.get(elementData)
    return <ElementControl
      key={'vcv-element-control-' + element.get('tag')}
      element={elementData}
      tag={element.get('tag')}
      workspace={workspaceStorage.state('settings').get() || {}}
      name={element.get('name')} />
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
    // const localizations = window.VCV_I18N && window.VCV_I18N()
    // const buttonText = localizations ? localizations.premiumElementsButton : 'Premium Elements - Coming Soon'

    let itemsOutput = this.isSearching() ? this.getSearchResults() : this.getElementsByCategory()
    let innerSectionClasses = classNames({
      'vcv-ui-tree-content-section-inner': true,
      'vcv-ui-state--centered-content': !itemsOutput.length
    })
    // let listCtaClasses = classNames({
    //   'vcv-ui-editor-list-cta-wrapper': true,
    //   'vcv-ui-state--hidden': itemsOutput && !itemsOutput.length
    // })
    // return <div className='vcv-ui-tree-content'>
    //   {this.getSearchElement()}
    //   <div className='vcv-ui-tree-content-section'>
    //     <Scrollbar>
    //       <div className={innerSectionClasses}>
    //         <div className='vcv-ui-editor-plates-container'>
    //           <div className='vcv-ui-editor-plates'>
    //             <div className='vcv-ui-editor-plate vcv-ui-state--active'>
    //               {this.getElementListContainer(itemsOutput)}
    //             </div>
    //           </div>
    //         </div>
    //         <div className={listCtaClasses}>
    //           <button
    //             className='vcv-ui-editor-no-items-action vcv-ui-editor-button-disabled'
    //             disabled
    //             onClick={this.handleGoToHub}
    //           >
    //             {buttonText}
    //           </button>
    //         </div>
    //       </div>
    //     </Scrollbar>
    //   </div>
    // </div>
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
          </div>
        </Scrollbar>
      </div>
    </div>
  }
}
