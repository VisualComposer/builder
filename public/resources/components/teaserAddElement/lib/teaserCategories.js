import React from 'react'
import classNames from 'classnames'
import TeaserElementControl from './teaserElementControl'
import AddElementCategories from '../../addElement/lib/categories'
import Scrollbar from '../../../scrollbar/scrollbar.js'
import vcCake from 'vc-cake'

const sharedAssetsLibraryService = vcCake.getService('sharedAssetsLibrary')
const workspaceStorage = vcCake.getStorage('workspace')

export default class TeaserAddElementCategories extends AddElementCategories {
  getAllCategories () {
    // TODO: Finish this part
    // foreach($data as $key => $category) {
    //   if(isset($category['elements'])) {
    //     foreach($category['elements'] as $ekey => $element) {
    //       if(!in_array($element['tag'], $toAdd)) {
    //         unset($data[$key]['elements'][$ekey]);
    //       } else {
    //         $newElement = [
    //           'tag'=>$element['tag'],
    //           'name'=>$element['name'],
    //           'metaThumbnailUrl'=>$element['metaThumbnailUrl'],
    //           'metaPreviewUrl'=>$element['metaPreviewUrl'],
    //           'metaDescription'=>$element['metaDescription'],
    //       ];
    //         $data[$key]['elements'][$ekey] = $newElement;
    //       }
    //     }
    //     $data[$key]['elements'] = array_values($data[$key]['elements']);
    //     if($category['id'] !== 'All0' && empty($data[$key]['elements'])) {
    //       unset($data[$key]);
    //     }
    //   }
    // }
    //
    // echo json_encode(array_values($data));
    return [
      {
        'id': 'All0',
        'index': 0,
        'title': 'All',
        'elements': [
          {
            'tag': '3dButton',
            'name': '3D Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/3dButton/3dButton/public/thumbnail-3d-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/3dButton/3dButton/public/preview-3d-button.png',
            'metaDescription': 'A 3D style button with the ability to control a hover and animation states.'
          }, {
            'tag': 'animatedIconButton',
            'name': 'Animated Icon Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/animatedIconButton/animatedIconButton/public/thumbnail-animated-icon-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/animatedIconButton/animatedIconButton/public/preview-animated-icon-button.png',
            'metaDescription': 'An icon button with animation effect and button text display on hover.'
          }, {
            'tag': 'animatedOutlineButton',
            'name': 'Animated Outline Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/animatedOutlineButton/animatedOutlineButton/public/thumbnail-animated-outline-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/animatedOutlineButton/animatedOutlineButton/public/preview-animated-outline-button.png',
            'metaDescription': 'Outline button with an animation effect that wraps around button text.'
          }, {
            'tag': 'animatedShadowButton',
            'name': 'Animated Shadow Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/animatedShadowButton/animatedShadowButton/public/thumbnail-animated-shadow-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/animatedShadowButton/animatedShadowButton/public/preview-animated-shadow-button.png',
            'metaDescription': 'A button with centered shadow effect and animation.'
          }, {
            'tag': 'animatedTwoColorButton',
            'name': 'Animated Two Color Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/animatedTwoColorButton/animatedTwoColorButton/public/thumbnail-animated-two-color-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/animatedTwoColorButton/animatedTwoColorButton/public/preview-animated-two-color-button.png',
            'metaDescription': 'A modern animated button with two color intersection and smooth animation.'
          }, {
            'tag': 'borderHoverButton',
            'name': 'Border Hover Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/borderHoverButton/borderHoverButton/public/thumbnail-border-hover-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/borderHoverButton/borderHoverButton/public/preview-border-hover-button.png',
            'metaDescription': 'Button with border accent as a hover effect and ability to control border color.'
          }, {
            'tag': 'filledShadowButton',
            'name': 'Filled Shadow Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/filledShadowButton/filledShadowButton/public/thumbnail-filled-shadow-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/filledShadowButton/filledShadowButton/public/preview-filled-shadow-button.png',
            'metaDescription': 'A geometric style filled button with shadow effect and custom hover color controls.'
          }, {
            'tag': 'gatsbyButton',
            'name': 'Gatsby Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/gatsbyButton/gatsbyButton/public/thumbnail-gatsby-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/gatsbyButton/gatsbyButton/public/preview-gatsby-button.png',
            'metaDescription': 'A Gatsby style button with a misplaced outline and transparent fill color.'
          }, {
            'tag': 'halfOutlineButton',
            'name': 'Half Outline Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/halfOutlineButton/halfOutlineButton/public/thumbnail-half-outline-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/halfOutlineButton/halfOutlineButton/public/preview-half-outline-button.png',
            'metaDescription': 'Outline button with half outline, position and animation controls.'
          }, {
            'tag': 'outlineShadowButton',
            'name': 'Outline Shadow Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/outlineShadowButton/outlineShadowButton/public/thumbnail-outline-shadow-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/outlineShadowButton/outlineShadowButton/public/preview-outline-shadow-button.png',
            'metaDescription': 'A geometric style outline button with custom hover color option.'
          }, {
            'tag': 'parallelogramButton',
            'name': 'Parallelogram Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/parallelogramButton/parallelogramButton/public/thumbnail-parallelogram-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/parallelogramButton/parallelogramButton/public/preview-parallelogram-button.png',
            'metaDescription': 'A button in parallelogram shape with ability to control angle.'
          }, {
            'tag': 'quoteButton',
            'name': 'Quote Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/quoteButton/quoteButton/public/thumbnail-quote-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/quoteButton/quoteButton/public/preview-quote-button.png',
            'metaDescription': 'Quote button is a good call to action that points directly to the content.'
          }, {
            'tag': 'resizeButton',
            'name': 'Resize Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/resizeButton/resizeButton/public/thumbnail-resize-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/resizeButton/resizeButton/public/preview-resize-button.png',
            'metaDescription': 'A simple button that resizes with animation on hover to catch user attention.'
          }, {
            'tag': 'simpleGradientButton',
            'name': 'Simple Gradient Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/simpleGradientButton/simpleGradientButton/public/thumbnail-simple-gradient-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/simpleGradientButton/simpleGradientButton/public/preview-simple-gradient-button.png',
            'metaDescription': 'A simple gradient button with automatic gradient effect calculation.'
          }, {
            'tag': 'smoothShadowButton',
            'name': 'Smooth Shadow Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/smoothShadowButton/smoothShadowButton/public/thumbnail-smooth-shadow-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/smoothShadowButton/smoothShadowButton/public/preview-smooth-shadow-button.png',
            'metaDescription': 'A filled button with bold shadow smooth edges.'
          }, {
            'tag': 'strikethroughButton',
            'name': 'Strikethrough Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/strikethroughButton/strikethroughButton/public/thumbnail-strikethrough-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/strikethroughButton/strikethroughButton/public/preview-strikethrough-button.png',
            'metaDescription': 'A simple text button with animated strike through effect on hover.'
          }, {
            'tag': 'strikethroughOutlineButton',
            'name': 'Strikethrough Outline Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/strikethroughOutlineButton/strikethroughOutlineButton/public/thumbnail-strikethrough-outline-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/strikethroughOutlineButton/strikethroughOutlineButton/public/preview-strikethrough-outline-button.png',
            'metaDescription': 'Outline button with a horizontal or vertical strike through and fill color effect on hover.'
          }, {
            'tag': 'transparentOutlineButton',
            'name': 'Transparent Outline Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/transparentOutlineButton/transparentOutlineButton/public/thumbnail-transparent-outline-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/transparentOutlineButton/transparentOutlineButton/public/preview-transparent-outline-button.png',
            'metaDescription': 'Transparent outline button with fill color effect on hover is perfect for dark or colorful backgrounds.'
          }, {
            'tag': 'underlineButton',
            'name': 'Underline Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/underlineButton/underlineButton/public/thumbnail-underline-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/underlineButton/underlineButton/public/preview-underline-button.png',
            'metaDescription': 'A simple text button with underline and resize animation.'
          }, {
            'tag': 'zigZagButton',
            'name': 'ZigZag Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/zigZagButton/zigZagButton/public/thumbnail-zigzag-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/zigZagButton/zigZagButton/public/preview-zigzag-button.png',
            'metaDescription': 'A text based button with zig zag underline and custom hover color controls.'
          }],
        'isVisible': true
      }, {
        'id': 'Buttons1',
        'index': 1,
        'title': 'Buttons',
        'elements': [
          {
            'tag': '3dButton',
            'name': '3D Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/3dButton/3dButton/public/thumbnail-3d-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/3dButton/3dButton/public/preview-3d-button.png',
            'metaDescription': 'A 3D style button with the ability to control a hover and animation states.'
          }, {
            'tag': 'animatedIconButton',
            'name': 'Animated Icon Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/animatedIconButton/animatedIconButton/public/thumbnail-animated-icon-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/animatedIconButton/animatedIconButton/public/preview-animated-icon-button.png',
            'metaDescription': 'An icon button with animation effect and button text display on hover.'
          }, {
            'tag': 'animatedOutlineButton',
            'name': 'Animated Outline Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/animatedOutlineButton/animatedOutlineButton/public/thumbnail-animated-outline-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/animatedOutlineButton/animatedOutlineButton/public/preview-animated-outline-button.png',
            'metaDescription': 'Outline button with an animation effect that wraps around button text.'
          }, {
            'tag': 'animatedShadowButton',
            'name': 'Animated Shadow Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/animatedShadowButton/animatedShadowButton/public/thumbnail-animated-shadow-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/animatedShadowButton/animatedShadowButton/public/preview-animated-shadow-button.png',
            'metaDescription': 'A button with centered shadow effect and animation.'
          }, {
            'tag': 'animatedTwoColorButton',
            'name': 'Animated Two Color Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/animatedTwoColorButton/animatedTwoColorButton/public/thumbnail-animated-two-color-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/animatedTwoColorButton/animatedTwoColorButton/public/preview-animated-two-color-button.png',
            'metaDescription': 'A modern animated button with two color intersection and smooth animation.'
          }, {
            'tag': 'borderHoverButton',
            'name': 'Border Hover Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/borderHoverButton/borderHoverButton/public/thumbnail-border-hover-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/borderHoverButton/borderHoverButton/public/preview-border-hover-button.png',
            'metaDescription': 'Button with border accent as a hover effect and ability to control border color.'
          }, {
            'tag': 'filledShadowButton',
            'name': 'Filled Shadow Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/filledShadowButton/filledShadowButton/public/thumbnail-filled-shadow-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/filledShadowButton/filledShadowButton/public/preview-filled-shadow-button.png',
            'metaDescription': 'A geometric style filled button with shadow effect and custom hover color controls.'
          }, {
            'tag': 'gatsbyButton',
            'name': 'Gatsby Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/gatsbyButton/gatsbyButton/public/thumbnail-gatsby-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/gatsbyButton/gatsbyButton/public/preview-gatsby-button.png',
            'metaDescription': 'A Gatsby style button with a misplaced outline and transparent fill color.'
          }, {
            'tag': 'halfOutlineButton',
            'name': 'Half Outline Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/halfOutlineButton/halfOutlineButton/public/thumbnail-half-outline-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/halfOutlineButton/halfOutlineButton/public/preview-half-outline-button.png',
            'metaDescription': 'Outline button with half outline, position and animation controls.'
          }, {
            'tag': 'outlineShadowButton',
            'name': 'Outline Shadow Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/outlineShadowButton/outlineShadowButton/public/thumbnail-outline-shadow-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/outlineShadowButton/outlineShadowButton/public/preview-outline-shadow-button.png',
            'metaDescription': 'A geometric style outline button with custom hover color option.'
          }, {
            'tag': 'parallelogramButton',
            'name': 'Parallelogram Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/parallelogramButton/parallelogramButton/public/thumbnail-parallelogram-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/parallelogramButton/parallelogramButton/public/preview-parallelogram-button.png',
            'metaDescription': 'A button in parallelogram shape with ability to control angle.'
          }, {
            'tag': 'quoteButton',
            'name': 'Quote Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/quoteButton/quoteButton/public/thumbnail-quote-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/quoteButton/quoteButton/public/preview-quote-button.png',
            'metaDescription': 'Quote button is a good call to action that points directly to the content.'
          }, {
            'tag': 'resizeButton',
            'name': 'Resize Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/resizeButton/resizeButton/public/thumbnail-resize-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/resizeButton/resizeButton/public/preview-resize-button.png',
            'metaDescription': 'A simple button that resizes with animation on hover to catch user attention.'
          }, {
            'tag': 'simpleGradientButton',
            'name': 'Simple Gradient Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/simpleGradientButton/simpleGradientButton/public/thumbnail-simple-gradient-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/simpleGradientButton/simpleGradientButton/public/preview-simple-gradient-button.png',
            'metaDescription': 'A simple gradient button with automatic gradient effect calculation.'
          }, {
            'tag': 'smoothShadowButton',
            'name': 'Smooth Shadow Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/smoothShadowButton/smoothShadowButton/public/thumbnail-smooth-shadow-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/smoothShadowButton/smoothShadowButton/public/preview-smooth-shadow-button.png',
            'metaDescription': 'A filled button with bold shadow smooth edges.'
          }, {
            'tag': 'strikethroughButton',
            'name': 'Strikethrough Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/strikethroughButton/strikethroughButton/public/thumbnail-strikethrough-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/strikethroughButton/strikethroughButton/public/preview-strikethrough-button.png',
            'metaDescription': 'A simple text button with animated strike through effect on hover.'
          }, {
            'tag': 'strikethroughOutlineButton',
            'name': 'Strikethrough Outline Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/strikethroughOutlineButton/strikethroughOutlineButton/public/thumbnail-strikethrough-outline-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/strikethroughOutlineButton/strikethroughOutlineButton/public/preview-strikethrough-outline-button.png',
            'metaDescription': 'Outline button with a horizontal or vertical strike through and fill color effect on hover.'
          }, {
            'tag': 'transparentOutlineButton',
            'name': 'Transparent Outline Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/transparentOutlineButton/transparentOutlineButton/public/thumbnail-transparent-outline-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/transparentOutlineButton/transparentOutlineButton/public/preview-transparent-outline-button.png',
            'metaDescription': 'Transparent outline button with fill color effect on hover is perfect for dark or colorful backgrounds.'
          }, {
            'tag': 'underlineButton',
            'name': 'Underline Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/underlineButton/underlineButton/public/thumbnail-underline-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/underlineButton/underlineButton/public/preview-underline-button.png',
            'metaDescription': 'A simple text button with underline and resize animation.'
          }, {
            'tag': 'zigZagButton',
            'name': 'ZigZag Button',
            'metaThumbnailUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/zigZagButton/zigZagButton/public/thumbnail-zigzag-button.png',
            'metaPreviewUrl': 'http://vcwb.dev/wp-content/plugins/visualcomposer/devElements/zigZagButton/zigZagButton/public/preview-zigzag-button.png',
            'metaDescription': 'A text based button with zig zag underline and custom hover color controls.'
          }],
        'isVisible': true
      }]
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

    return <div className='vcv-ui-tree-content'>
      {this.getSearchElement()}
      <div className='vcv-ui-tree-content-section'>
        <Scrollbar>
          <div className={innerSectionClasses}>
            <div className='vcv-ui-editor-plates-container'>
              <div className='vcv-ui-editor-plates'>
                <div className='vcv-ui-editor-plate vcv-ui-state--active'>
                  {this.getElementListContainer(itemsOutput)}
                  <div className='vcv-ui-editor-no-items-container'>
                    <div className='vcv-ui-editor-no-items-content'>
                      <button className='vcv-start-blank-button' disabled>{buttonText}</button>
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
  }
}
