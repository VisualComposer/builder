import React from 'react'
import classNames from 'classnames'
import TeaserElementControl from './teaserElementControl'
import TeaserTypeControl from './teaserTypeControl'
import TeaserDropdown from './teaserDropdown'
import AddElementCategories from '../../addElement/lib/categories'
import Scrollbar from '../../../scrollbar/scrollbar.js'
import SearchElement from '../../addElement/lib/searchElement'
import vcCake from 'vc-cake'
import lodash from 'lodash'

const sharedAssetsLibraryService = vcCake.getService('sharedAssetsLibrary')
const workspaceStorage = vcCake.getStorage('workspace')

const categories = (() => {
  return {
    all: {
      index: 0,
      type: 'all',
      name: 'All'
    },
    element: {
      index: 1,
      subIndex: 0,
      type: 'element',
      name: 'Elements',
      bundleTypes: [
        'free', 'premium'
      ]
    },
    template: {
      index: 2,
      type: 'template',
      name: 'Templates',
      bundleTypes: [
        'free', 'premium'
      ]
    },
    addon: {
      index: 3,
      type: 'addon',
      name: 'Addons'
    },
    hubHeader: {
      index: 4,
      type: 'hubHeader',
      name: 'Headers',
      templateType: true
    },
    hubFooter: {
      index: 5,
      type: 'hubFooter',
      name: 'Footers',
      templateType: true
    },
    hubSidebar: {
      index: 6,
      type: 'hubSidebar',
      name: 'Sidebars',
      templateType: true
    }
  }
})()

export default class TeaserAddElementCategories extends AddElementCategories {
  static localizations = window.VCV_I18N && window.VCV_I18N()
  allCategories = null

  constructor (props) {
    super(props)
    this.setFilterType = this.setFilterType.bind(this)
  }

