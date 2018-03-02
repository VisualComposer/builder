import React from 'react'
import classNames from 'classnames'
import TeaserElementControl from './teaserElementControl'
import TeaserTypeControl from './teaserTypeControl'
import AddElementCategories from '../../addElement/lib/categories'
import Scrollbar from '../../../scrollbar/scrollbar.js'
import SearchElement from '../../addElement/lib/searchElement'
import vcCake from 'vc-cake'
import lodash from 'lodash'

const sharedAssetsLibraryService = vcCake.getService('sharedAssetsLibrary')
const workspaceStorage = vcCake.getStorage('workspace')

const categories = {
  all: {
    index: 0,
    type: 'all',
    name: 'All'
  },
  element: {
    index: 1,
    subIndex: 0,
    type: 'element',
    name: 'Elements'
  },
  template: {
    index: 2,
    type: 'template',
    name: 'Templates'
  },
  hubHeader: {
    index: 3,
    type: 'hubHeader',
    name: 'Headers',
    templateType: true
  },
  hubFooter: {
    index: 4,
    type: 'hubFooter',
    name: 'Footers',
    templateType: true
  },
  hubSidebar: {
    index: 5,
    type: 'hubSidebar',
    name: 'Sidebars',
    templateType: true
  }
}

export default class TeaserAddElementCategories extends AddElementCategories {
  allCategories = null

  constructor (props) {
    super(props)
    this.setFilterType = this.setFilterType.bind(this)
  }

  getAllCategories () {
    if (!this.allCategories) {
      const elementGroup = this.getElementGroup()
      const templateGroup = this.getTemplateGroup()
      const headerGroup = this.getHFSGroup(categories.hubHeader)
      const footerGroup = this.getHFSGroup(categories.hubFooter)
      const sidebarGroup = this.getHFSGroup(categories.hubSidebar)
      const allGroup = this.getAllGroup([ elementGroup, templateGroup, headerGroup, footerGroup, sidebarGroup ])
      if (vcCake.env('HUB_CONTROLS')) {
        this.allCategories = [ allGroup, elementGroup, templateGroup, headerGroup, footerGroup, sidebarGroup ]
      } else {
        this.allCategories = [ allGroup, elementGroup, templateGroup ]
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
    let elements = window.VCV_HUB_GET_TEMPLATES_TEASER().filter(element => element.templateType === 'hub')
    return { elements: elements, id: 'Templates2', index: 2, title: 'Templates' }
  }

  getHFSGroup (category) {
    const { type, name } = category
    let index
    if (type === 'hubHeader') {
      index = 3
    } else if (type === 'hubFooter') {
      index = 4
    } else if (type === 'hubSidebar') {
      index = 5
    }
    if (index) {
      let elements = window.VCV_HUB_GET_TEMPLATES_TEASER()
      elements = elements.filter(element => {
        return element.templateType === type
      })
      return { elements, id: `${name}${index}`, index, title: name }
    }
    return {}
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
      name={elementData.name}
      addElement={this.addElement}
    />
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
        if (vcCake.env('HUB_CONTROLS')) {
          let foundCategory = Object.values(categories).find(category => parseInt(activeId) === category.index)
          result.filterType = foundCategory.type
          this.setState(result)
        } else {
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
    let result = this.isSearching() ? this.getFoundElements() : this.getElementsByCategory()
    result = result.filter((item) => {
      if (this.state.filterType === 'all') {
        return true
      } else {
        if (vcCake.env('HUB_CONTROLS') && categories[ this.state.filterType ].templateType) {
          return item.props.type === 'template' && item.props.element.templateType === this.state.filterType
        }
        return item.props.type === this.state.filterType
      }
    })
    return result
  }

  getTypeControlProps () {
    return {
      categories: categories,
      filterType: this.state.filterType,
      setFilterType: this.setFilterType
    }
  }

  getHubPanelControls () {
    return <TeaserTypeControl {...this.getTypeControlProps()} />
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()

    let itemsOutput = this.filterResult()
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

    let controls = (
      <div className='vcv-ui-hub-control-container'>
        <div className='vcv-ui-form-buttons-group vcv-ui-form-button-group--large'>
          <button type='button' className={this.activeFilterButton('all')} onClick={() => this.setFilterType('all', '0')}>
            All
          </button>
          <button type='button' className={this.activeFilterButton('element')}
            onClick={() => this.setFilterType('element', '1-0')}>Elements
          </button>
          <button type='button' className={this.activeFilterButton('template')}
            onClick={() => this.setFilterType('template', '2')}>Templates
          </button>
        </div>
      </div>
    )

    if (vcCake.env('HUB_CONTROLS')) {
      controls = this.getHubPanelControls()
    }
    return (
      <div className='vcv-ui-tree-content'>
        {this.getSearchElement()}
        <div className='vcv-ui-tree-content-section'>
          <Scrollbar>
            <div className={innerSectionClasses}>
              {controls}
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
