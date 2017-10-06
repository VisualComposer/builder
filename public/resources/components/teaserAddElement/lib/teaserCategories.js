import React from 'react'
import classNames from 'classnames'
import TeaserElementControl from './teaserElementControl'
import AddElementCategories from '../../addElement/lib/categories'
import Scrollbar from '../../../scrollbar/scrollbar.js'
import vcCake from 'vc-cake'
import lodash from 'lodash'

const sharedAssetsLibraryService = vcCake.getService('sharedAssetsLibrary')
const workspaceStorage = vcCake.getStorage('workspace')

export default class TeaserAddElementCategories extends AddElementCategories {
  allCategories = null

  getAllCategories () {
    if (!this.allCategories) {
      let categories = window.VCV_HUB_GET_TEASER()
      categories.forEach((item, index) => {
        let elements = lodash.sortBy(item.elements, ['name'])
        categories[index].elements = elements
      })
      this.allCategories = categories
    }

    return this.allCategories
  }

  getElementControl (elementData) {
    // TODO: Finish element control actions custom and without COOK!
    return <TeaserElementControl
      key={'vcv-element-control-' + elementData.tag}
      element={elementData}
      tag={elementData.tag}
      workspace={workspaceStorage.state('settings').get() || {}}
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
