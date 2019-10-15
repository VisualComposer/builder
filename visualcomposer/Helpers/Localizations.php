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
        $wpHelper = vchelper('Wp');
        $locale = [
            'addElement' => __('Add Element', 'visualcomposer'),
            'addPremiumElement' => __('Hub', 'visualcomposer'),
            'addTemplate' => __('Add Template', 'visualcomposer'),
            'treeView' => __('Tree View', 'visualcomposer'),
            'undo' => __('Undo', 'visualcomposer'),
            'redo' => __('Redo', 'visualcomposer'),
            'responsiveView' => __('Responsive View', 'visualcomposer'),
            'desktop' => __('Desktop', 'visualcomposer'),
            'tabletLandscape' => __('Tablet Landscape', 'visualcomposer'),
            'tabletPortrait' => __('Tablet Portrait', 'visualcomposer'),
            'mobileLandscape' => __('Mobile Landscape', 'visualcomposer'),
            'mobilePortrait' => __('Mobile Portrait', 'visualcomposer'),
            'settings' => __('Settings', 'visualcomposer'),
            'layout' => __('Layout', 'visualcomposer'),
            'update' => __('Update', 'visualcomposer'),
            'menu' => __('Menu', 'visualcomposer'),
            'viewPage' => __('View Page', 'visualcomposer'),
            'backToWordpress' => __('Back to WordPress', 'visualcomposer'),
            'wordPressDashboard' => __('WordPress Dashboard', 'visualcomposer'),
            'publish' => __('Publish', 'visualcomposer'),
            'submitForReview' => __('Submit for Review', 'visualcomposer'),
            'saveDraft' => __('Save Draft', 'visualcomposer'),
            'goPremium' => __('Go Premium', 'visualcomposer'),
            'close' => __('Close', 'visualcomposer'),
            'premiumElementsButton' => __('Go Premium', 'visualcomposer'),
            'premiumTemplatesButton' => __('Go Premium', 'visualcomposer'),
            'premiumHubButton' => __('Go Premium', 'visualcomposer'),
            'emptyTreeView' => __(
                'There is no content on your page - start by adding element or template.',
                'visualcomposer'
            ),
            'customCSS' => __('Custom CSS', 'visualcomposer'),
            'localCSS' => __('Local CSS', 'visualcomposer'),
            'localCSSLabel' => __('Local CSS will be applied to this particular page only', 'visualcomposer'),
            'globalCSS' => __('Global CSS', 'visualcomposer'),
            'globalCSSLabel' => __('Global CSS will be applied site wide', 'visualcomposer'),
            'customJS' => __('Custom JavaScript', 'visualcomposer'),
            'localJS' => __('Local JavaScript', 'visualcomposer'),
            'localJSLabel' => __('Local JavaScript will be applied to this particular page only', 'visualcomposer'),
            'globalJS' => __('Global JavaScript', 'visualcomposer'),
            'globalJSLabel' => __('Global JavaScript will be applied site wide', 'visualcomposer'),
            'save' => __('Save', 'visualcomposer'),
            'templateName' => __('Template Name', 'visualcomposer'),
            'saveTemplate' => __('Save Template', 'visualcomposer'),
            'removeTemplate' => __('Remove Template', 'visualcomposer'),
            'templateSaveFailed' => __('Template save failed', 'visualcomposer'),
            'downloadMoreTemplates' => __('Download More Templates', 'visualcomposer'),
            'getMoreElements' => __('Get More Elements', 'visualcomposer'),
            'getMoreTemplates' => __('Get More Templates', 'visualcomposer'),
            'noTemplatesFound' => __(
            // @codingStandardsIgnoreLine
                'You don\'t have any templates yet. Try to save your current layout as a template or download templates from Visual Composer Hub.',
                'visualcomposer'
            ),
            'notRightTemplatesFound' => __(
                'Didn\'t find the right template? Check out Visual Composer Hub for more layout templates.',
                'visualcomposer'
            ),
            'accessVisualComposerHubToDownload' => __(
                'Access Visual Composer Hub - to download additional elements, templates and extensions.',
                'visualcomposer'
            ),
            'removeTemplateWarning' => __('Do you want to remove this template?', 'visualcomposer'),
            'templateRemoveFailed' => __('Failed to remove template', 'visualcomposer'),
            'blankPageHeadingPart1' => __('Name Your Page, Select', 'visualcomposer'),
            'blankPageHeadingPart2' => __('Layout and Start Building', 'visualcomposer'),
            'blankPageTitleHeadingPart1' => __('Name Your ', 'visualcomposer'),
            'blankPageTitleHeadingPart2' => __('and Start Building', 'visualcomposer'),
            'blankPageHelperText' => __(
            // @codingStandardsIgnoreLine
                'Start by adding an element to your layout or select one of the pre-defined templates.',
                'visualcomposer'
            ),
            'blankPageInputPlaceholderText' => __('Page title', 'visualcomposer'),
            'addTemplateHelperText' => __(
            // @codingStandardsIgnoreLine
                'Didn\'t find a perfect template? Get a Premium license to download it from Visual Composer Hub.',
                'visualcomposer'
            ),
            'addElementHelperText' => __(
            // @codingStandardsIgnoreLine
                'Didn\'t find an element? Get a Premium license to download the right content element in Visual Composer Hub.',
                'visualcomposer'
            ),
            'hubHelperText' => __(
            // @codingStandardsIgnoreLine
                'Get a Premium license to access Visual Composer Hub. Download professionally designed templates, more content elements, extensions, and more.',
                'visualcomposer'
            ),
            'add' => __('Add', 'visualcomposer'),
            'rowLayout' => __('Row Layout', 'visualcomposer'),
            'edit' => __('Edit', 'visualcomposer'),
            'designOptions' => __('Design Options', 'visualcomposer'),
            'clone' => __('Clone', 'visualcomposer'),
            'copy' => __('Copy', 'visualcomposer'),
            'paste' => __('Paste', 'visualcomposer'),
            'pasteAfter' => __('Paste After', 'visualcomposer'),
            'remove' => __('Remove', 'visualcomposer'),
            'move' => __('Move', 'visualcomposer'),
            'searchContentElements' => __('Search content elements', 'visualcomposer'),
            'searchContentElementsAndTemplates' => __('Search content elements and templates', 'visualcomposer'),
            'searchContentTemplates' => __('Search content templates', 'visualcomposer'),
            'templateAlreadyExists' => __(
                'Template with this name already exist. Please specify another name.',
                'visualcomposer'
            ),
            'templateContentEmpty' => __('There is no content on your page - nothing to save', 'visualcomposer'),
            'specifyTemplateName' => __('Enter template name to save your page as a template', 'visualcomposer'),
            'addOneColumn' => __('Add one column', 'visualcomposer'),
            'addTwoColumns' => __('Add two columns', 'visualcomposer'),
            'addThreeColumns' => __('Add three columns', 'visualcomposer'),
            'addFourColumns' => __('Add four columns', 'visualcomposer'),
            'addFiveColumns' => __('Add five columns', 'visualcomposer'),
            'addCustomRowLayout' => __('Add custom row layout', 'visualcomposer'),
            'addTextBlock' => __('Add Text block', 'visualcomposer'),
            'frontendEditor' => __('Edit with Visual Composer', 'visualcomposer'),
            'classicEditor' => __('Classic Editor', 'visualcomposer'),
            'openFrontendEditorFromClassic' => __(
            // @codingStandardsIgnoreLine
                'You are switching to Visual Composer. Visual Composer will load the latest version of content created with the builder.',
                'visualcomposer'
            ),
            'enableClassicEditorConfirmMessage' => __(
            // @codingStandardsIgnoreLine
                'You are switching to Classic editor. The content created with Visual Composer will be copied to Classic editor (style changes may apply.) Any changes made in the Classic editor will not be synced with Visual Composer layout. Do you want to proceed?',
                'visualcomposer'
            ),
            'blankPage' => __('Blank Page', 'visualcomposer'),
            'searchTemplates' => __('Search templates by name and description', 'visualcomposer'),
            'noResultOpenHub' => __('Open Visual Composer Hub', 'visualcomposer'),
            'notRightElementsFound' => __(
                'Didn\'t find the right element? Check out Visual Composer Hub for more content elements.',
                'visualcomposer'
            ),
            'activationFailed' => __(
                'An error occurred during the Visual Composer extension download process. 
<ul><li>- Check if your server has a connection to the Internet</li><li>- Check your server proxy configuration settings</li><li>- Check your server firewall settings and access to https://account.visualcomposer.io</li><li>- Check if your server has access to the <a href="https://cdn.hub.visualcomposer.com/vcwb-teasers/youtubePlayer.3307569.1518529200.youtube-player-preview.jpg" target="_blank">Amazon AWS</a></li></ul>',
                'visualcomposer'
            ),
            'nothingFound' => __('Nothing found', 'visualcomposer'),
            'addImage' => __('Add Image', 'visualcomposer'),
            'removeImage' => __('Remove Image', 'visualcomposer'),
            'moveImage' => __('Move Image', 'visualcomposer'),
            'editReplaceImage' => __('Edit or Replace Image', 'visualcomposer'),
            'addLink' => __('Add Link', 'visualcomposer'),
            'selectUrl' => __('Select URL', 'visualcomposer'),
            'insertEditLink' => __('Insert or Edit Link', 'visualcomposer'),
            'urlInputPlaceholder' => __('Enter destination URL', 'visualcomposer'),
            'linkToExistingContent' => __('Or link to existing content', 'visualcomposer'),
            'searchExistingContent' => __('Search existing content', 'visualcomposer'),
            'noExistingContentFound' => __('Nothing found', 'visualcomposer'),
            'openLinkInTab' => __('Open link in a new tab', 'visualcomposer'),
            'addNofollow' => __('Add nofollow option to link', 'visualcomposer'),
            'enterDestinationUrl' => __('Enter destination URL', 'visualcomposer'),
            'titleAttributeText' => __('Title attribute will be displayed on link hover', 'visualcomposer'),
            'title' => __('Title', 'visualcomposer'),
            'bundleUpdateFailed' => __('Visual Composer Cloud update failed, please try again', 'visualcomposer'),
            'preview' => __('Preview', 'visualcomposer'),
            'previewChanges' => __('Preview Changes', 'visualcomposer'),
            'savingResults' => __('Saving Results', 'visualcomposer'),
            'hideOff' => __('Hide: Off', 'visualcomposer'),
            'hideOn' => __('Hide: On', 'visualcomposer'),
            'downloadingInitialExtensions' => __('Downloading initial extensions', 'visualcomposer'),
            'downloadingAssets' => __('Downloading assets {i} of {cnt}: {name}', 'visualcomposer'),
            'postUpdateText' => __('Updating posts {i} in {cnt}: {name}', 'visualcomposer'),
            'postUpdateAjaxRequestError' => __('Failed to load: {file}', 'visualcomposer') . ' #10077',
            'none' => __('None', 'visualcomposer'),
            'mobileTooltipText' => __(
            // @codingStandardsIgnoreLine
                'Double tap on an element to open the edit window. Tap and hold to initiate drag and drop in a Tree view.',
                'visualcomposer'
            ),
            'template' => __('Template', 'visualcomposer'),
            'defaultTemplate' => __('Theme Default', 'visualcomposer'),
            'pageTemplateDescription' => __(
                'To apply a template save changes and reload the page',
                'visualcomposer'
            ),
            'pageTemplateReloadDescription' => __(
                'To apply a template you will need to save changes and content will be reloaded.',
                'visualcomposer'
            ),
            'pageTitleDescription' => __(
                'To apply title changes save changes and reload the page',
                'visualcomposer'
            ),
            'pageTitleDisableDescription' => __('Disable page title', 'visualcomposer'),
            'successElementDownload' => __(
                '{name} has been successfully downloaded from the Visual Composer Hub and added to your library',
                'visualcomposer'
            ),
            'licenseErrorElementDownload' => __(
                'Failed to download element (license expired or request timed out)',
                'visualcomposer'
            ),
            'defaultErrorElementDownload' => __('Failed to download element', 'visualcomposer'),
            'feOopsMessageDefault' => __(
            // @codingStandardsIgnoreLine
                'It seems that something went wrong with loading content. Please make sure you are loading correct content and try again.',
                'visualcomposer'
            ),
            'feOopsButtonTextDefault' => __('Return to WordPress dashboard', 'visualcomposer'),
            'feOopsMessagePageForPosts' => __(
            // @codingStandardsIgnoreLine
                'It seems you are trying to edit archive page which displays your post archive instead of content. Before edit, please make sure to convert it to a static page via your WordPress admin',
                'visualcomposer'
            ),
            'feOopsButtonTextPageForPosts' => __('Return to WordPress dashboard', 'visualcomposer'),
            'replaceElementText' => __(
                'You can replace the {elementLabel} within this element with another {elementLabel} from your elements',
                'visualcomposer'
            ),
            'replaceElementEditForm' => __(
                'Replace current element with different element from the same category',
                'visualcomposer'
            ),
            'errorReportSubmitted' => __(
                'We would like to acknowledge that we have received your request and a ticket has been created. A support representative will be reviewing your request and will send you a personal response.',
                'visualcomposer'
            ),
            'backToWpAdminText' => __(
                'Return to WordPress dashboard',
                'visualcomposer'
            ),
            'thankYouText' => __(
                'Thank You!',
                'visualcomposer'
            ),
            'newPluginVersionIsAvailable' => sprintf(
                __(
                    'There is a new version of Visual Composer Website Builder available. <a href="%s">Update now</a> to version %s.',
                    'visualcomposer'
                ),
                self_admin_url('plugins.php'),
                $wpHelper->getUpdateVersionFromWordpressOrg()
            ),
            'chooseHFS' => sprintf(
                __(
                    'Choose %s or %screate new%s.',
                    'visualcomposer'
                ),
                '{name}',
                '<a href="{link}" target="_blank">',
                '</a>'
            ),
            'selectHFS' => __(
                'Default',
                'visualcomposer'
            ),
            'elementDownloadRequiresUpdate' => __(
                'Update Visual Composer plugin to the most recent version to download this content element.',
                'visualcomposer'
            ),
            'templateDownloadRequiresUpdate' => __(
                'Update Visual Composer plugin to the most recent version to download this template.',
                'visualcomposer'
            ),
            'startBuildingHFSButton' => __('Start Building', 'visualcomposer'),
            'startPageHFSInputPlaceholder' => sprintf(
                __(
                    '%s Name',
                    'visualcomposer'
                ),
                '{name}'
            ),
            'themeDefaultDescription' => __(
                'Your WordPress theme defined layout for specific page, post, or custom post type.',
                'visualcomposer'
            ),
            'vcBoxedDescription' => __(
                'Blank page layout with boxed content area in the middle of the page without header, footer, or sidebar.',
                'visualcomposer'
            ),
            'vcBlankDescription' => __(
                'Full width blank page without header, footer, or sidebar.',
                'visualcomposer'
            ),
            'vcThemeHeaderFooterDescription' => __(
                'Default layout with custom header, content, and footer area.',
                'visualcomposer'
            ),
            'vcThemeHeaderFooterSidebarDescription' => __(
                'Default layout with custom header, content, footer and sidebar area on the right.',
                'visualcomposer'
            ),
            'vcThemeHeaderFooterLeftSidebarDescription' => __(
                'Default layout with custom header, content, footer and sidebar area on the left.',
                'visualcomposer'
            ),
            'availableInPremium' => __(
                'Available in Premium version.',
                'visualcomposer'
            ),
            'gutenbergDoesntWorkProperly' => __(
                "Gutenberg plugin doesn't work properly. Please check Gutenberg plugin.",
                'visualcomposer'
            ),
            'free' => __('Free', 'visualcomposer'),
            'premium' => __('Premium', 'visualcomposer'),
            'removeAll' => __('Remove All', 'visualcomposer'),
            'continueImport' => __('Continue import', 'visualcomposer'),
            'backToImport' => __('Back to import', 'visualcomposer'),
            'startingImportProcess' => __('Starting import process...', 'visualcomposer'),
            'backToParent' => __('Back to parent', 'visualcomposer'),
            'editorSettings' => __('Editor Settings', 'visualcomposer'),
            'clickToEditColumnValue' => __('Click to edit column value', 'visualcomposer'),
            'addOn' => __('Add-on', 'visualcomposer'),
            'doNotCloseWhileUpdateText' => __('Don\'t close this window while download is in the progress.', 'visualcomposer'),
            'createYourWordpressWebsite' => __('Create Your WordPress Website.', 'visualcomposer'),
            'anyLayoutFastAndEasy' => __('Any Layout. Fast and Easy.', 'visualcomposer'),
            'skipThisPostText' => __('Skip this post', 'visualcomposer'),
            'getMoreText' => __('Get More Elements, Templates, and Extensions', 'visualcomposer'),
            'downloadFromHubText' => __(
                'Download additional content from the Visual Composer Hub - right in your editor instantly.',
                'visualcomposer'
            ),
            'getStartedText' => __('Get Started', 'visualcomposer'),
            'sendingErrorReport' => __('Sending Error Report', 'visualcomposer'),
            'doNotCloseWhileSendingErrorReportText' => __(
                'Don\'t close this window while sending error is in the progress.',
                'visualcomposer'
            ),
            'somethingWentWrong' => __('Oops ... Something Went Wrong', 'visualcomposer'),
            'goToHubButtonDescription' => __(
                'Access Visual Composer Hub - download additional elements, templates and extensions.',
                'visualcomposer'
            ),
            'settingsCustomJsLocal' => __(
                'Add custom JavaScript code to insert it localy on this page in <header> or <footer>. Insert Google Analytics, Tag Manager, Kissmetrics or other JavaScript code snippets.',
                'visualcomposer'
            ),
            'settingsCustomJsGlobal' => __(
                'Add custom JavaScript code to insert it globally on every page in <header> or <footer>. Insert Google Analytics, Tag Manager, Kissmetrics or other JavaScript code snippets.',
                'visualcomposer'
            ),
            'openEditForm' => __('Open Edit Form', 'visualcomposer'),
            'unlockHub' => __(
                'Unlock Visual Composer Hub',
                'visualcomposer'
            ),
            'shortcode' => __(
                'Shortcode',
                'visualcomposer'
            ),
            'shortcodeElementAttrDescription' => __(
                'Copy your shortcode here with all the correct parameters. The shortcode must be installed on your WordPress site via plugin or theme.',
                'visualcomposer'
            ),
            'activatePremium' => __(
                'Activate Premium',
                'visualcomposer'
            ),
            'searchPhotosOnUnsplash' => __(
                'Search free high-resolution photos on Unsplash',
                'visualcomposer'
            ),
            'getPhotosWithPremiumText' => __(
                'Download and Add Free Beautiful Photos to Your Site With Visual Composer Premium',
                'visualcomposer'
            ),
            'getPhotosText' => __(
                'Download and Add Free Beautiful Photos to Your Site',
                'visualcomposer'
            ),
            'noAccessCheckLicence' => __(
                'No access, please check your license!',
                'visualcomposer'
            ),
            'noConnectionToUnsplash' => __(
                'Could not connect to Unsplash Server!',
                'visualcomposer'
            ),
            'imageDownloadedToMediaLibrary' => __(
                'Image has been downloaded to your Media Library.',
                'visualcomposer'
            ),
            'coundNotParseData' => __(
                'Could not parse data from server!',
                'visualcomposer'
            ),
            'small' => __(
                'Small',
                'visualcomposer'
            ),
            'medium' => __(
                'Medium',
                'visualcomposer'
            ),
            'large' => __(
                'Large',
                'visualcomposer'
            ),
            'images' => __(
                'images',
                'visualcomposer'
            ),
            'downloadImageFromUnsplash' => __(
                'Download images from Unsplash to your Media Library',
                'visualcomposer'
            ),
            'permalink' => __(
                'Permalink',
                'visualcomposer'
            ),
            'spreadTheWordText' => __(
                'Enjoy Visual Composer Website Builder? Let your friends know about it - spread the word.',
                'visualcomposer'
            ),
            'dynamicFieldsOpenText' => __(
                'Insert dynamic content',
                'visualcomposer'
            ),
            'dynamicFieldsEditText' => __(
                'Edit dynamic content',
                'visualcomposer'
            ),
            'dynamicFieldsCloseText' => __(
                'Remove dynamic content',
                'visualcomposer'
            ),
            'dynamicAutocompleteDescription' => __(
                'Select page, post, or custom post type.',
                'visualcomposer'
            ),
            'dynamicAutocompleteToggleDescription' => __(
                'By default, dynamic content is taken from the current post.',
                'visualcomposer'
            ),
            'dynamicAutocompleteToggleLabel' => __(
                'Set custom post source',
                'visualcomposer'
            ),
            'dynamicSelectCustomField' => __(
                'Select custom field',
                'visualcomposer'
            ),
            'dynamicContent' => __(
                'Dynamic Content',
                'visualcomposer'
            ),
            'noValueSet' => __(
                'No value set',
                'visualcomposer'
            ),
            'activatePremiumToUnlockStockImages' => __(
                'Activate Premium to Unlock Stock Images',
                'visualcomposer'
            ),
        ];

        return vcfilter('vcv:helpers:localizations:i18n', $locale);
    }
}
