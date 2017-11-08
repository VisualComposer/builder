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
      let categories = window.VCV_HUB_GET_TEASER()
      categories.forEach((item, index) => {
        let elements = lodash.sortBy(item.elements, [ 'name' ])
        elements = elements.map((element) => {
          let tag = element.tag
          element.tag = tag.charAt(0).toLowerCase() + tag.substr(1, tag.length - 1)

          return element
        })
        categories[ index ].elements = elements
      })
      this.allCategories = categories
    }

    return this.allCategories
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

    let req = this.ajaxRequests[0]
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
    let tag = elementData.tag
    tag = tag.charAt(0).toLowerCase() + tag.substr(1, tag.length - 1)
    return <TeaserElementControl
      key={'vcv-element-control-' + tag}
      element={elementData}
      tag={tag}
      workspace={workspaceStorage.state('settings').get() || {}}
      startDownload={this.startDownload.bind(this)}
      cancelDownload={this.cancelDownload.bind(this)}
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

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()

    let itemsOutput = this.isSearching() ? this.getSearchResults() : this.getElementsByCategory()
    let innerSectionClasses = classNames({
      'vcv-ui-tree-content-section-inner': true,
      'vcv-ui-state--centered-content': !itemsOutput.length
    })
    const buttonText = localizations ? localizations.premiumElementsButton : 'Premium Version - Coming Soon'
    const helperText = localizations ? localizations.blankPageHelperText : 'Visual Composer Hub will offer you unlimited downloads of premium quality templates, elements, extensions and more.'

    let buttonUrl = window.VCV_UTM().feHubTeaserPremiumVersion
    if (vcCake.env('editor') === 'backend') {
      buttonUrl = window.VCV_UTM().beHubTeaserPremiumVersion
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
                    <div className='vcv-ui-editor-no-items-container'>
                      <div className='vcv-ui-editor-no-items-content'>
                        <a href={buttonUrl} target='_blank' className='vcv-start-blank-button' disabled>{buttonText}</a>
                      </div>
                      <div className='vcv-ui-editor-no-items-content'>
                        <p className='vcv-start-blank-helper'>{helperText}</p>
                      </div>
                    </div>
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
