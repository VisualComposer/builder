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
        $optionsHelper = vchelper('Options');
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
            'layout' => __('Layout', 'vcwb'),
            'update' => __('Update', 'vcwb'),
            'menu' => __('Menu', 'vcwb'),
            'viewPage' => __('View Page', 'vcwb'),
            'backToWordpress' => __('Back to WordPress', 'vcwb'),
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
            'getMoreElements' => __('Get More Elements', 'vcwb'),
            'getMoreTemplates' => __('Get More Templates', 'vcwb'),
            'noTemplatesFound' => __(
            // @codingStandardsIgnoreLine
                'You don\'t have any templates yet. Try to save your current layout as a template or download templates from Visual Composer Hub.',
                'vcwb'
            ),
            'notRightTemplatesFound' => __(
                'Didn\'t find the right template? Check out Visual Composer Hub for more layout templates.',
                'vcwb'
            ),
            'accessVisualComposerHubToDownload' => __(
                'Access Visual Composer Hub - to download additional elements, templates and extensions.',
                'vcwb'
            ),
            'removeTemplateWarning' => __('Do you want to remove this template?', 'vcwb'),
            'templateRemoveFailed' => __('Failed to remove template', 'vcwb'),
            'blankPageHeadingPart1' => __('Name Your Page, Select', 'vcwb'),
            'blankPageHeadingPart2' => __('Layout and Start Building', 'vcwb'),
            'blankPageTitleHeadingPart1' => __('Name Your ', 'vcwb'),
            'blankPageTitleHeadingPart2' => __('and Start Building', 'vcwb'),
            'blankPageHelperText' => __(
            // @codingStandardsIgnoreLine
                'Start by adding an element to your layout or select one of the pre-defined templates.',
                'vcwb'
            ),
            'blankPageInputPlaceholderText' => __('Page title', 'vcwb'),
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
            'pasteAfter' => __('Paste After', 'vcwb'),
            'remove' => __('Remove', 'vcwb'),
            'move' => __('Move', 'vcwb'),
            'searchContentElements' => __('Search content elements', 'vcwb'),
            'searchContentElementsAndTemplates' => __('Search content elements and templates', 'vcwb'),
            'searchContentTemplates' => __('Search content templates', 'vcwb'),
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
            'frontendEditor' => __('Edit with Visual Composer', 'vcwb'),
            'classicEditor' => __('Classic Editor', 'vcwb'),
            'openFrontendEditorFromClassic' => __(
            // @codingStandardsIgnoreLine
                'You are switching to Visual Composer. Visual Composer will load the latest version of content created with the builder.',
                'vcwb'
            ),
            'enableClassicEditorConfirmMessage' => __(
            // @codingStandardsIgnoreLine
                'You are switching to Classic editor. The content created with Visual Composer will be copied to Classic editor (style changes may apply.) Any changes made in the Classic editor will not be synced with Visual Composer layout. Do you want to proceed?',
                'vcwb'
            ),
            'blankPage' => __('Blank Page', 'vcwb'),
            'searchTemplates' => __('Search templates by name and description', 'vcwb'),
            'noResultOpenHub' => __('Open Visual Composer Hub', 'vcwb'),
            'notRightElementsFound' => __(
                'Didn\'t find the right element? Check out Visual Composer Hub for more content elements.',
                'vcwb'
            ),
            'activationFailed' => __(
                'An error occurred during the Visual Composer extension download process. 
<ul><li>- Check if your server has a connection to the Internet</li><li>- Check your server proxy configuration settings</li><li>- Check your server firewall settings and access to https://account.visualcomposer.io</li><li>- Check if your server has access to the <a href="https://s3-us-west-2.amazonaws.com/updates.wpbakery.com/vcwb-teasers/youtubePlayer.3307569.1518529200.youtube-player-preview.jpg" target="_blank">Amazon AWS</a></li></ul>',
                'vcwb'
            ),
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
            'postUpdateAjaxRequestError' => __('Failed to load: {file}', 'vcwb') . ' #10077',
            'none' => __('None', 'vcwb'),
            'mobileTooltipText' => __(
            // @codingStandardsIgnoreLine
                'Double tap on an element to open the edit window. Tap and hold to initiate drag and drop in a Tree view.',
                'vcwb'
            ),
            'template' => __('Template', 'vcwb'),
            'defaultTemplate' => __('Theme Default', 'vcwb'),
            'pageTemplateDescription' => __(
                'To apply a template save changes and reload the page',
                'vcwb'
            ),
            'pageTemplateReloadDescription' => __(
                'To apply a template you will need to save changes and content will be reloaded.',
                'vcwb'
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
            'replaceElementEditForm' => __(
                'Replace current element with different element from the same category',
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
            'newPluginVersionIsAvailable' => sprintf(
                __(
                    'There is a new version of Visual Composer Website Builder available. <a href="%s">Update now</a> to version %s.',
                    'vcwb'
                ),
                self_admin_url('plugins.php'),
                $optionsHelper->getTransient('pluginUpdateAvailable')
            ),
            'chooseHFS' => sprintf(
                __(
                    'Choose %s or %screate new%s.',
                    'vcwb'
                ),
                '{name}',
                '<a href="{link}" target="_blank">',
                '</a>'
            ),
            'selectHFS' => __(
                'Default',
                'vcwb'
            ),
            'elementDownloadRequiresUpdate' => __(
                'Update Visual Composer plugin to the most recent version to download this content element.',
                'vcwb'
            ),
            'templateDownloadRequiresUpdate' => __(
                'Update Visual Composer plugin to the most recent version to download this template.',
                'vcwb'
            ),
            'startBuildingHFSButton' => __('Start Building', 'vcwb'),
            'startPageHFSInputPlaceholder' => sprintf(
                __(
                    '%s Name',
                    'vcwb'
                ),
                '{name}'
            ),
            'themeDefaultDescription' => __(
                'Your WordPress theme defined layout for specific page, post, or custom post type.',
                'vcwb'
            ),
            'vcBoxedDescription' => __(
                'Blank page layout with boxed content area in the middle of the page without header, footer, or sidebar.',
                'vcwb'
            ),
            'vcBlankDescription' => __(
                'Full width blank page without header, footer, or sidebar.',
                'vcwb'
            ),
            'vcThemeHeaderFooterDescription' => __(
                'Default layout with custom header, content, and footer area.',
                'vcwb'
            ),
            'vcThemeHeaderFooterSidebarDescription' => __(
                'Default layout with custom header, content, footer and sidebar area on the right.',
                'vcwb'
            ),
            'vcThemeHeaderFooterLeftSidebarDescription' => __(
                'Default layout with custom header, content, footer and sidebar area on the left.',
                'vcwb'
            ),
            'availableInPremium' => __(
                'Available in Premium version.',
                'vcwb'
            ),
            'gutenbergDoesntWorkProperly' => __(
                "Gutenberg plugin doesn't work properly. Please check Gutenberg plugin.",
                'vcwb'
            ),
            'free' => __('Free', 'vcwb'),
            'premium' => __('Premium', 'vcwb'),
            'removeAll' => __('Remove All', 'vcwb'),
            'continueImport' => __('Continue import', 'vcwb'),
            'backToImport' => __('Back to import', 'vcwb'),
            'startingImportProcess' => __('Starting import process...', 'vcwb'),
            'backToParent' => __('Back to parent', 'vcwb'),
            'editorSettings' => __('Editor Settings', 'vcwb'),
            'disablePreviewDescription' => __(
                'Disable element and template preview popup in Add Element and Add Template windows',
                'vcwb'
            ),
            'disablePreview' => __('Disable preview', 'vcwb'),
            'clickToEditColumnValue' => __('Click to edit column value', 'vcwb'),
            'addOn' => __('Add-on', 'vcwb'),
            'addonWpbMigration_download_update_required' => __(
                'Update Visual Composer plugin to the most recent version to download addon.',
                'vcwb'
            ),
            'addonWpbMigration_title' => __('This page was created with WPBakery Page Builder. What\'s next?', 'vcwb'),
            'addonWpbMigration_intro' => __(
                'To take over and start using Visual Composer Website Builder for this page, you need to:',
                'vcwb'
            ),
            'addonWpbMigration_checkAddon' => __('Download Migration addon from the Hub', 'vcwb'),
            'addonWpbMigration_checkWpb' => __('Keep WPBakery Page Builder plugin activated', 'vcwb'),
            'addonWpbMigration_note' => __(
                'Supported elements will be converted into Visual Composer compatible elements, the rest of the elements will be converted into the WPBakery Shortcode element.',
                'vcwb'
            ),
            'addonWpbMigration_download_button' => __('Download Migration Addon', 'vcwb'),
            'addonWpbMigration_backToWordpress' => __('Back to WordPress', 'vcwb'),
            'doNotCloseWhileUpdateText' => __('Don\'t close this window while download is in the progress.', 'vcwb'),
            'createYourWordpressWebsite' => __('Create Your WordPress Website.', 'vcwb'),
            'anyLayoutFastAndEasy' => __('Any Layout. Fast and Easy.', 'vcwb'),
            'skipThisPostText' => __('Skip this post', 'vcwb'),
            'getMoreText' => __('Get More Elements, Templates, and Extensions', 'vcwb'),
            'downloadFromHubText' => __(
                'Download additional content from the Visual Composer Hub - right in your editor instantly.',
                'vcwb'
            ),
            'getStartedText' => __('Get Started', 'vcwb'),
            'sendingErrorReport' => __('Sending Error Report', 'vcwb'),
            'doNotCloseWhileSendingErrorReportText' => __(
                'Don\'t close this window while sending error is in the progress.',
                'vcwb'
            ),
            'somethingWentWrong' => __('Oops ... Something Went Wrong', 'vcwb'),
            'goToHubButtonDescription' => __(
                'Access Visual Composer Hub - download additional elements, templates and extensions.',
                'vcwb'
            ),
            'settingsCustomJsLocal' => __(
                'Add custom JavaScript code to insert it localy on this page in <header> or <footer>. Insert Google Analytics, Tag Manager, Kissmetrics or other JavaScript code snippets.',
                'vcwb'
            ),
            'settingsCustomJsGlobal' => __(
                'Add custom JavaScript code to insert it globally on every page in <header> or <footer>. Insert Google Analytics, Tag Manager, Kissmetrics or other JavaScript code snippets.',
                'vcwb'
            ),
            'openEditForm' => __('Open Edit Form', 'vcwb'),
            'wpbakeryAttrDescription' => __(
                'WPBakery element is displayed as shortcode. Adjust shortcode parameters or open WPBakery Edit form for easier editing.',
                'vcwb'
            ),
            'wpbakeryAttrError' => __(
                'Failed to load WPBakery Edit Form, please check WPBakery Page Builder Plugin.',
                'vcwb'
            ),
            'wpbakeryAttrPluginAndAddonRequired' => __(
                'WPBakery plugin and migration addon is required to use this attribute',
                'vcwb'
            ),
            'wpbakeryAttrToggleDescription' => __(
                'View WPBakery element/s as shortcodes',
                'vcwb'
            ),
            'wpbakeryTreeViewAttrDescription' => __(
                'Complex element structures (ex. tabs with content) are represented with the Tree view. Use the Tree view to access and edit individual elements.',
                'vcwb'
            ),
            'wpbakeryStructureTitle' => __(
                'WPBakery element structure',
                'vcwb'
            ),
            'wpbakeryTitle' => __(
                'WPBakery element',
                'vcwb'
            ),
            'unlockHub' => __(
                'Unlock Visual Composer Hub',
                'vcwb'
            ),
            'wpbakeryAttrDescriptionNoEditForm' => __(
                'WPBakery element is displayed as shortcode. Adjust shortcode parameters.',
                'vcwb'
            ),
            'shortcode' => __(
                'Shortcode',
                'vcwb'
            ),
            'shortcodeElementAttrDescription' => __(
                'Copy your shortcode here with all the correct parameters. The shortcode must be installed on your WordPress site via plugin or theme.',
                'vcwb'
            ),
            'activatePremium' => __(
                'Activate Premium',
                'vcwb'
            ),
            'searchPhotosOnUnsplash' => __(
                'Search free high-resolution photos on Unsplash',
                'vcwb'
            ),
            'getPhotosWithPremiumText' => __(
                'Download and Add Free Beautiful Photos to Your Site With Visual Composer Premium',
                'vcwb'
            ),
            'getPhotosText' => __(
                'Download and Add Free Beautiful Photos to Your Site',
                'vcwb'
            ),
            'noAccessCheckLicence' => __(
                'No access, please check your license!',
                'vcwb'
            ),
            'noConnectionToUnsplash' => __(
                'Could not connect to Unsplash Server!',
                'vcwb'
            ),
            'imageDownloadedToMediaLibrary' => __(
                'Image has been downloaded to your Media Library.',
                'vcwb'
            ),
            'coundNotParseData' => __(
                'Could not parse data from server!',
                'vcwb'
            ),
            'small' => __(
                'Small',
                'vcwb'
            ),
            'medium' => __(
                'Medium',
                'vcwb'
            ),
            'large' => __(
                'Large',
                'vcwb'
            ),
            'images' => __(
                'images',
                'vcwb'
            ),
            'downloadImageFromUnsplash' => __(
                'Download images from Unsplash to your Media Library',
                'vcwb'
            ),
            'permalink' => __(
                'Permalink',
                'vcwb'
            ),
            'spreadTheWordText' => __(
                'Enjoy Visual Composer Website Builder? Let your friends know about it - spread the word.',
                'vcwb'
            ),
            'dynamicFieldsOpenText' => __(
                'Insert dynamic content',
                'vcwb'
            ),
            'dynamicFieldsEditText' => __(
                'Edit dynamic content',
                'vcwb'
            ),
            'dynamicFieldsCloseText' => __(
                'Remove dynamic content',
                'vcwb'
            ),
            'dynamicAutocompleteDescription' => __(
                'Select page, post, or custom post type.',
                'vcwb'
            ),
            'dynamicAutocompleteToggleDescription' => __(
                'By default, dynamic content is taken from the current post.',
                'vcwb'
            ),
            'dynamicAutocompleteToggleLabel' => __(
                'Set custom post source',
                'vcwb'
            ),
            'dynamicSelectCustomField' => __(
                'Select custom field',
                'vcwb'
            ),
            'dynamicContent' => __(
                'Dynamic Content',
                'vcwb'
            ),
            'noValueSet' => __(
                'No value set',
                'vcwb'
            ),
        ];

        return vcfilter('vcv:helpers:localizations:i18n', $locale);
    }
}
