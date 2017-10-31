<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Helper;

class Localizations extends Container implements Helper
{
    /**
     * @param $locale array
     *
     * @return array
     */
    public function getLocalizations()
    {
        $locale = [
            'addElement' => __('Add Element', 'vcwb'),
            'addPremiumElement' => __('Hub', 'vcwb'),
            'addTemplate' => __('Add Template', 'vcwb'),
            'treeView' => __('Tree View', 'vcwb'),
            'undo' => __('Undo', 'vcwb'),
            'redo' => __('Redo', 'vcwb'),
            'responsiveView' => __('Responsive View', 'vcwb'),
            'desktop' => __('Desktop', 'vcwb'),
            'tabletLandscape' => __('Tablet Landscape', 'vcwb'),
            'tabletPortrait' => __('Tablet Portrait', 'vcwb'),
            'mobileLandscape' => __('Mobile Landscape', 'vcwb'),
            'mobilePortrait' => __('Mobile Portrait', 'vcwb'),
            'settings' => __('Settings', 'vcwb'),
            'update' => __('Update', 'vcwb'),
            'menu' => __('Menu', 'vcwb'),
            'viewPage' => __('View Page', 'vcwb'),
            'editInBackendEditor' => __('Edit in Backend Editor', 'vcwb'),
            'wordPressDashboard' => __('WordPress Dashboard', 'vcwb'),
            'publish' => __('Publish', 'vcwb'),
            'submitForReview' => __('Submit for Review', 'vcwb'),
            'saveDraft' => __('Save Draft', 'vcwb'),
            'goPremium' => __('Go Premium', 'vcwb'),
            'close' => __('Close', 'vcwb'),
            'premiumElementsButton' => __('Premium Version - Coming Soon', 'vcwb'),
            'premiumTemplatesButton' => __('Premium Templates - Coming Soon', 'vcwb'),
            // @codingStandardsIgnoreLine
            'emptyTreeView' => __('There are no elements on your canvas - start by adding element or template.', 'vcwb'),
            'customCSS' => __('Custom CSS', 'vcwb'),
            'localCSS' => __('Local CSS', 'vcwb'),
            'localCSSLabel' => __('Local CSS will be applied to this particular page only', 'vcwb'),
            'globalCSS' => __('Global CSS', 'vcwb'),
            'globalCSSLabel' => __('Global CSS will be applied site wide', 'vcwb'),
            'customJS' => __('Custom JavaScript', 'vcwb'),
            'localJS' => __('Local JavaScript', 'vcwb'),
            'localJSLabel' => __('Local JavaScript will be applied to this particular page only', 'vcwb'),
            'globalJS' => __('Global JavaScript', 'vcwb'),
            'globalJSLabel' => __('Global JavaScript will be applied site wide', 'vcwb'),
            'save' => __('Save', 'vcwb'),
            'templateName' => __('Template Name', 'vcwb'),
            'saveTemplate' => __('Save Template', 'vcwb'),
            'removeTemplate' => __('Remove Template', 'vcwb'),
            'templateSaveFailed' => __('Template save failed.', 'vcwb'),
            'downloadMoreTemplates' => __('Download More Templates', 'vcwb'),
            'noTemplatesFound' => __(
            // @codingStandardsIgnoreLine
                'You don\'t have any templates yet. Try to save your current layout as a template or download templates from Visual Composer Hub.',
                'vcwb'
            ),
            'notRightTemplatesFound' => __(
                'Didn\'t find the right template? Check out Visual Composer Hub for more layout templates.',
                'vcwb'
            ),
            'removeTemplateWarning' => __('Do you want to remove this template?', 'vcwb'),
            'templateRemoveFailed' => __('Template remove failed.', 'vcwb'),
            'blankPageHeadingPart1' => __('Select Blank Canvas', 'vcwb'),
            'blankPageHeadingPart2' => __('or Start With a Template', 'vcwb'),
            'blankPageHelperText' => __(
            // @codingStandardsIgnoreLine
                'Visual Composer Hub will offer you unlimited downloads of premium quality templates, elements, extensions and more.',
                'vcwb'
            ),
            'add' => __('Add', 'vcwb'),
            'rowLayout' => __('Row Layout', 'vcwb'),
            'edit' => __('Edit', 'vcwb'),
            'designOptions' => __('Design Options', 'vcwb'),
            'clone' => __('Clone', 'vcwb'),
            'copy' => __('Copy', 'vcwb'),
            'paste' => __('Paste', 'vcwb'),
            'remove' => __('Remove', 'vcwb'),
            'move' => __('Move', 'vcwb'),
            'searchContentElements' => __('Search content elements', 'vcwb'),
            // @codingStandardsIgnoreLine
            'templateAlreadyExists' => __(
                'Template with this name already exist. Please specify another name.',
                'vcwb'
            ),
            'templateContentEmpty' => __('Template content is empty.', 'vcwb'),
            'specifyTemplateName' => __('Please specify template name.', 'vcwb'),
            'addOneColumn' => __('Add one column', 'vcwb'),
            'addTwoColumns' => __('Add two columns', 'vcwb'),
            'addThreeColumns' => __('Add three columns', 'vcwb'),
            'addFourColumns' => __('Add four columns', 'vcwb'),
            'addFiveColumns' => __('Add five columns', 'vcwb'),
            'addCustomRowLayout' => __('Add custom row layout', 'vcwb'),
            'addTextBlock' => __('Add Text block', 'vcwb'),
            'frontendEditor' => __('Frontend Editor', 'vcwb'),
            'backendEditor' => __('Backend Editor', 'vcwb'),
            'classicEditor' => __('Classic Editor', 'vcwb'),
            'enableBackendEditorConfirmMessage' => __('Visual Composer will overwrite your content created in WordPress Classic editor with the latest version of content created in Visual Composer Website Builder. Do you want to continue?', 'vcwb'),
            'blankPage' => __('Blank Page', 'vcwb'),
            'searchTemplates' => __('Search templates by name and description', 'vcwb'),
            'noResultOpenHub' => __('No Results. Open Visual Composer Hub', 'vcwb'),
            'notRightElementsFound' => __(
                'Didn\'t find the right element? Check out Visual Composer Hub for more content elements.',
                'vcwb'
            ),
            'readAndAgreeTerms' => __(
            // @codingStandardsIgnoreLine
                'Please make sure to read and agree to our terms of service in order to activate and use Visual Composer Website Builder.',
                'vcwb'
            ),
            'incorrectEmailFormat' => __(
            // @codingStandardsIgnoreLine
                'Your activation request failed due to the e-mail address format. Please check your e-mail address and try again.',
                'vcwb'
            ),
            'mustAgreeToActivate' => __(
                'To activate and use Visual Composer Website Builder, you must read and agree to the terms of service.',
                'vcwb'
            ),
            'activationFailed' => __('Your activation request failed. Please try again.', 'vcwb'),
            'provideCorrectEmail' => __('Please provide correct E-Mail', 'vcwb'),
            'nothingFound' => __('Nothing Found', 'vcwb'),
            'templateThumbnail' => __('Template thumbnail', 'vcwb'),
            'templatePreview' => __('Template preview', 'vcwb'),
            'addImage' => __('Add Image', 'vcwb'),
            'removeImage' => __('Remove Image', 'vcwb'),
            'moveImage' => __('Move Image', 'vcwb'),
            'editReplaceImage' => __('Edit or Replace Image', 'vcwb'),
            'addLink' => __('Add Link', 'vcwb'),
            'selectUrl' => __('Select URL', 'vcwb'),
            'insertEditLink' => __('Insert or Edit Link', 'vcwb'),
            'urlInputPlaceholder' => __('Enter the destination URL', 'vcwb'),
            'linkToExistingContent' => __('Or link to existing content', 'vcwb'),
            'searchExistingContent' => __('Search existing content', 'vcwb'),
            'noExistingContentFound' => __('There is no content with such term found.', 'vcwb'),
            'openLinkInTab' => __('Open link in a new tab', 'vcwb'),
            'addNofollow' => __('Add nofollow option to link', 'vcwb'),
            'enterDestinationUrl' => __('Enter the destination URL', 'vcwb'),
            'titleAttributeText' => __('Title attribute will be displayed on link hover', 'vcwb'),
            'title' => __('Title', 'vcwb'),
            'bundleUpdateFailed' => __('Visual Composer Cloud update failed, please try again.', 'vcwb'),
            'preview' => __('Preview', 'vcwb'),
            'previewChanges' => __('Preview Changes', 'vcwb'),
            'savingResults' => __('Saving Results', 'vcwb'),
            'hideOff' => __('Hide: Off', 'vcwb'),
            'hideOn' => __('Hide: On', 'vcwb'),
            'downloadingInitialExtensions' => __('Downloading initial extensions', 'vcwb'),
            'downloadingAssets' => __('Downloading assets {i} of {cnt}: {name}', 'vcwb'),
            'postUpdateText' => __('Updating posts {i} in {cnt}: {name}', 'vcwb'),
            'postUpdateAjaxRequestError' => __('Downloading file for posts updates is failed. File: {file}', 'vcwb'),
            'mobileTooltipText' => __('Double click on the element to open the edit window. Hold finger to initiate drag and drop in a Tree view.', 'vcwb'),
            'template' => __('Template', 'vcwb'),
            'defaultTemplate' => __('Default template', 'vcwb'),
            'pageTemplateDescription' => __('To apply a template you will need to save changes and reload the page.', 'vcwb'),
            'pageTitleDescription' => __('To apply title changes you will need to save changes and reload the page.', 'vcwb'),
            'pageTitleDisableDescription' => __('Disable page title.', 'vcwb'),
            'successElementDownload' => __('{name} has been successfully downloaded from the Visual Composer Hub and added to your library.', 'vcwb'),
            'licenseErrorElementDownload' => __('Failed to download element (license is expired or request to account has timed out).', 'vcwb'),
            'defaultErrorElementDownload' => __('Failed to download element.', 'vcwb'),
        ];

        return $locale;
    }
}
