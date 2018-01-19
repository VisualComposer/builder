import React from 'react'
import classNames from 'classnames'
import TeaserElementControl from './teaserElementControl'
import AddElementCategories from '../../addElement/lib/categories'
import Scrollbar from '../../../scrollbar/scrollbar.js'
import SearchElement from '../../addElement/lib/searchElement'
import vcCake from 'vc-cake'
import lodash from 'lodash'

const sharedAssetsLibraryService = vcCake.getService('sharedAssetsLibrary')
const workspaceStorage = vcCake.getStorage('workspace')

export default class TeaserAddElementCategories extends AddElementCategories {
  allCategories = null

  getAllCategories () {
    if (!this.allCategories) {
      const elementGroup = this.getElementGroup()
      const templateGroup = this.getTemplateGroup()
      const allGroup = this.getAllGroup([ elementGroup, templateGroup ])

      if (vcCake.env('TEASER_DROPDOWN_UPDATE')) {
        this.allCategories = [ allGroup, elementGroup, templateGroup ]
      } else {
        this.allCategories = elementGroup.categories
      }
    }
    return this.allCategories
  }

  getAllGroup (otherGroups) {
    let elements = []

    otherGroups.forEach((group) => {
      const groupAllElements = group.categories && group.categories[ 0 ] ? group.categories[ 0 ].elements : group.elements
      if (groupAllElements) {
        elements.push(...groupAllElements)
      }
    })
    return { elements: elements, id: 'All0', index: 0, title: 'All' }
  }

  getElementGroup () {
    let elementCategories = window.VCV_HUB_GET_TEASER()
    elementCategories.forEach((item, index) => {
      let elements = lodash.sortBy(item.elements, [ 'name' ])
      elements = elements.map((element) => {
        let tag = element.tag
        element.tag = tag.charAt(0).toLowerCase() + tag.substr(1, tag.length - 1)

        return element
      })
      elementCategories[ index ].elements = elements
    })
    return { categories: elementCategories, id: 'Elements1', index: 1, title: 'Elements' }
  }

  getTemplateGroup () {
    // TODO get and sort template elements from backend
    let elements = window.VCV_HUB_GET_TEMPLATES_TEASER()
    return { elements: elements, id: 'Templates2', index: 2, title: 'Templates' }
  }

  getElementControl (elementData) {
    let tag = elementData.tag ? elementData.tag : elementData.name
    tag = tag.charAt(0).toLowerCase() + tag.substr(1, tag.length - 1)

    return <TeaserElementControl
      key={'vcv-element-control-' + tag}
      element={elementData}
      tag={tag}
      workspace={workspaceStorage.state('settings').get() || {}}
      type={elementData.type ? elementData.type : 'element'}
      update={elementData.update ? elementData.update : false}
      name={elementData.name} />
  }

  getNoResultsElement () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const nothingFoundText = localizations ? localizations.nothingFound : 'Nothing found'

    let source = sharedAssetsLibraryService.getSourcePath('images/search-no-result.png')

