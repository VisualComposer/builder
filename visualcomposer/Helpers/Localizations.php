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
            'premiumElementsButton' => __('Go Premium', 'vcwb'),
            'premiumTemplatesButton' => __('Go Premium', 'vcwb'),
            'premiumHubButton' => __('Go Premium', 'vcwb'),
            'emptyTreeView' => __(
                'There is no content on your page - start by adding element or template.',
                'vcwb'
            ),
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
            'templateSaveFailed' => __('Template save failed', 'vcwb'),
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
            'templateRemoveFailed' => __('Failed to remove template', 'vcwb'),
            'blankPageHeadingPart1' => __('Select Blank Page', 'vcwb'),
            'blankPageHeadingPart2' => __('or Start With a template', 'vcwb'),
            'blankPageHelperText' => __(
            // @codingStandardsIgnoreLine
                'Get a Premium license to access Visual Composer Hub. Download professionally designed templates, more content elements, extensions, and more.',
                'vcwb'
            ),
            'addTemplateHelperText' => __(
            // @codingStandardsIgnoreLine
                'Didn\'t find a perfect template? Get a Premium license to download it from Visual Composer Hub.',
                'vcwb'
            ),
            'addElementHelperText' => __(
            // @codingStandardsIgnoreLine
                'Didn\'t find an element? Get a Premium license to download the right content element in Visual Composer Hub.',
                'vcwb'
            ),
            'hubHelperText' => __(
            // @codingStandardsIgnoreLine
                'Get a Premium license to access Visual Composer Hub. Download professionally designed templates, more content elements, extensions, and more.',
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
            'templateAlreadyExists' => __(
                'Template with this name already exist. Please specify another name.',
                'vcwb'
            ),
            'templateContentEmpty' => __('There is no content on your page - nothing to save', 'vcwb'),
            'specifyTemplateName' => __('Enter template name to save your page as a template', 'vcwb'),
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
            'enableBackendEditorConfirmMessage' => __(
            // @codingStandardsIgnoreLine
                'Visual Composer will overwrite your content created in WordPress Classic editor with the latest version of content created in Visual Composer Website Builder. Do you want to continue?',
                'vcwb'
            ),
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
                'Activation request failed. Invalid e-mail. Please check your e-mail and try again.',
                'vcwb'
            ),
            'mustAgreeToActivate' => __(
                'To activate and use Visual Composer Website Builder, you must read and agree to the terms of service.',
                'vcwb'
            ),
            'activationFailed' => __('Your activation request failed. Please try again.', 'vcwb'),
            'provideCorrectEmail' => __('Please provide valid e-mail address', 'vcwb'),
            'nothingFound' => __('Nothing found', 'vcwb'),
            'addImage' => __('Add Image', 'vcwb'),
            'removeImage' => __('Remove Image', 'vcwb'),
            'moveImage' => __('Move Image', 'vcwb'),
            'editReplaceImage' => __('Edit or Replace Image', 'vcwb'),
            'addLink' => __('Add Link', 'vcwb'),
            'selectUrl' => __('Select URL', 'vcwb'),
            'insertEditLink' => __('Insert or Edit Link', 'vcwb'),
            'urlInputPlaceholder' => __('Enter destination URL', 'vcwb'),
            'linkToExistingContent' => __('Or link to existing content', 'vcwb'),
            'searchExistingContent' => __('Search existing content', 'vcwb'),
            'noExistingContentFound' => __('Nothing found', 'vcwb'),
            'openLinkInTab' => __('Open link in a new tab', 'vcwb'),
            'addNofollow' => __('Add nofollow option to link', 'vcwb'),
            'enterDestinationUrl' => __('Enter destination URL', 'vcwb'),
            'titleAttributeText' => __('Title attribute will be displayed on link hover', 'vcwb'),
            'title' => __('Title', 'vcwb'),
            'bundleUpdateFailed' => __('Visual Composer Cloud update failed, please try again', 'vcwb'),
            'preview' => __('Preview', 'vcwb'),
            'previewChanges' => __('Preview Changes', 'vcwb'),
            'savingResults' => __('Saving Results', 'vcwb'),
            'hideOff' => __('Hide: Off', 'vcwb'),
            'hideOn' => __('Hide: On', 'vcwb'),
            'downloadingInitialExtensions' => __('Downloading initial extensions', 'vcwb'),
            'downloadingAssets' => __('Downloading assets {i} of {cnt}: {name}', 'vcwb'),
            'postUpdateText' => __('Updating posts {i} in {cnt}: {name}', 'vcwb'),
            'postUpdateAjaxRequestError' => __('Failed to load: {file} #10077', 'vcwb'),
            'mobileTooltipText' => __(
            // @codingStandardsIgnoreLine
                'Double tap on an element to open the edit window. Tap and hold to initiate drag and drop in a Tree view.',
                'vcwb'
            ),
            'template' => __('Template', 'vcwb'),
            'defaultTemplate' => __('Default template', 'vcwb'),
            'pageTemplateDescription' => __(
                'To apply a template save changes and reload the page',
                'vcwb'
            ),
            'pageTemplateReloadDescription' => __(
                'To apply a template you will need to save changes and content will be reloaded.',
                '_vcwb'
            ),
            'pageTitleDescription' => __(
                'To apply title changes save changes and reload the page',
                'vcwb'
            ),
            'pageTitleDisableDescription' => __('Disable page title', 'vcwb'),
            'successElementDownload' => __(
                '{name} has been successfully downloaded from the Visual Composer Hub and added to your library',
                'vcwb'
            ),
            'licenseErrorElementDownload' => __(
                'Failed to download element (license expired or request timed out)',
                'vcwb'
            ),
            'defaultErrorElementDownload' => __('Failed to download element', 'vcwb'),
            'feOopsMessageDefault' => __(
            // @codingStandardsIgnoreLine
                'It seems that something went wrong with loading content. Please make sure you are loading correct content and try again.',
                'vcwb'
            ),
            'feOopsButtonTextDefault' => __('Return to WordPress dashboard', 'vcwb'),
            'feOopsMessagePageForPosts' => __(
            // @codingStandardsIgnoreLine
                'It seems you are trying to edit archive page which displays your post archive instead of content. Before edit, please make sure to convert it to a static page via your WordPress admin',
                'vcwb'
            ),
            'feOopsButtonTextPageForPosts' => __('Return to WordPress dashboard', 'vcwb'),
            'replaceElementText' => __(
                'You can replace the {elementLabel} within this element with another {elementLabel} from your elements',
                'vcwb'
            ),
            'errorReportSubmitted' => __(
                'We would like to acknowledge that we have received your request and a ticket has been created. A support representative will be reviewing your request and will send you a personal response.',
                'vcwb'
            ),
            'backToWpAdminText' => __(
                'Return to WordPress dashboard',
                'vcwb'
            ),
            'thankYouText' => __(
                'Thank You!',
                'vcwb'
            ),
        ];

        return $locale;
    }
}
