import React from 'react'
import classNames from 'classnames'
import TeaserElementControl from './teaserElementControl'
import AddElementCategories from '../../addElement/lib/categories'
import Scrollbar from '../../../scrollbar/scrollbar.js'
import vcCake from 'vc-cake'
import lodash from 'lodash'

const sharedAssetsLibraryService = vcCake.getService('sharedAssetsLibrary')
const workspaceStorage = vcCake.getStorage('workspace')
const dataProcessor = vcCake.getService('dataProcessor')

export default class TeaserAddElementCategories extends AddElementCategories {
  allCategories = null
  ajaxRequests = []
  ajaxCall = false

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

  startDownload (key, data, successCallback, errorCallback) {
    this.ajaxRequests.push({ key: key, data: data, successCallback: successCallback, errorCallback: errorCallback, cancelled: false })
    this.nextDownload()

    return true
  }

  cancelDownload (key) {
    this.ajaxRequests = this.ajaxRequests.map((i) => {
      if (i.key === key) {
        i.cancelled = true
      }
      return i
    })
  }

  nextDownload () {
    if (this.ajaxRequests.length === 0) {
      return
    }
    if (this.ajaxCall) {
      return
    }

    let req = this.ajaxRequests[ 0 ]
    this.ajaxCall = true
    dataProcessor.appAdminServerRequest(req.data).then(
      (response) => {
        req.successCallback && req.successCallback(response, req.cancelled)
        this.ajaxCall = false
        this.ajaxRequests.splice(0, 1)
        this.nextDownload()
      },
      (response) => {
        req.errorCallback && req.errorCallback(response, req.cancelled)
        this.ajaxCall = false
        this.ajaxRequests.splice(0, 1)
        this.nextDownload()
      }
    )
  }

  getElementControl (elementData) {
    // TODO: Finish element control actions custom and without COOK!
    let tag = elementData.tag ? elementData.tag : elementData.name
    tag = tag.charAt(0).toLowerCase() + tag.substr(1, tag.length - 1)
    return <TeaserElementControl
      key={'vcv-element-control-' + tag}
      element={elementData}
      tag={tag}
      workspace={workspaceStorage.state('settings').get() || {}}
      startDownload={this.startDownload.bind(this)}
      cancelDownload={this.cancelDownload.bind(this)}
      type={elementData.type ? elementData.type : 'element'}
      name={elementData.name} />
  }

  getNoResultsElement () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const nothingFoundText = localizations ? localizations.nothingFound : 'Nothing Found'

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

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()

    let itemsOutput = this.isSearching() ? this.getSearchResults() : this.getElementsByCategory()
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