    return <div className='vcv-ui-editor-no-items-container'>
      <div className='vcv-ui-editor-no-items-content'>
        <img
          className='vcv-ui-editor-no-items-image'
          src={source}
          alt={nothingFoundText}
        />
      </div>
    </div>
  }

  getElementsByCategory () {
    let { activeCategoryIndex } = this.state
    let allCategories = this.getAllCategories()
    let elements = []

    if (activeCategoryIndex.indexOf && activeCategoryIndex.indexOf('-') > -1) {
      const index = activeCategoryIndex.split('-')
      const group = allCategories[ index[ 0 ] ]
      const category = group && group.categories && group.categories[ index[ 1 ] ]

      elements = category ? category.elements : []
    } else {
      elements = allCategories && allCategories[ activeCategoryIndex ] && allCategories[ activeCategoryIndex ].elements
    }

    return elements ? elements.map((tag) => { return this.getElementControl(tag) }) : []
  }

  getSearchProps () {
    if (vcCake.env('HUB_REDESIGN')) {
      return {
        allCategories: this.getAllCategories(),
        index: this.state.activeCategoryIndex,
        changeActive: this.changeActiveCategory,
        changeTerm: this.changeSearchState,
        changeInput: this.changeInput,
        inputPlaceholder: 'elements and templates',
        activeFilter: this.state.filterId,
        selectEvent: (active) => {
          let activeId = active && active.constructor === String && active.split('-')[ 0 ]
          let result = this.state
          switch (activeId) {
            case '0':
              result.filterType = 'all'
              this.setState(result)
              break
            case '1':
              result.filterType = 'element'
              this.setState(result)
              break
            case '2':
              result.filterType = 'template'
              this.setState(result)
              break
            default:
              console.warn('There was an issue filtering data!')
          }
        }
      }
    }

    return {
      allCategories: this.getAllCategories(),
      index: this.state.activeCategoryIndex,
      changeActive: this.changeActiveCategory,
      changeTerm: this.changeSearchState,
      changeInput: this.changeInput,
      inputPlaceholder: 'elements and templates'
    }
  }

  getSearchElement () {
    let searchProps = this.getSearchProps()
    return <SearchElement {...searchProps} />
  }

  setFilterType (value, id) {
    let data = this.state
    data.filterType = value
    data.activeCategoryIndex = id
    this.setState(data)
  }

  activeFilterButton (value) {
    return 'vcv-ui-form-button' + (value === this.state.filterType ? ' vcv-ui-form-button--active' : '')
  }

  filterResult () {
    let result = this.isSearching() ? this.getSearchResults() : this.getElementsByCategory()
    result = result.filter((item) => {
      if (this.state.filterType === 'all') {
        return true
      } else {
        return item.props.type === this.state.filterType
      }
    })
    return result
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()

    let itemsOutput = null
    if (vcCake.env('HUB_REDESIGN')) {
      itemsOutput = this.filterResult()
    } else {
      itemsOutput = this.isSearching() ? this.getSearchResults() : this.getElementsByCategory()
    }
    let innerSectionClasses = classNames({
      'vcv-ui-tree-content-section-inner': true,
      'vcv-ui-state--centered-content': !itemsOutput.length
    })
    const buttonText = localizations ? localizations.premiumHubButton : 'Go Premium'
    const helperText = localizations ? localizations.hubHelperText : 'Get a Premium license to access Visual Composer Hub. Download professionally designed templates, more content elements, extensions, and more'

    let buttonUrl = window.VCV_UTM().feHubTeaserPremiumVersion
    if (vcCake.env('editor') === 'backend') {
      buttonUrl = window.VCV_UTM().beHubTeaserPremiumVersion
    }
    let premium = null
    if (typeof window.vcvIsPremium !== 'undefined' && !window.vcvIsPremium) {
      premium = (<div className='vcv-ui-editor-no-items-container'>
        <div className='vcv-ui-editor-no-items-content'>
          <a href={buttonUrl} target='_blank' className='vcv-start-blank-button' disabled>{buttonText}</a>
        </div>
        <div className='vcv-ui-editor-no-items-content'>
          <p className='vcv-start-blank-helper'>{helperText}</p>
        </div>
      </div>)
    }
    if (vcCake.env('HUB_REDESIGN')) {
      return (
        <div className='vcv-ui-tree-content'>
          {this.getSearchElement()}
          <div className='vcv-ui-tree-content-section'>
            <Scrollbar>
              <div className={innerSectionClasses}>
                <div className='vcv-ui-hub-control-container'>
                  <div className='vcv-ui-form-buttons-group vcv-ui-form-button-group--large'>
                    <button type='button' className={this.activeFilterButton('all')} onClick={() => this.setFilterType('all', '0')}>All</button>
                    <button type='button' className={this.activeFilterButton('element')} onClick={() => this.setFilterType('element', '1-0')}>Elements</button>
                    <button type='button' className={this.activeFilterButton('template')} onClick={() => this.setFilterType('template', '2')}>Templates</button>
                  </div>
                </div>
                <div className='vcv-ui-editor-plates-container vcv-ui-editor-plate--teaser'>
                  <div className='vcv-ui-editor-plates'>
                    <div className='vcv-ui-editor-plate vcv-ui-state--active'>
                      {this.getElementListContainer(itemsOutput)}
                      {premium}
                    </div>
                  </div>
                </div>
              </div>
            </Scrollbar>
          </div>
        </div>
      )
    }
    return (
      <div className='vcv-ui-tree-content'>
        {this.getSearchElement()}
        <div className='vcv-ui-tree-content-section'>
          <Scrollbar>
            <div className={innerSectionClasses}>
              <div className='vcv-ui-editor-plates-container vcv-ui-editor-plate--teaser'>
                <div className='vcv-ui-editor-plates'>
                  <div className='vcv-ui-editor-plate vcv-ui-state--active'>
                    {this.getElementListContainer(itemsOutput)}
                    {premium}
                  </div>
                </div>
              </div>
            </div>
          </Scrollbar>
        </div>
      </div>
    )
  }
}