  getAllCategories () {
    if (!this.allCategories) {
      const elementGroup = this.getElementGroup()
      const templateGroup = this.getTemplateGroup()
      const addonsGroup = this.getAddonsGroup()
      const headerGroup = this.getHFSGroup(categories.hubHeader)
      const footerGroup = this.getHFSGroup(categories.hubFooter)
      const sidebarGroup = this.getHFSGroup(categories.hubSidebar)
      const allGroup = this.getAllGroup([ elementGroup, templateGroup, addonsGroup, headerGroup, footerGroup, sidebarGroup ])

      this.allCategories = [ allGroup, elementGroup, templateGroup, addonsGroup, headerGroup, footerGroup, sidebarGroup ]
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

  getAddonsGroup () {
    let addonsCategories = window.VCV_HUB_GET_ADDON_TEASER()
    return { elements: addonsCategories, id: 'Addons3', index: 3, title: 'Addons' }
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
    let elements = window.VCV_HUB_GET_TEMPLATES_TEASER().filter((element) => {
      return element.templateType === 'hub' || element.templateType === 'predefined'
    })
    return { elements: elements, id: 'Templates2', index: 2, title: 'Templates' }
  }

  getHFSGroup (category) {
    const { type, name } = category
    let index
    if (type === 'hubHeader') {
      index = 4
    } else if (type === 'hubFooter') {
      index = 5
    } else if (type === 'hubSidebar') {
      index = 6
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
    const nothingFoundText = TeaserAddElementCategories.localizations ? TeaserAddElementCategories.localizations.nothingFound : 'Nothing found'

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
      disableSelect: vcCake.env('FT_EDITOR_HUB_REDESIGN'),
      selectEvent: (active) => {
        let activeId = active && active.constructor === String && active.split('-')[ 0 ]
        let result = this.state
        let foundCategory = Object.values(categories).find(category => parseInt(activeId) === category.index)
        result.filterType = foundCategory.type
        this.setState(result)
      }
    }
  }

  getSearchElement () {
    let searchProps = this.getSearchProps()
    return <SearchElement {...searchProps} />
  }

  setFilterType (value, id, bundleType) {
    this.setState({
      filterType: value,
      activeCategoryIndex: id,
      bundleType: bundleType
    })
  }

  activeFilterButton (value) {
    return 'vcv-ui-form-button' + (value === this.state.filterType ? ' vcv-ui-form-button--active' : '')
  }

  filterResult () {
    const { filterType, bundleType } = this.state
    let result = this.isSearching() ? this.getFoundElements() : this.getElementsByCategory()
    result = result.filter((item) => {
      let isClean = false

      if (filterType === 'all') {
        isClean = true
      } else {
        if (categories[ filterType ].templateType) {
          isClean = item.props.type === 'template' && item.props.element.templateType === filterType
        } else {
          isClean = item.props.type === filterType
        }
      }

      // filter for bundle type
      const itemBundleType = item.props.element.bundleType

      // if bundleType is not set - do not show it on free/premium
      if (bundleType && (!item.props.element.bundleType || !item.props.element.bundleType.length)) {
        isClean = false
      }

      if (isClean && itemBundleType && itemBundleType.length && bundleType) {
        isClean = itemBundleType.indexOf(bundleType) > -1

        // remove item if item has also free bundle type, when premium is clicked
        if (bundleType === 'premium' && isClean) {
          isClean = itemBundleType.indexOf('free') < 0
        }
      }

      return isClean
    })
    return result
  }

  getTypeControlProps () {
    return {
      categories: categories,
      filterType: this.state.filterType,
      bundleType: this.state.bundleType,
      setFilterType: this.setFilterType
    }
  }

  getHubPanelControls () {
    return <TeaserTypeControl {...this.getTypeControlProps()} />
  }

  getHubBanner () {
    const titleText = TeaserAddElementCategories.localizations ?TeaserAddElementCategories.localizations.getMoreText : 'Get More Elements, Templates, and Extensions'
    const subtitleText = TeaserAddElementCategories.localizations ?TeaserAddElementCategories.localizations.downloadFromHubText : 'Download additional content from the Visual Composer Hub - right in your editor instantly.'
    const buttonText = TeaserAddElementCategories.localizations ?TeaserAddElementCategories.localizations.getStartedText : 'Get Started'
    return <div className='vcv-hub-banner'>
      <div className='vcv-hub-banner-content'>
        <p className='vcv-hub-banner-title'>{titleText}</p>
        <p className='vcv-hub-banner-subtitle'>{subtitleText}</p>
        <a className='vcv-hub-banner-button' href='#'>{buttonText}</a>
      </div>
    </div>
  }

  render () {
    let itemsOutput = this.filterResult()
    let innerSectionClasses = classNames({
      'vcv-ui-tree-content-section-inner': true,
      'vcv-ui-state--centered-content': !itemsOutput.length
    })
    const buttonText = TeaserAddElementCategories.localizations ? TeaserAddElementCategories.localizations.premiumHubButton : 'Go Premium'
    const helperText = TeaserAddElementCategories.localizations ? TeaserAddElementCategories.localizations.hubHelperText : 'Get a Premium license to access Visual Composer Hub. Download professionally designed templates, more content elements, extensions, and more'

    let buttonUrl = window.VCV_UTM().feHubTeaserPremiumVersion
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

    if (vcCake.env('FT_EDITOR_HUB_REDESIGN')) {
      return (
        <div className='vcv-ui-tree-view-content vcv-ui-teaser-add-element-content'>
          <div className='vcv-ui-tree-content'>
            {this.getSearchElement()}
            {this.getHubPanelControls()}
            <div className='vcv-ui-hub-dropdown-container'>
              <TeaserDropdown {...this.getTypeControlProps()} />
            </div>
            <div className='vcv-ui-tree-content-section'>
              <Scrollbar>
                <div className={innerSectionClasses}>
                  {this.getHubBanner()}
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
        </div>
      )
    } else {
      return (
        <div className='vcv-ui-tree-view-content vcv-ui-add-element-content'>
          <div className='vcv-ui-tree-content'>
            {this.getSearchElement()}
            <div className='vcv-ui-tree-content-section'>
              <Scrollbar>
                <div className={innerSectionClasses}>
                  {this.getHubPanelControls()}
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
        </div>
      )
    }
  }
}
