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
    protected $translatableElementAttributes = [
        'classicTab' => ['tabTitle'],
        'classicAccordionSection' => ['sectionTitle'],
        'copyright' => ['prefix', 'postfix'],
        'faqToggle' => ['titleText', 'textBlock'],
        'flipBox' => ['text', 'hoverText', 'hoverDescription'],
        'doubleTextButton' => ['buttonText', 'buttonHoverText'],
        'doubleTitle' => ['frontTitle', 'backgroundTitle'],
        'counterUp' => ['suffix', 'prefix'],
        'typewriterHeading' => [
            'text1',
            'text2',
            'text3',
            'text4',
            'text5',
            'text6',
        ],
        'countdownTimer' => [
            'dayTitle',
            'daysTitle',
            'hourTitle',
            'hoursTitle',
            'minuteTitle',
            'minutesTitle',
            'secondTitle',
            'secondsTitle',
        ],
    ];

    /**
     * @param $locale array
     *
     * @return array
     */
    public function getLocalizations()
    {
        $source = 'vcwb';
        if (defined('VCV_AUTHOR_API_KEY')) {
            $source = 'theme-author-vcwb';
        }

        $wpHelper = vchelper('Wp');
        $locale = [
            'addElement' => __('Add Element', 'visualcomposer'),
            'addContent' => __('Add Content', 'visualcomposer'),
            'addPremiumElement' => __('Visual Composer Hub', 'visualcomposer'),
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
            'options' => __('Options', 'visualcomposer'),
            'update' => __('Update', 'visualcomposer'),
            'menu' => __('Menu', 'visualcomposer'),
            'viewPage' => __('View Page', 'visualcomposer'),
            'backToWordpress' => __('Back to WordPress', 'visualcomposer'),
            'assignLayout' => __('Assign Layout to...', 'visualcomposer'),
            'wordPressDashboard' => __('WordPress Dashboard', 'visualcomposer'),
            'publish' => __('Publish', 'visualcomposer'),
            'submitForReview' => __('Submit for Review', 'visualcomposer'),
            'saveDraft' => __('Save Draft', 'visualcomposer'),
            'goPremium' => __('Go Premium', 'visualcomposer'),
            'getFreeLicense' => __('Get Free License', 'visualcomposer'),
            'activated' => __('Activated', 'visualcomposer'),
            'close' => __('Close', 'visualcomposer'),
            'emptyTreeView' => __(
                'There is no content on the page - start by adding an element or template.',
                'visualcomposer'
            ),
            'customCSS' => __('Custom CSS', 'visualcomposer'),
            'localCSS' => __('Local CSS', 'visualcomposer'),
            'globalCSS' => __('Global CSS', 'visualcomposer'),
            'customJS' => __('Custom JavaScript', 'visualcomposer'),
            'localJS' => __('Local JavaScript', 'visualcomposer'),
            'localJSLabel' => __('Local JavaScript will be applied to this particular page only.', 'visualcomposer'),
            'globalJS' => __('Global JavaScript', 'visualcomposer'),
            'globalJSLabel' => __('Apply custom Global Javascript code sitewide.', 'visualcomposer'),
            'save' => __('Save', 'visualcomposer'),
            'enterTemplateName' => __('Enter template name', 'visualcomposer'),
            'enterPresetName' => __('Enter preset name', 'visualcomposer'),
            'saveTemplate' => __('Save Template', 'visualcomposer'),
            'removeTemplate' => __('Remove Template', 'visualcomposer'),
            'templateSaveFailed' => __('Failed to save the template.', 'visualcomposer'),
            'downloadMoreTemplates' => __('Download More Templates', 'visualcomposer'),
            'getMoreElements' => __('Get More Elements', 'visualcomposer'),
            'getMoreTemplates' => __('Get More Templates', 'visualcomposer'),
            'noTemplatesFound' => __(
            // @codingStandardsIgnoreLine
                'There are no templates yet. Save the current layout as a template or download templates from Visual Composer Hub.',
                'visualcomposer'
            ),
            'notRightTemplatesFound' => __(
                'Didn\'t find the right template? Check out Visual Composer Hub for more templates.',
                'visualcomposer'
            ),
            'accessVisualComposerHubToDownload' => __(
                'Access the Visual Composer Hub - download additional elements, blocks, templates, and addons.',
                'visualcomposer'
            ),
            'removeTemplateWarning' => __('Do you want to remove this template?', 'visualcomposer'),
            'removeElementPresetWarning' => __('Do you want to remove this element preset?', 'visualcomposer'),
            'templateRemoveFailed' => __('Failed to remove the template', 'visualcomposer'),
            'blankPageHeadingSelect' => __('Name Your Page, Select', 'visualcomposer'),
            'blankPageHeadingPart1' => __('Name The Page', 'visualcomposer'),
            'blankPageHeadingPart2' => __('Layout and Start Building', 'visualcomposer'),
            'blankPageTitleHeadingPart1' => __('Name Your ', 'visualcomposer'),
            'blankPageTitleHeadingPart2' => __('and Start Building', 'visualcomposer'),
            'blankPageHelperText' => __(
            // @codingStandardsIgnoreLine
                'Start by adding an element to the layout or select one of the pre-defined templates.',
                'visualcomposer'
            ),
            'blankPageInputPlaceholderText' => __('Page title', 'visualcomposer'),
            "blankHeaderTitle" => __('Design your header here as a part of your layout. You can also download header templates from the Visual Composer Hub.', 'visualcomposer'),
            "blankFooterTitle" => __('Design your footer here as a part of your layout. You can also download footer templates from the Visual Composer Hub.', 'visualcomposer'),
            'addTemplateHelperText' => __(
            // @codingStandardsIgnoreLine
                'Didn\'t find a perfect template? Get a premium license to download templates from the Visual Composer Hub.',
                'visualcomposer'
            ),
            'addElementHelperText' => __(
            // @codingStandardsIgnoreLine
                'Didn\'t find an element? Get a premium license to download elements from the Visual Composer Hub.',
                'visualcomposer'
            ),
            'hubHelperText' => __(
            // @codingStandardsIgnoreLine
                'Get a premium license to access Visual Composer Hub. Download professionally designed templates, more content elements, extensions, and more.',
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
            'searchContentElements' => __('Search for content elements', 'visualcomposer'),
            'searchContentTemplates' => __('Search for templates', 'visualcomposer'),
            'searchWithinCategory' => __('Search within this category', 'visualcomposer'),
            'templateAlreadyExists' => __(
                'A template with this name already exists. Choose a different template name.',
                'visualcomposer'
            ),
            'templateContentEmpty' => __('There is no content on the page to be saved.', 'visualcomposer'),
            'specifyTemplateName' => __('Enter the template name to save this page as a template.', 'visualcomposer'),
            'addOneColumn' => __('Add one column', 'visualcomposer'),
            'addTwoColumns' => __('Add two columns', 'visualcomposer'),
            'addThreeColumns' => __('Add three columns', 'visualcomposer'),
            'addFourColumns' => __('Add four columns', 'visualcomposer'),
            'addFiveColumns' => __('Add five columns', 'visualcomposer'),
            'addCustomRowLayout' => __('Add custom row layout', 'visualcomposer'),
            'addTextBlock' => __('Add a text block', 'visualcomposer'),
            'frontendEditor' => __('Edit with Visual Composer', 'visualcomposer'),
            'classicEditor' => __('Classic Editor', 'visualcomposer'),
            'openFrontendEditorFromClassic' => __(
            // @codingStandardsIgnoreLine
                'You are switching to Visual Composer. Visual Composer will load the latest version of the content created with the website builder.',
                'visualcomposer'
            ),
            'enableClassicEditorConfirmMessage' => __(
            // @codingStandardsIgnoreLine
                'You are switching to the Classic Editor. The content created with Visual Composer will be copied to Classic Editor (style changes may apply). Any changes made in the Classic Editor will not be synced with the Visual Composer layout. Do you want to proceed?',
                'visualcomposer'
            ),
            'blankPage' => __('Blank Page', 'visualcomposer'),
            'searchTemplates' => __('Search for templates by name and description', 'visualcomposer'),
            'noResultOpenHub' => __('Open Visual Composer Hub', 'visualcomposer'),
            'notRightElementsFound' => __(
                'Didn\'t find an element? Check the Visual Composer Hub for more elements.',
                'visualcomposer'
            ),
            'activationFailed' => __(
                'An error occurred during the Visual Composer extension download process.
<ul><li>- Check if your server has a connection to the Internet.</li><li>- Check if your server proxy has proper configuration settings.</li><li>- Check your server firewall settings and access to https://my.visualcomposer.com</li><li>- Check if your server has access to the <a href="https://aws.amazon.com/ru/premiumsupport/knowledge-center/s3-find-ip-address-ranges/" target="_blank" rel="noopener noreferrer">Amazon AWS Region: `us-west-2` IP</a></li></ul>',
                'visualcomposer'
            ),
            'alreadyHaveALicenseText' => __(
                'Already have a license? Log in to <a href="{link}" class="vcv-activation-input-field-forgot-license-link" target="_blank" rel="noopener noreferrer">My Visual Composer</a> to find it.',
                'visualcomposer'
            ),
            'doMoreWithVcText' => __(
                'Do more with the Visual Composer Hub',
                'visualcomposer'
            ),
            'nothingFound' => __('Nothing found', 'visualcomposer'),
            'addImage' => __('Add an image', 'visualcomposer'),
            'removeImage' => __('Remove the image', 'visualcomposer'),
            'moveImage' => __('Move the image', 'visualcomposer'),
            'editReplaceImage' => __('Edit or replace the image', 'visualcomposer'),
            'addVideo' => __('Add a video', 'visualcomposer'),
            'removeVideo' => __('Remove the video', 'visualcomposer'),
            'moveVideo' => __('Move the video', 'visualcomposer'),
            'editReplaceVideo' => __('Edit or replace the video', 'visualcomposer'),
            'addLink' => __('Add a link', 'visualcomposer'),
            'selectUrl' => __('Select a URL', 'visualcomposer'),
            'insertEditLink' => __('Insert or edit a link', 'visualcomposer'),
            'linkToExistingContent' => __('Or link to an existing content', 'visualcomposer'),
            'searchExistingContent' => __('Search existing content', 'visualcomposer'),
            'popup' => __('Popup', 'visualcomposer'),
            'selectPopupTemplate' => __('Select a popup template', 'visualcomposer'),
            'onPageLoad' => __('Popup on every page load', 'visualcomposer'),
            'onExitIntent' => __('Popup on exit-intent', 'visualcomposer'),
            'onElementId' => __('Popup on element ID', 'visualcomposer'),
            'delayInSeconds' => __('Delay (seconds)', 'visualcomposer'),
            'showEveryDays' => __('Show every (days)', 'visualcomposer'),
            'popupOpenOnPageLoad' => __('The popup will open once the page is loaded.', 'visualcomposer'),
            'popupOpenOnExitIntent' => __('The popup will load if a user tries to exit the page.', 'visualcomposer'),
            'popupOpenOnElementId' => __(
                'The popup will appear when an element with a unique Element ID will be displayed (scrolled to) on the page.',
                'visualcomposer'
            ),
            'onClickAction' => __('OnClick action', 'visualcomposer'),
            'noExistingContentFound' => __('Nothing found', 'visualcomposer'),
            'openLinkInTab' => __('Open the link in a new tab', 'visualcomposer'),
            'addNofollow' => __('Add "nofollow" option to the link', 'visualcomposer'),
            'enterDestinationUrl' => __('Enter the destination URL', 'visualcomposer'),
            'titleAttributeText' => __('The title attribute will be displayed on the link hover.', 'visualcomposer'),
            'title' => __('Title', 'visualcomposer'),
            'excerpt' => __('Excerpt', 'visualcomposer'),
            'bundleUpdateFailed' => __('Visual Composer Hub update failed, try again.', 'visualcomposer'),
            'preview' => __('Preview', 'visualcomposer'),
            'previewChanges' => __('Preview Changes', 'visualcomposer'),
            'savingResults' => __('Saving Results', 'visualcomposer'),
            'hideOff' => __('Hide Element', 'visualcomposer'),
            'hideOn' => __('Show Element', 'visualcomposer'),
            'elementIsHidden' => __('Element is Hidden', 'visualcomposer'),
            'editFormSettingsText' => __('Element Settings', 'visualcomposer'),
            'editRowSettingsText' => __('Block Template', 'visualcomposer'),
            'presetsHelperText' => __(
                'Change the default parameters to create a unique element. The new element will be added to your library.',
                'visualcomposer'
            ),
            'saveAsPreset' => __('Save as a Preset', 'visualcomposer'),
            'saveAsTemplate' => __('Save as a Template', 'visualcomposer'),
            'downloadingInitialExtensions' => __('Downloading initial extensions', 'visualcomposer'),
            'downloadingAssets' => __('Downloading assets {i} of {cnt}: {name}', 'visualcomposer'),
            'downloading' => __('Downloading', 'visualcomposer'),
            'postUpdateText' => __('Updating posts {i} in {cnt}: {name}', 'visualcomposer'),
            'postUpdateAjaxRequestError' => __('Failed to load: {file}', 'visualcomposer') . ' #10077',
            'none' => __('None', 'visualcomposer'),
            'mobileTooltipText' => __(
            // @codingStandardsIgnoreLine
                'Double-tap on an element to open the edit window. Tap and hold to initiate drag and drop.',
                'visualcomposer'
            ),
            'template' => __('Template', 'visualcomposer'),
            'defaultTemplate' => __('Theme Default', 'visualcomposer'),
            'pageTemplateDescription' => __(
                'To apply a template save changes and reload the page.',
                'visualcomposer'
            ),
            'pageTemplateReloadDescription' => __(
                'To apply title, save changes, and reload the page.',
                'visualcomposer'
            ),
            'pageTitleDescription' => __(
                'To apply title changes save changes and reload the page',
                'visualcomposer'
            ),
            'pageTitleDisableDescription' => __('Disable the page title', 'visualcomposer'),
            'successElementDownload' => __(
                '{name} has been successfully downloaded from the Visual Composer Hub and added to your content library.',
                'visualcomposer'
            ),
            'successAddonDownload' => __(
                '{name} has been successfully downloaded from the Visual Composer Hub and added to your content library. To finish the installation process reload the page.',
                'visualcomposer'
            ),
            'copyElementWithId' => __(
                'The element was copied without a unique Element ID. Adjust the Element ID by editing the element.',
                'visualcomposer'
            ),
            'cloneElementWithId' => __(
                'The element was cloned without a unique Element ID. Adjust the Element ID by editing the element.',
                'visualcomposer'
            ),
            'licenseErrorElementDownload' => __(
                'Failed to download the element (license expired or request timed out)',
                'visualcomposer'
            ),
            'defaultErrorElementDownload' => __('Failed to download the element', 'visualcomposer'),
            'feOopsMessageDefault' => __(
            // @codingStandardsIgnoreLine
                'It seems that something went wrong with loading the content. Make sure you are loading the correct content and try again.',
                'visualcomposer'
            ),
            'feOopsButtonTextDefault' => __('Return to WordPress dashboard', 'visualcomposer'),
            'feOopsTryAgainButtonText' => __('Try Again', 'visualcomposer'),
            'feOopsReportAnIssueButtonText' => __('Report an Issue', 'visualcomposer'),
            'feOopsMessagePageForPosts' => __(
            // @codingStandardsIgnoreLine
                'It seems you are trying to edit the archive page which displays post archives instead of content. Before the edit, make sure to convert it to a static page via your WordPress admin.',
                'visualcomposer'
            ),
            'feOopsButtonTextPageForPosts' => __('Return to WordPress dashboard', 'visualcomposer'),
            'replaceElementText' => __(
                'Replace the {elementLabel} within this element with another {elementLabel} from the Element Library.',
                'visualcomposer'
            ),
            'replaceElementEditForm' => __(
                'Replace the element with a different element from the same category.',
                'visualcomposer'
            ),
            'errorReportSubmitted' => __(
                'We have received your request - the ticket has been created. Our support representative will contact you shortly.',
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
                // translators: %1$s: Plugin url, %2$s: Plugin version
                __(
                    'You have an outdated version of Visual Composer that requires an update. Update the plugin to get new features, improve performance, avoid compatibility issues, and keep your site secure. <a href="%1$s">Update now</a> to version %2$s.',
                    'visualcomposer'
                ),
                self_admin_url('plugins.php'),
                $wpHelper->getUpdateVersionFromWordpressOrg()
            ),
            'chooseHFS' => sprintf(
                // translators: %1$s: {name}, %2$s: url to {link}, %3$s: </a>
                __(
                    'Select a %1$s or %2$screate a new one%3$s.',
                    'visualcomposer'
                ),
                '{name}',
                '<a href="{link}" target="_blank" rel="noopener noreferrer">',
                '</a>'
            ),
            'selectHFS' => __(
                'Default',
                'visualcomposer'
            ),
            'selectHFSGlobal' => __(
                'Global Default',
                'visualcomposer'
            ),
            'selectHFSLayout' => __(
                'Layout Default',
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
            'addonDownloadRequiresUpdate' => __(
                'Update Visual Composer plugin to the most recent version to download this addon.',
                'visualcomposer'
            ),
            'startBuildingHFSButton' => __('Start Building', 'visualcomposer'),
            'startPageHFSInputPlaceholder' => sprintf(
                // translators: %s: {name}
                __(
                    '%s Name',
                    'visualcomposer'
                ),
                '{name}'
            ),
            'themeDefaultDescription' => __(
                'WordPress theme defined layout for a specific page, post, or custom post type.',
                'visualcomposer'
            ),
            'vcBoxedDescription' => __(
                'A blank page layout with a boxed content area in the middle of the page without header, footer, or sidebar.',
                'visualcomposer'
            ),
            'vcBlankDescription' => __(
                'A full-width blank page without header, footer, or sidebar.',
                'visualcomposer'
            ),
            'vcDefaultDescription' => __(
                'A default layout for the post type created in the Visual Composer Theme Builder.',
                'visualcomposer'
            ),
            'vcThemeHeaderFooterDescription' => __(
                'A default layout with custom header, content, and footer area.',
                'visualcomposer'
            ),
            'vcThemeHeaderFooterSidebarDescription' => __(
                'A default layout with custom header, content, footer, and sidebar area on the right.',
                'visualcomposer'
            ),
            'vcThemeHeaderFooterLeftSidebarDescription' => __(
                'A default layout with custom header, content, footer, and sidebar area on the left.',
                'visualcomposer'
            ),
            'availableInPremium' => __(
                'Available in the Premium version.',
                'visualcomposer'
            ),
            'gutenbergDoesntWorkProperly' => __(
                "Gutenberg plugin doesn't work properly. Check the Gutenberg plugin.",
                'visualcomposer'
            ),
            'free' => __('Free', 'visualcomposer'),
            'premium' => __('Premium', 'visualcomposer'),
            'removeAll' => __('Remove All', 'visualcomposer'),
            'continueImport' => __('Continue importing', 'visualcomposer'),
            'backToImport' => __('Back to import', 'visualcomposer'),
            'startingImportProcess' => __('Starting import process...', 'visualcomposer'),
            'backToParent' => __('Back to parent', 'visualcomposer'),
            'back' => __('Back', 'visualcomposer'),
            'manageContentInYourLibrary' => __('Manage content in your library', 'visualcomposer'),
            'thisElementCantBeDeleted' => __('This element can’t be deleted', 'visualcomposer'),
            'editorSettings' => __('Editor Settings', 'visualcomposer'),
            'clickToEditColumnValue' => __('Click to edit column value', 'visualcomposer'),
            'addOn' => __('Addon', 'visualcomposer'),
            'doNotCloseWhileUpdateText' => __(
                'Don\'t close this window while the download is in progress.',
                'visualcomposer'
            ),
            'createYourWordpressWebsite' => __('Create Your WordPress Website Today.', 'visualcomposer'),
            'startEasyBuildFast' => __('Start Easy. Build Fast.', 'visualcomposer'),
            'skipThisPostText' => __('Skip this post', 'visualcomposer'),
            'getMoreText' => __('Do More With Visual Composer', 'visualcomposer'),
            'getMoreTextSubText' => __('Premium', 'visualcomposer'),
            'downloadFromHubText' => __('Get unlimited access to the Visual Composer Hub with 500+ elements, templates, addons, and integrations.', 'visualcomposer'),
            'getStartedText' => __('Get Started', 'visualcomposer'),
            'sendingErrorReport' => __('Sending Error Report', 'visualcomposer'),
            'doNotCloseWhileSendingErrorReportText' => __(
                'Don\'t close this window while sending an error is in the process.',
                'visualcomposer'
            ),
            'somethingWentWrong' => __('Oops ... Something Went Wrong', 'visualcomposer'),
            'goToHubButtonDescription' => __(
                'Access the Visual Composer Hub - download additional elements, blocks, templates, and addons.',
                'visualcomposer'
            ),
            'settingsGlobalTemplateCustomJsLocal' => __(
                'Add custom JavaScript code to insert it locally on this page in <footer>. Insert Google Analytics, Tag Manager, Kissmetrics, or other JavaScript code snippets.',
                'visualcomposer'
            ),
            'settingsCustomJsLocal' => __(
                'Add custom JavaScript code to insert it locally on this page in <header> or <footer>. Insert Google Analytics, Tag Manager, Kissmetrics, or other JavaScript code snippets.',
                'visualcomposer'
            ),
            'settingsCustomJsGlobal' => __(
                'Add custom JavaScript code to insert it globally on every page in <header> or <footer>. Insert Google Analytics, Tag Manager, Kissmetrics, or other JavaScript code snippets.',
                'visualcomposer'
            ),
            'openEditForm' => __('Open the Edit Form', 'visualcomposer'),
            'shortcode' => __(
                'Shortcode',
                'visualcomposer'
            ),
            'shortcodeElementAttrDescription' => __(
                'Paste shortcode with all the parameters. The shortcode must be installed on your WordPress site via a plugin or theme.',
                'visualcomposer'
            ),
            'activatePremium' => __(
                'Activate Premium',
                'visualcomposer'
            ),
            'searchPhotosOnUnsplash' => __(
                'Search for free high-resolution photos on Unsplash',
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
                'No access, check your license.',
                'visualcomposer'
            ),
            'noConnectionToUnsplash' => __(
                'Could not connect to Unsplash Server.',
                'visualcomposer'
            ),
            'imageDownloadedToMediaLibrary' => __(
                'The image has been downloaded to the Media Library.',
                'visualcomposer'
            ),
            'couldNotParseData' => __(
                'Could not parse data from the server.',
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
                'Download images from Unsplash to the Media Library',
                'visualcomposer'
            ),
            'permalink' => __(
                'Permalink',
                'visualcomposer'
            ),
            'spreadTheWordText' => __(
                'Enjoying Visual Composer Website Builder? Let your friends know about it - spread the word.',
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
            'downloadDynamicContent' => __(
                'Download Dynamic Content Addon',
                'visualcomposer'
            ),
            'dynamicAutocompleteDescription' => __(
                'Select a page, post, or custom post type as the dynamic content source.',
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
                'Select a custom field',
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
                'Activate Premium to Unlock Unsplash',
                'visualcomposer'
            ),
            'getAccessToTheVisualComposerHub' => __(
                'Get Access to the Visual Composer Hub',
                'visualcomposer'
            ),
            'freeLicense' => __(
                'Free License (Your plan)',
                'visualcomposer'
            ),
            'themeBuilderWithHFS' => __(
                'A theme builder with Header, Footer, and Sidebar editor',
                'visualcomposer'
            ),
            'wooCommerceCompatibility' => __(
                'WooCommerce compatibility',
                'visualcomposer'
            ),
            'premiumSupportAndUpdates' => __(
                'Premium support and updates',
                'visualcomposer'
            ),
            'premiumSupport' => __(
                'Premium support',
                'visualcomposer'
            ),
            'regularUpdates' => __(
                'Regular updates',
                'visualcomposer'
            ),
            'activateFree' => __(
                'I Want a Free License',
                'visualcomposer'
            ),
            'premiumLicense' => __(
                'Premium License',
                'visualcomposer'
            ),
            'unlimitedAccessToExtensions' => __(
                'Unlimited access to the Visual Composer Hub of elements, templates, and addons',
                'visualcomposer'
            ),
            'limitedAccessToExtensions' => __(
                'Limited access to the Visual Composer Hub of elements, templates, and addons',
                'visualcomposer'
            ),
            'iWantToGoPremium' => __(
                'I want to go premium',
                'visualcomposer'
            ),
            'editThemeTemplate' => sprintf(
                // translators: %1$s: {editLink} url, %2$s: </a>, %3$s: {linkTitle}, %4$s: {createLink} url, %5$s: </a>
                __(
                    '%1$sEdit%2$s this %3$s or %4$screate%5$s a new one.',
                    'visualcomposer'
                ),
                '<a href="{editLink}" target="_blank" rel="noopener noreferrer">',
                '</a>',
                '{linkTitle}',
                '<a href="{createLink}" target="_blank" rel="noopener noreferrer">',
                '</a>'
            ),
            'createThemeTemplate' => sprintf(
                // translators: %1$s: {createLink} url, %2$s: </a>, %3$s: {linkTitle}
                __(
                    '%1$sCreate%2$s a new %3$s.',
                    'visualcomposer'
                ),
                '<a href="{createLink}" target="_blank" rel="noopener noreferrer">',
                '</a>',
                '{linkTitle}'
            ),
            'enterYourLicenseKey' => __(
                'Enter your license key',
                'visualcomposer'
            ),
            'elementHasBeenSaved' => __(
                'The element has been successfully saved.',
                'visualcomposer'
            ),
            'elementNameAlreadyExists' => __(
                'The element with such a name already exists!',
                'visualcomposer'
            ),
            'enterPresetNameToSave' => __(
                'Enter a preset name to save the element as a preset!',
                'visualcomposer'
            ),
            'templateSaved' => __(
                'The template has been successfully saved.',
                'visualcomposer'
            ),
            'templateRemoved' => __(
                'The template has been successfully removed.',
                'visualcomposer'
            ),
            'templateHelperText' => __(
                'Change the default parameters of the section to save it as a unique block template. The new block template will be added to your library.',
                'visualcomposer'
            ),
            'presetRemovedText' => __(
                'Element preset has been removed.',
                'visualcomposer'
            ),
            'feedbackVoteHeadingText' => __(
                'How disappointed would you be if this product no longer existed tomorrow?',
                'visualcomposer'
            ),
            'veryDisappointed' => __(
                'Very disappointed',
                'visualcomposer'
            ),
            'somewhatDisappointed' => __(
                'Somewhat disappointed',
                'visualcomposer'
            ),
            'disappointed' => __(
                'Not disappointed (it really isn’t that useful)',
                'visualcomposer'
            ),
            'feedbackVoteButtonText' => __(
                'Submit Your Feedback',
                'visualcomposer'
            ),
            'negativeReviewHeadingText' => __(
                'How can we become better?',
                'visualcomposer'
            ),
            'positiveReviewText' => __(
                'Thanks for your feedback. Please rate us on WordPress.org and help others to discover Visual Composer.',
                'visualcomposer'
            ),
            'negativeReviewText' => __(
                'Your opinion matters. Help us to improve by taking a quick survey.',
                'visualcomposer'
            ),
            'positiveReviewButtonText' => __(
                'Write Your Review',
                'visualcomposer'
            ),
            'negativeReviewButtonText' => __(
                'Leave Your Feedback',
                'visualcomposer'
            ),
            'likeText' => __(
                'Like',
                'visualcomposer'
            ),
            'dislikeText' => __(
                'Dislike',
                'visualcomposer'
            ),
            'replacePopupTemplateText' => __(
                'The current popup will be replaced with the popup template.',
                'visualcomposer'
            ),
            // Plugin deactivation popup section
            'quickFeedback' => __(
                'QUICK FEEDBACK',
                'visualcomposer'
            ),
            'pleaseShareWhy' => __(
                'If you have a moment, please share why you are deactivating Visual Composer:',
                'visualcomposer'
            ),
            'noLongerNeed' => __(
                'I no longer need the plugin',
                'visualcomposer'
            ),
            'foundABetterPlugin' => __(
                'I found a better plugin',
                'visualcomposer'
            ),
            'pleaseShareWhichPlugin' => __(
                'Please share which plugin',
                'visualcomposer'
            ),
            'couldntGetThePluginToWork' => __(
                'I couldn\'t get the plugin to work',
                'visualcomposer'
            ),
            'itsATemporaryDeactivation' => __(
                'It\'s a temporary deactivation',
                'visualcomposer'
            ),
            'other' => __(
                'Other',
                'visualcomposer'
            ),
            'pleaseShareTheReason' => __(
                'Please share the reason',
                'visualcomposer'
            ),
            'submitAndDeactivate' => __(
                'Submit &amp; Deactivate',
                'visualcomposer'
            ),
            'skipAndDeactivate' => __(
                'Skip &amp; Deactivate',
                'visualcomposer'
            ),
            'downloadAddonText' => __(
                'Download Addon',
                'visualcomposer'
            ),
            'installedText' => __(
                'Installed',
                'visualcomposer'
            ),
            'availableInPremiumText' => __(
                'Available in Premium',
                'visualcomposer'
            ),
            'dontForgetToTweetText' => __(
                'Don\'t forget to tweet about Visual Composer Website Builder. Thanks!',
                'visualcomposer'
            ),
            'download' => __(
                'Download',
                'visualcomposer'
            ),
            'install' => __(
                'Install',
                'visualcomposer'
            ),
            'activate' => __(
                'Activate',
                'visualcomposer'
            ),
            'takeTutorialTemplate' => __(
                'Try The Tutorial Template',
                'visualcomposer'
            ),
            'buildYourSiteWithDragAndDrop' => __(
                'Build your site with the help of the drag and drop builder and without coding - it\'s that easy.',
                'visualcomposer'
            ),
            // translators: %1$1s: activate, %2$2s: go premium
            'alreadyHaveLicenseText' => __(
                'Already have a Premium license? %1$1s or %2$2s.',
                'visualcomposer'
            ),
            'alreadyHaveLicenseTextOneAction' => __(
                'Already have a Premium license?',
                'visualcomposer'
            ),
            'activateHere' => __(
                'Activate here',
                'visualcomposer'
            ),
            'goPremiumLcFirst' => __(
                'go Premium',
                'visualcomposer'
            ),
            'bundledInAThemeText' => __(
                'It seems that your copy of Visual Composer was bundled in a theme - use your Envato purchase key to activate Visual Composer Premium. You can also activate Visual Composer with a free or premium license.',
                'visualcomposer'
            ),
            'lockElementText' => __(
                'Lock Element',
                'visualcomposer'
            ),
            'unlockElementText' => __(
                'Unlock Element',
                'visualcomposer'
            ),
            'url' => __(
                'URL',
                'visualcomposer'
            ),
            'openPopup' => __(
                'Open Popup',
                'visualcomposer'
            ),
            'closePopup' => __(
                'Close Popup',
                'visualcomposer'
            ),
            'closingThePopupDescription' => __(
                'Closing the popup option will close the current popup.',
                'visualcomposer'
            ),
            'lockedElementText' => __(
                'The element has been locked by your site Administrator.',
                'visualcomposer'
            ),
            'elementsLock' => __(
                'Element Lock',
                'visualcomposer'
            ),
            'lockAllText' => __(
                'Lock All Elements',
                'visualcomposer'
            ),
            'unlockAllText' => __(
                'Unlock All Elements',
                'visualcomposer'
            ),
            'lockAllDescriptionText' => __(
                'Lock or unlock all elements on your page. Your user roles with Administrator access will be able to edit elements.',
                'visualcomposer'
            ),
            'lockSpecificDescriptionText' => __(
                'You can lock/unlock specific elements under the element Edit window.',
                'visualcomposer'
            ),
            'lockAllNotificationText' => __(
                'All elements on the page have been locked. Only the Administrator role can edit the content.',
                'visualcomposer'
            ),
            'unlockAllNotificationText' => __(
                'All elements on the page have been unlocked. All users with the edit option can edit the content.',
                'visualcomposer'
            ),
            'lockElementNotificationText' => __(
                'The element has been locked and can be edited only by users with editing locked elements permission.',
                'visualcomposer'
            ),
            'unlockElementNotificationText' => __(
                'The element has been unlocked and can be edited by all roles with the edit option.',
                'visualcomposer'
            ),
            'lockContainerNotificationText' => __(
                'The element and all inner elements have been locked and can be edited only by users with editing locked elements permission.',
                'visualcomposer'
            ),
            'unlockContainerNotificationText' => __(
                'The element and all inner elements have been unlocked and can be edited by all roles with the edit option.',
                'visualcomposer'
            ),
            'unsavedChangesText' => __(
                'Changes may not be saved.',
                'visualcomposer'
            ),
            'VCInsights' => __(
                'Visual Composer Insights',
                'visualcomposer'
            ),
            'insightsAndNotifications' => __(
                'Insights & Notifications',
                'visualcomposer'
            ),
            'all' => __(
                'All',
                'visualcomposer'
            ),
            'critical' => __(
                'Critical',
                'visualcomposer'
            ),
            'warnings' => __(
                'Warnings',
                'visualcomposer'
            ),
            'success' => __(
                'Success',
                'visualcomposer'
            ),
            'insightsImageSizeBigTitle' => __(
                'Image size exceeded',
                'visualcomposer'
            ),
            'insightsBgImageSizeBigTitle' => __(
                'Background Image size exceeded',
                'visualcomposer'
            ),
            // translators: %s: image size
            'insightsImageSizeBigDescription' => __(
                'The image size exceeds %s. This may impact the page\'s performance and SEO ranking.',
                'visualcomposer'
            ),
            'insightsImageAltAttributeMissingTitle' => __(
                'The image ALT attribute is missing',
                'visualcomposer'
            ),
            'insightsImageAltAttributeMissingDescription' => __(
                'Missing the ALT attribute for the image. This may impact the SEO ranking of the page.',
                'visualcomposer'
            ),
            'insightsH1MissingTitle' => __(
                'H1 title missing on the page',
                'visualcomposer'
            ),
            'insightsH1MissingDescription' => __(
                'The page is missing the H1 tag. This may impact the SEO ranking of the page.',
                'visualcomposer'
            ),
            'insightsH1ExistsTitle' => __(
                'H1 title exists on the page',
                'visualcomposer'
            ),
            'insightsH1ExistsDescription' => __(
                'The page has an H1 tag. Great job!',
                'visualcomposer'
            ),
            'insightsMultipleH1Title' => __(
                'More than one H1 tag found',
                'visualcomposer'
            ),
            'insightsMultipleH1Description' => __(
                'You have more than one H1 tag on your page which is bad for SEO ranking. Make sure to keep only one H1 and use lower-level headings (H2, H3, etc.) to structure your content.',
                'visualcomposer'
            ),
            'insightsImageAltAttributeExistsTitle' => __(
                'All images have ALT attributes',
                'visualcomposer'
            ),
            'insightsImageAltAttributeExistsDescription' => __(
                'All images have ALT attributes. Great Job!',
                'visualcomposer'
            ),
            'insightsImagesSizeProperTitle' => __(
                'All images have optimal sizes',
                'visualcomposer'
            ),
            'insightsImagesSizeProperDescription' => __(
                'All images have optimal sizes. Awesome!',
                'visualcomposer'
            ),
            'insightsNoContentOnPageTitle' => __(
                'No content found',
                'visualcomposer'
            ),
            'insightsNoContentOnPageDescription' => __(
                'It seems this page has no content. Make sure to add elements or templates.',
                'visualcomposer'
            ),
            'insightsNoCriticalIssuesFoundTitle' => __(
                'No Critical Issues Found',
                'visualcomposer'
            ),
            'insightsNoCriticalIssuesFoundDescription' => __(
                'There are no critical issues on the page. Congratulations and keep up the good work!',
                'visualcomposer'
            ),
            'insightsNoWarningsFoundTitle' => __(
                'No Warnings Found',
                'visualcomposer'
            ),
            'insightsNoWarningsFoundDescription' => __(
                'There are no warnings on the page. Congratulations and keep up the good work!',
                'visualcomposer'
            ),
            'insightsParagraphLengthTitle' => __(
                'Paragraph length',
                'visualcomposer'
            ),
            'insightsParagraphLengthDescription' => __(
                'Paragraph word count is',
                'visualcomposer'
            ),
            'insightsParagraphLengthDescriptionOk' => __(
                'You set a proper length for the paragraphs. Great job!',
                'visualcomposer'
            ),
            'insightsParagraphLengthDescription150' => __(
                'The paragraph contains more than 150 words. This may affect readability.',
                'visualcomposer'
            ),
            'insightsParagraphLengthDescription200' => __(
                'The paragraph contains more than 200 words. This may affect readability.',
                'visualcomposer'
            ),
            'insightsTitleTooLong' => __(
                'The page title is too long.',
                'visualcomposer'
            ),
            'insightsTitleTooLong60' => __(
                'The page title exceeds 60 characters which are considered too long. Make sure to adjust it between 10 to 60 characters.',
                'visualcomposer'
            ),
            'insightsTitleTooLong100' => __(
                'The page title contains more than 100 characters and will be cut off by search engines. Shorten your page title!',
                'visualcomposer'
            ),
            'insightsTitleTooShort' => __(
                'The page title is too short.',
                'visualcomposer'
            ),
            'insightsTitleTooShortDescription' => __(
                'The page title is too short. Make sure to adjust the title between 10 to 60 characters.',
                'visualcomposer'
            ),
            'insightsTitleGood' => __(
                'The page title length is optimal.',
                'visualcomposer'
            ),
            'noIndexMetaTag' => __(
                'It seems that this page is set to "noindex" directive.',
                'visualcomposer'
            ),
            'noIndexMetaTagDescription' => __(
                'Using "noindex" will exclude this page from search results. If you have set "noindex" on purpose, ignore this warning.',
                'visualcomposer'
            ),
            'insightsGAMissingTitle' => __(
                'Google Analytics Tag is missing.',
                'visualcomposer'
            ),
            'insightsGAMissingTitleOK' => __(
                'Google Analytics Tag is added to the page.',
                'visualcomposer'
            ),
            'insightsGAMissingDescription' => __(
                'It seems Google Analytics Tags is not added to the page.',
                'visualcomposer'
            ),
            'insightsGAMissingDescriptionOK' => __(
                'Google Analytics Tag is added to the page. Great job!',
                'visualcomposer'
            ),
            'insightsContentLengthTitle' => __(
                'Text length',
                'visualcomposer'
            ),
            'insightsContentLengthDescription300' => __(
                'The text contains %length words. This is far below the recommended minimum of 300 words.',
                'visualcomposer'
            ),
            'insightsContentLengthDescriptionOk' => __(
                'The text contains %length words. Good job!',
                'visualcomposer'
            ),
            'insightsLinksDoNotHaveName' => __(
                'Links do not have a discernible name',
                'visualcomposer'
            ),
            'insightsLinksDoNotHaveNameDescription' => __(
                'Link text (and alternate text for images, when used as links) that is discernible, unique, and focusable improves the navigation experience for screen reader users.',
                'visualcomposer'
            ),
            // translators: %s: link
            'insightsLinkDoNotHaveDiscernibleName' => __(
                'Link do not have a discernible name %s',
                'visualcomposer'
            ),
            'insightsAllLinksHaveText' => __(
                'All links have customized link text',
                'visualcomposer'
            ),
            'insightsAllLinksHaveTextDescription' => __(
                'Replacing raw URLs with specific linked text improves user experience.',
                'visualcomposer'
            ),
            'noInboundLinks' => __(
                'No internal links appear on the page.',
                'visualcomposer'
            ),
            'noInboundLinksDescription' => __(
                'There are no internal links on the page. Add some!',
                'visualcomposer'
            ),
            'noOutboundLinks' => __(
                'No external links appear on the page.',
                'visualcomposer'
            ),
            'noOutboundLinksDescription' => __(
                'There are no external links to the page. Add some!',
                'visualcomposer'
            ),
            // translators: %element: element
            'onlyOneElementCanBeAddedToPage' => __(
                'Only one %element element can be added to the page.',
                'visualcomposer'
            ),
            // translators: %element: element
            'onlyTwoElementsCanBeAddedToPage' => __(
                'Only two %element elements can be added to the page.',
                'visualcomposer'
            ),
            // translators: %element: element
            'onlyThreeElementsCanBeAddedToPage' => __(
                'Only three %element elements can be added to the page.',
                'visualcomposer'
            ),
            // translators: %element: element
            'onlyFourElementsCanBeAddedToPage' => __(
                'Only four %element elements can be added to the page.',
                'visualcomposer'
            ),
            // translators: %element: element
            'onlyFiveElementsCanBeAddedToPage' => __(
                'Only five %element elements can be added to the page.',
                'visualcomposer'
            ),
            'elementLimitDefaultText' => sprintf(
                // translators: %element: element, %count: count
                __(
                    'Only %1$scount %2$selement elements can be added to the page.',
                    'visualcomposer'
                ),
                '%',
                '%'
            ),
            'headerAreaPlaceholderText' => __(
                'This is your header area placeholder - page or post header will be displayed here.',
                'visualcomposer'
            ),
            'contentAreaPlaceholderText' => __(
                'This is your content area placeholder - page or post content will be displayed here.',
                'visualcomposer'
            ),
            'sidebarAreaPlaceholderText' => __(
                'This is your sidebar area placeholder - page or post sidebar will be displayed here.',
                'visualcomposer'
            ),
            'footerAreaPlaceholderText' => __(
                'This is your footer area placeholder - page or post header will be displayed here.',
                'visualcomposer'
            ),
            'activateHub' => __(
                'Activate Hub',
                'visualcomposer'
            ),
            'activateYourPremiumLicenseText' => __(
                'Activate Your Premium License',
                'visualcomposer'
            ),
            'makeTheFinalStep' => __(
                'Make the final step! Enter your license key to activate Visual Composer Premium and get full access to the Visual Composer Hub.',
                'visualcomposer'
            ),
            'commentsAreaPlaceholderText' => __(
                'Define a comments area for a post or page layout.',
                'visualcomposer'
            ),
            'contentElementMissingNotification' => __(
                'The content area is missing for your layout. Make sure to add the Content Area element to specify the place in your layout where the page or post content will be displayed.',
                'visualcomposer'
            ),
            'templateContainsLimitElement' => sprintf(
            // translators: %element: element name
                __(
                    'The template you want to add contains %1$selement element. You already have %2$selement element added - remove it before adding the template.',
                    'visualcomposer'
                ),
                '%',
                '%'
            ),
            'getGiphiesWithPremiumText' => __(
                'Download and Add Free Animated GIFs to Your Site With Visual Composer Premium',
                'visualcomposer'
            ),
            'getGiphiesText' => __(
                'Download and Add Free Animated GIFs to Your Site',
                'visualcomposer'
            ),
            'noConnectionToGiphy' => __(
                'Could not connect to Giphy Server!',
                'visualcomposer'
            ),
            'discoverGifAnimationsText' => __(
                'Discover the best GIF animations from Giphy.',
                'visualcomposer'
            ),
            'downloadAnimationsFromGiphy' => __(
                'Download animations from Giphy to your Media Library',
                'visualcomposer'
            ),
            'activatePremiumToUnlockGiphy' => __(
                'Activate Premium to Unlock Giphy Integration',
                'visualcomposer'
            ),
            'gifAnimations' => __(
                'GIF animations',
                'visualcomposer'
            ),
            'gifAnimationDownloadedToMediaLibrary' => __(
                'GIF animation has been downloaded to your Media Library.',
                'visualcomposer'
            ),
            'regular' => __(
                'Regular',
                'visualcomposer'
            ),
            'full' => __(
                'Full',
                'visualcomposer'
            ),
            'poweredBy' => __(
                'Powered by',
                'visualcomposer'
            ),
            'substituteElement' => __(
                'Substitute Element',
                'visualcomposer'
            ),
            'manageYourSiteMenu' => __(
                'Manage your site menus',
                'visualcomposer'
            ),
            'viaWPAdminMenu' => __(
                'in the WordPress dashboard.',
                'visualcomposer'
            ),
            'dataCollectionHeadingText' => __(
                'Share Usage Data',
                'visualcomposer'
            ),
            'dataCollectionText' => __(
                'Help to make Visual Composer better by sharing anonymous usage data. We appreciate your help.',
                'visualcomposer'
            ),
            'readMoreText' => __(
                'Read more',
                'visualcomposer'
            ),
            'dataCollectionToggleText' => __(
                'Share anonymous data',
                'visualcomposer'
            ),
            'submit' => __(
                'Submit',
                'visualcomposer'
            ),
            'new' => __(
                'New',
                'visualcomposer'
            ),
            'elements' => __(
                'Elements',
                'visualcomposer'
            ),
            'templates' => __(
                'Templates',
                'visualcomposer'
            ),
            'getFullAccessToTheVisualComposerHub' => __(
                'Get full access to the Visual Composer Hub',
                'visualcomposer'
            ),
            'downloadAllExclusiveText' => __(
                'Download all exclusive elements, templates, and extensions with Visual Composer Premium.',
                'visualcomposer'
            ),
            'tutorialPageNotification' => __(
                'This page can not be saved, because it is made for the demo purposes only.',
                'visualcomposer'
            ),
            'reset' => __(
                'Reset',
                'visualcomposer'
            ),
            'welcome' => __(
                'welcome',
                'visualcomposer'
            ),
            'discoverVC' => __(
                'Discover visual editor that gives everything to create a website you are proud of.',
                'visualcomposer'
            ),
            'done' => __(
                'Done',
                'visualcomposer'
            ),
            'nextTip' => __(
                'Next Tip',
                'visualcomposer'
            ),
            'clickHereToSkip' => __(
                'Click here to skip',
                'visualcomposer'
            ),
            'elementControls' => __(
                'Element Controls',
                'visualcomposer'
            ),
            'quickActions' => __(
                'Quick Actions',
                'visualcomposer'
            ),
            'insights' => __(
                'Insights',
                'visualcomposer'
            ),
            'onPageOptions' => __(
                'On-Page Options',
                'visualcomposer'
            ),
            'publishingOptions' => __(
                'Publishing Options',
                'visualcomposer'
            ),
            'thisIsYourContentLibrary' => sprintf(
                // translators: %1$s: link to add element, %2$s: </a>, %3$s: link to hub, %4$s: </a>
                __(
                    'This is your content library. %1$sAdd an element%2$s by dragging or clicking on it and find templates you have created or downloaded from the %3$sHub%4$s.',
                    'visualcomposer'
                ),
                '<a href="https://help.visualcomposer.com/docs/features/content-elements-structure/?utm_source=' . $source . '&utm_medium=editor&utm_campaign=info&utm_content=help-guide" target="_blank" rel="noopener noreferrer">',
                '</a>',
                '<a href="https://help.visualcomposer.com/docs/visual-composer-hub/what-is-visual-composer-hub/?utm_source=' . $source . '&utm_medium=editor&utm_campaign=info&utm_content=help-guide" target="_blank" rel="noopener noreferrer">',
                '</a>'
            ),
            'useElementControls' => sprintf(
            // translators: %1$s: link to element controls, %2$s: </a>, %3$s: link to element structure, %4$s: </a>
                __(
                    'Use %1$selement controls%2$s to see your %3$slayout structure%4$s or modify the particular row, column, or content element.',
                    'visualcomposer'
                ),
                '<a href="https://help.visualcomposer.com/docs/getting-started/interface/?utm_source=' . $source . '&utm_medium=editor&utm_campaign=info&utm_content=help-guide" target="_blank" rel="noopener noreferrer">',
                '</a>',
                '<a href="https://help.visualcomposer.com/docs/features/content-elements-structure/?utm_source=' . $source . '&utm_medium=editor&utm_campaign=info&utm_content=help-guide" target="_blank" rel="noopener noreferrer">',
                '</a>'
            ),
            'useQuickActions' => sprintf(
                // translators: %1$s: link to quick actions, %2$s: </a>
                __(
                    'Use %1$squick actions%2$s at the bottom of the page to add the most popular row/column layouts and elements.',
                    'visualcomposer'
                ),
                '<a href="https://help.visualcomposer.com/docs/features/content-elements-structure/?utm_source=' . $source . '&utm_medium=editor&utm_campaign=info&utm_content=help-guide" target="_blank" rel="noopener noreferrer">',
                '</a>'
            ),
            'validateYourPage' => sprintf(
                // translators: %1$s: link to insights, %2$s: </a>
                __(
                    '%1$sValidate your page%2$s for SEO and performance to speed up your site and rank higher.',
                    'visualcomposer'
                ),
                '<a href="https://help.visualcomposer.com/docs/features/insights/?utm_source=' . $source . '&utm_medium=editor&utm_campaign=info&utm_content=help-guide" target="_blank" rel="noopener noreferrer">',
                '</a>'
            ),
            'checkHowYourPageLooksOnDifferentDevices' => sprintf(
                // translators: %1$s: link to design options, %2$s: </a>
                __(
                    'Check how your page looks on different devices. Select the device type to %1$spreview your layout responsiveness%2$s.',
                    'visualcomposer'
                ),
                '<a href="https://help.visualcomposer.com/docs/features/design-options/?utm_source=' . $source . '&utm_medium=editor&utm_campaign=info&utm_content=help-guide" target="_blank" rel="noopener noreferrer">',
                '</a>'
            ),
            'accessVisualComposerHub' => sprintf(
                // translators: %1$s: link to hub, %2$s: </a>
                __(
                    'Access %1$sVisual Composer Hub%2$s in-built cloud library to download additional elements, templates, addons, stock images, and more.',
                    'visualcomposer'
                ),
                '<a href="https://help.visualcomposer.com/docs/visual-composer-hub/what-is-visual-composer-hub/?utm_source=' . $source . '&utm_medium=editor&utm_campaign=info&utm_content=help-guide" target="_blank" rel="noopener noreferrer">',
                '</a>'
            ),
            'changeOptionsOfYourPageOrPost' => sprintf(
                // translators: %1$s: link to dashboard settings, %2$s: </a>
                __(
                    'Change %1$soptions of your page or post%2$s, modify the layout, control popups, add custom CSS, and JavaScript.',
                    'visualcomposer'
                ),
                '<a href="https://help.visualcomposer.com/docs/getting-started/dashboard-settings/?utm_source=' . $source . '&utm_medium=editor&utm_campaign=info&utm_content=help-guide" target="_blank" rel="noopener noreferrer">',
                '</a>'
            ),
            'previewSaveAndPublish' => __(
                'Preview, save, and publish your content.',
                'visualcomposer'
            ),
            'insightsIsAContentAnalysisTool' => __(
                'Insights is a content analysis tool that helps to improve the quality, performance, and SEO ranking of the page.',
                'visualcomposer'
            ),
            'VCHubIsAnOnlineLibrary' => sprintf(
                // translators: %1$s: link to hub, %2$s: </a>
                __(
                    '%1$sVisual Composer Hub%2$s is an online library where to search and download content elements, templates, add-ons, stock images, and GIFs.',
                    'visualcomposer'
                ),
                '<a href="https://help.visualcomposer.com/docs/visual-composer-hub/what-is-visual-composer-hub/?utm_source=' . $source . '&utm_medium=editor&utm_campaign=info&utm_content=help-guide" target="_blank" rel="noopener noreferrer">',
                '</a>'
            ),
            'useTheToggleToSwitchBetweenLightAndDarkBackground' => __(
                'Use the toggle to switch between light and dark background while editing the text.',
                'visualcomposer'
            ),
            'replaceStaticContentWithDynamicContent' => sprintf(
                // translators: %1$s: link to dynamic content, %2$s: </a>
                __(
                    'Replace static content with %1$sdynamic content%2$s placeholders (WordPress default and custom fields).',
                    'visualcomposer'
                ),
                '<a href="https://help.visualcomposer.com/docs/features/dynamic-content/?utm_source=' . $source . '&utm_medium=editor&utm_campaign=info&utm_content=helper-point" target="_blank" rel="noopener noreferrer">',
                '</a>'
            ),
            'useReverseStackingToggle' => __(
                'Use Reverse stacking toggle to stack columns from right to left on mobile devices.',
                'visualcomposer'
            ),
            'enableCustomResponsivness' => __(
                'Enable custom responsiveness to control column width on different devices.',
                'visualcomposer'
            ),
            'useTheShowElementToggle' => __(
                'Use the Show element toggle to hide or show elements on all or custom devices.',
                'visualcomposer'
            ),
            'manageIfTheElementAppearsOnAParticularDevice' => __(
                'Manage if the element appears on a particular device.',
                'visualcomposer'
            ),
            'chooseAnEventPerformedWhenClickingOnTheImage' => __(
                'Choose an event performed when clicking on the image.',
                'visualcomposer'
            ),
            'modifyTheDestinationLinkToThePage' => __(
                'Modify the destination link to the page. Make sure to enable the option to set a custom permalink in WordPress Settings.',
                'visualcomposer'
            ),
            'selectOrChangeTheLayoutOfThePage' => __(
                'Select or change the layout of the page, post, or custom post type.',
                'visualcomposer'
            ),
            'excerptsAreOptional' => __(
                'Excerpts are optional hand-crafted summaries of your content.',
                'visualcomposer'
            ),
            'insertCustomJSCodeSnippets' => __(
                'Add custom JavaScript code to insert it locally or globally on every page in header or footer. Insert Google Analytics, Tag Manager, Kissmetrics, or other JavaScript code snippets.',
                'visualcomposer'
            ),
            'applyCustomCSSCode' => __(
                'Apply custom CSS code to the whole site or to this particular page only.',
                'visualcomposer'
            ),
            'toPreviewTheChangesUseTheResponsiveView' => __(
                'To preview the changes, use the Responsive View in the navigation bar.',
                'visualcomposer'
            ),
            'parentPageTitle' => __(
                'Parent Page',
                'visualcomposer'
            ),
            'aPopupContainerElementAllowsToStyle' => __(
                'A popup container element allows to style the overall look of your popup.',
                'visualcomposer'
            ),
            'marginTop' => __(
                'Margin top',
                'visualcomposer'
            ),
            'specifySpacesFromTheScreenTop' => __(
                'Specify space (in pixels) from the screen top where element should stick.',
                'visualcomposer'
            ),
            'controlZIndexForElement' => __(
                'Control the z-index for the section to place it over or under the following content. Sections with a higher index will be placed on top of sections with a lower index.',
                'visualcomposer'
            ),
            'zIndex' => __(
                'Z-index',
                'visualcomposer'
            ),
            'relateToParent' => __(
                'Relate to parent',
                'visualcomposer'
            ),
            'limitStickinessToWorkOnlyInTheParentContainer' => __(
                'Limit stickiness to work only in the parent container.',
                'visualcomposer'
            ),
            'showOnSticky' => __(
                'Show on sticky',
                'visualcomposer'
            ),
            'showOnlyWhenItBecomesSticky' => __(
                'Show only when it becomes sticky.',
                'visualcomposer'
            ),
            'author' => __(
                'Author',
                'visualcomposer'
            ),
            'pageSettings' => __(
                'Page Options',
                'visualcomposer'
            ),
            'pageDesignOptionsDescription' => __(
                'The global Design Options might not work with all themes. Use any of the Visual Composer layouts or get the Visual Composer Starter Theme to access this feature.',
                'visualcomposer'
            ),
            'featuredImage' => __(
                'Featured Image',
                'visualcomposer'
            ),
            'discussion' => __(
                'Discussion',
                'visualcomposer'
            ),
            'allowComments' => __(
                'Allow comments',
                'visualcomposer'
            ),
            'allowPingbacks' => __(
                'Allow trackbacks and pingbacks on this page',
                'visualcomposer'
            ),
            'parallaxEffect' => __(
                'Parallax effect',
                'visualcomposer'
            ),
            'featuredImageSet' => __(
                'Featured image is set. Save page and reload editor to see changes.',
                'visualcomposer'
            ),
            'featuredImageRemoved' => __(
                'Featured image is removed. Save page and reload editor to see changes.',
                'visualcomposer'
            ),
            'tags' => __(
                'Tags',
                'visualcomposer'
            ),
            'manageTagsAssociatedWithThePost' => __(
                'Manage tags associated with the post.',
                'visualcomposer'
            ),
            'general' => __(
                'General',
                'visualcomposer'
            ),
            'removeElementWarning' => __('Do you want to remove this element?', 'visualcomposer'),
            'removeElementInUseCurrentPageWarning' => __('The element is in use on current page. Remove all element copies from your site before deleting it.', 'visualcomposer'),
            'elementRemovedText' => __(
                'Element has been removed.',
                'visualcomposer'
            ),
            'addNew' => __(
                'Add new',
                'visualcomposer'
            ),
            'categories' => __(
                'Categories',
                'visualcomposer'
            ),
            'category' => __(
                'Category',
                'visualcomposer'
            ),
            'parentCategory' => __(
                'Parent Category',
                'visualcomposer'
            ),
            'addNewCategory' => __(
                'Add New Category',
                'visualcomposer'
            ),
            'selectCategoriesForPostOr' => __(
                'Select categories for the post or ',
                'visualcomposer'
            ),
            'addANewCategory' => __(
                'add a new category',
                'visualcomposer'
            ),
            'selectParentCategory' => __(
                'Select Parent Category',
                'visualcomposer'
            ),
            'removePlaceholder' => __('Remove `%`', 'visualcomposer'),
            'addPlaceholder' => __('Add `%`', 'visualcomposer'),
            'categoriesDescription' => __(
                'Manage post categories or add a new category.',
                'visualcomposer'
            ),
            'downloadPremiumIconLibraries' => __(
                'Download Premium Icon Libraries',
                'visualcomposer'
            ),
            'downloadPremiumDesignOptions' => __(
                'Download Premium Design Options',
                'visualcomposer'
            ),
            'downloadTheAddon' => __(
                'Download The Addon',
                'visualcomposer'
            ),
            'premiumPopupBuilder' => __(
                'Premium Popup Builder. Do More.',
                'visualcomposer'
            ),
            'createEngagingPopups' => __(
                'Create engaging popups to boost your conversion rate with Visual Composer Premium Popup Builder.',
                'visualcomposer'
            ),
            'layoutsAvailableInPremium' => __(
                'All layouts are available in the Premium version.',
                'visualcomposer'
            ),
            'doMoreWithPremium' => __(
                'Do More With Premium',
                'visualcomposer'
            ),
            'applyLayoutWithHFS' => __(
                'Apply a layout with a header, footer, and sidebar with Visual Composer Premium.',
                'visualcomposer'
            ),
            'getAccessToContentElements' => __(
                'Get access to more than 200 content elements with Visual Composer Premium.',
                'visualcomposer'
            ),
            'getAccessToTemplates' => __(
                'Get access to more than 150 beautiful multipurpose templates and template blocks with Visual Composer Premium.',
                'visualcomposer'
            ),
            'accessToGiphy' => __(
                'Access the whole GIPHY library with Visual Composer Premium.',
                'visualcomposer'
            ),
            'accessToUnsplash' => __(
                'Access the whole Unsplash stock image library with Visual Composer Premium.',
                'visualcomposer'
            ),
            'unlockAllFeatures' => __(
                'Unlock All Features',
                'visualcomposer'
            ),
            'width' => __(
                'Width',
                'visualcomposer'
            ),
            'pixelsUnit' => __(
                'px',
                'visualcomposer'
            ),
            'responsiveViewTooltip' => __(
                'You can instantly check your layout on the most popular device types.',
                'visualcomposer'
            ),
            'dynamicContentIsAPremiumFeature' => __(
                'Dynamic Content is a Premium Feature',
                'visualcomposer'
            ),
            'replaceStaticContentWithPremium' => __(
                'Replace static content with dynamic content from WordPress default and custom meta fields with Visual Composer Premium.',
                'visualcomposer'
            ),
            'replaceStaticContentWithPremiumAddon' => __(
                'Replace static content with dynamic content from WordPress default and custom meta fields with Visual Composer Premium Addon.',
                'visualcomposer'
            ),
            'dynamicView' => __(
                'Dynamic View',
                'visualcomposer'
            ),
            'elementLockPremiumFeatureHeading' => __(
                'Element Lock is a Premium feature',
                'visualcomposer'
            ),
            'elementLockPremiumFeatureText' => __(
                'With Visual Composer Premium, you can lock or unlock elements to manage who will be able to edit them.',
                'visualcomposer'
            ),
            'elementLockFeatureActivateAddonText' => __(
                'Lock or unlock all elements on your page. Your user roles with Administrator access will be able to edit elements. <br>You can lock/unlock specific elements under the element Edit window. <br>To get access to this feature, download the Role Manager addon from the Visual Composer Hub.',
                'visualcomposer'
            ),
            'popupBuilderPremiumFeatureHeading' => __(
                'Popup Builder is a Premium Feature',
                'visualcomposer'
            ),
            'popupBuilderPremiumFeatureText' => __(
                'Build custom popups with the Visual Composer Popup Builder that is available with the premium version of the plugin.',
                'visualcomposer'
            ),
            'popupBuilderFeatureActivateAddonText' => __(
                'Build custom popups with the Visual Composer Popup Builder. It\'s available in the Visual Composer Hub.',
                'visualcomposer'
            ),
            'downloadPopupBuilder' => __(
                'Download Popup Builder',
                'visualcomposer'
            ),
            'elementSettingsPremiumFeatureHeading' => __(
                'Element Settings is a Premium Feature',
                'visualcomposer'
            ),
            'elementSettingsPremiumFeatureText' => __(
                'With Visual Composer Premium, you can change the default parameters to create a unique element and save it to your Content Library.',
                'visualcomposer'
            ),
            'elementPresetsActivateAddonText' => __(
                'With the Element Presets addon, you can change the default parameters to create a unique element and save it to your Content Library.',
                'visualcomposer'
            ),
            'agreeHubAccessTerms' => __(
                'To download content from the Visual Composer Hub, read and accept our <a href="https://visualcomposer.com/terms-of-use/" target="_blank" rel="noopener noreferrer">cloud access terms</a> and <a href="https://visualcomposer.com/privacy-policy/" target="_blank" rel="noopener noreferrer">privacy policy</a>.',
                'visualcomposer'
            ),
            'yesIAgree' => __(
                'Yes, I agree',
                'visualcomposer'
            ),
            'hidingPlayerControls' => __(
                'Hiding player controls available only for Vimeo PRO users.',
                'visualcomposer'
            ),
            'vimeoVideoLink' => __(
                'Vimeo video link',
                'visualcomposer'
            ),
            'createHFS' => sprintf(
                // translators: %1$s: {link} to create, %2$s: </a>, %3$s: {name}
                __(
                    '%1$sCreate%2$s a new %3$s template.',
                    'visualcomposer'
                ),
                '<a href="{link}" target="_blank" rel="noopener noreferrer">',
                '</a>',
                '{name}'
            ),
            'createLayout' => sprintf(
                // translators: %1$s: {link} to create, %2$s: </a>
                __(
                    '%1$sCreate%2$s a new layout.',
                    'visualcomposer'
                ),
                '<a href="{link}" target="_blank" rel="noopener noreferrer">',
                '</a>'
            ),
            'editLayout' => sprintf(
                // translators: %1$s: {editLink} to edit, %2$s: </a>, %3$s: {creatLink}, %4$s: </a>
                __(
                    '%1$sEdit%2$s this layout or %3$screate%4$s a new one.',
                    'visualcomposer'
                ),
                '<a href="{editLink}" target="_blank">',
                '</a>',
                '<a href="{createLink}" target="_blank">',
                '</a>'
            ),
            'editHFSTemplate' => sprintf(
                // translators: %1$s: {editLink} to edit, %2$s: </a>, %3$s: {name}, %4$s: {createLink}, %5$s: </a>
                __(
                    '%1$sEdit%2$s this %3$s template or %4$screate%5$s a new one.',
                    'visualcomposer'
                ),
                '<a href="{editLink}" target="_blank" rel="noopener noreferrer">',
                '</a>',
                '{name}',
                '<a href="{createLink}" target="_blank" rel="noopener noreferrer">',
                '</a>'
            ),
            'createPopup' => sprintf(
                // translators: %1$s: {link} to create, %2$s: </a>
                __(
                    '%1$sCreate%2$s a new popup.',
                    'visualcomposer'
                ),
                '<a href="{link}" target="_blank" rel="noopener noreferrer">',
                '</a>'
            ),
            'editPopup' => sprintf(
                // translators: %1$s: {editLink} to edit, %2$s: </a>, %3$s: {createLink}, %4$s: </a>
                __(
                    '%1$sEdit%2$s this popup or %3$screate%4$s a new one.',
                    'visualcomposer'
                ),
                '<a href="{editLink}" target="_blank" rel="noopener noreferrer">',
                '</a>',
                '<a href="{createLink}" target="_blank" rel="noopener noreferrer">',
                '</a>'
            ),
            'restrictedText' => __(
                'Restricted',
                'visualcomposer'
            ),
            'getVisualComposerPremium' => __(
                'Get Visual Composer Premium',
                'visualcomposer'
            ),
            'getAllTheseAndManyMoreFeatures' => __(
                'Get all these and many more features with Visual Composer premium.',
                'visualcomposer'
            ),
            'lazyLoad' => __(
                'Lazy load',
                'visualcomposer'
            ),
            'lazyLoadBackground' => __(
                'Apply lazy load to the selected background',
                'visualcomposer'
            ),
            'saveAsBlock' => __(
                'Save as a Block',
                'visualcomposer'
            ),
            'getMoreBlocks' => __(
                'Get More Blocks',
                'visualcomposer'
            ),
            'removeBlockWarning' => __(
                'Do you want to delete this block?',
                'visualcomposer'
            ),
            'blockRemoved' => __(
                'The block has been successfully removed.',
                'visualcomposer'
            ),
            'blockRemoveFailed' => __(
                'Failed to remove the block',
                'visualcomposer'
            ),
            'blockAlreadyExists' => __(
                'A block with this name already exists. Choose a different block name.',
                'visualcomposer'
            ),
            'blockSaveFailed' => __(
                'Failed to save the block.',
                'visualcomposer'
            ),
            'specifyBlockName' => __(
                'Enter the block name to save this Row as a block template.',
                'visualcomposer'
            ),
            // translators: %1$s: %element, %2$s: %element
            'blockContainsLimitElement' => sprintf(__(
                'The block you want to add contains %1$selement element. You already have %2$selement element added - remove it before adding the block.',
                'visualcomposer'
            ), '%', '%'),
            'blockSaved' => __(
                'The block has been successfully saved.',
                'visualcomposer'
            ),
            'postSaved' => __(
                'The content has been successfully saved.',
                'visualcomposer'
            ),
            'postSavedFailed' => __(
                'Failed to save the content.',
                'visualcomposer'
            ),
            'postTemplateNotification' => sprintf(
                // translators: %s: vcv-headers-footers url
                __(
                    'The layout template you have created is not assigned to any post type. To assign the template, navigate to <a href="%s">Theme Builder Settings</a>',
                    'visualcomposer'
                ),
                esc_url(admin_url('admin.php?page=vcv-headers-footers'))
            ),
            'archiveTemplateNotification' => sprintf(
                // translators: %s: vcv-headers-footers url
                __(
                    'The layout template you have created is not assigned to any post archive. To assign the template, navigate to <a href="%s">Theme Builder Settings</a>',
                    'visualcomposer'
                ),
                esc_url(admin_url('admin.php?page=vcv-headers-footers'))
            ),
            'colorContrastTitleWarn' => __(
                'Your contrast ratio is low',
                'visualcomposer'
            ),
            'colorContrastDescriptionWarn' => sprintf(
                // translators: %1$s: {link} to color contrast, %2$s: </a>
                __(
                    'Your page foreground and background colors do not meet the WCAG 2 AA %1$scontrast ratio standards%2$s of 4.5:1.',
                    'visualcomposer'
                ),
                '<a class="vcv-ui-form-link" href="{link}" target="_blank" rel="noopener noreferrer">',
                '</a>'
            ),
            'colorContrastTitleOK' => __(
                'The page meets the contrast ratio standards',
                'visualcomposer'
            ),
            'colorContrastDescriptionOK' => sprintf(
                // translators: %1$s: {link} to color contrast, %2$s: </a>
                __(
                    'Your page foreground and background colors meet the WCAG 2 AA %1$scontrast ratio standards%2$s of 4.5:1.',
                    'visualcomposer'
                ),
                '<a class="vcv-ui-form-link" href="{link}" target="_blank" rel="noopener noreferrer">',
                '</a>'
            ),
            'contrastRatio' => __(
                'Contrast ratio',
                'visualcomposer'
            ),
            'contrastCheckInProgress' => __(
                'Contrast check is in progress ...',
                'visualcomposer'
            ),
            'noSuchLicenseFound' => vchelper('License')->licenseErrorCodes(2),
            'postTemplateText' => __(
                'Singular layout',
                'visualcomposer'
            ),
            'archiveTemplateText' => __(
                'Archive layout',
                'visualcomposer'
            ),
            'archiveGridElementMissingNotification' => __(
                'It seems you don’t have a post grid element on your page. Your archive page may not work properly. If you are using a custom grid element, feel free to ignore this message.',
                'visualcomposer'
            ),
            'enableFontManager' => __(
                'Enable Font Manager',
                'visualcomposer'
            ),
            'saveChanges' => __(
                'Save Changes',
                'visualcomposer'
            ),
            'comingSoon' => __(
                'Coming Soon',
                'visualcomposer'
            ),
            'excerptPlaceholderText' => __(
                'This is a sample excerpt placeholder that will be replaced with the actual content. You can style this excerpt to your liking using the editor controls.',
                'visualcomposer'
            ),
            'authorBioPlaceholderText' => __(
                'This is a placeholder for the Author Bio element. It will be replaced by the actual content.',
                'visualcomposer'
            ),
            'noValue' => __(
                'No Value',
                'visualcomposer'
            ),
            'designOptionsTooltip' => sprintf(
                // translators: %1$s: help url, %2$s: </a>
                __(
                    'Apply the most common style properties and effects to content elements with %1$sDesign Options%2$s.',
                    'visualcomposer'
                ),
                '<a href="https://help.visualcomposer.com/design-options/?utm_source=' . $source
                . '&utm_medium=editor&utm_campaign=info&utm_content=helper-point" target="_blank" rel="noopener noreferrer">',
                '</a>'
            ),
            'deviceStyling' => __(
                'Control font styling for all devices or adjust specific device type',
                'visualcomposer'
            ),
            // Font Manager Preview Tooltips
            'previewMenuTooltip' => __(
                'Menu',
                'visualcomposer'
            ),
            'previewSubmenuTooltip' => __(
                'Submenu',
                'visualcomposer'
            ),
            'previewH1Tooltip' => __(
                'H1',
                'visualcomposer'
            ),
            'previewH2Tooltip' => __(
                'H2',
                'visualcomposer'
            ),
            'previewH3Tooltip' => __(
                'H3',
                'visualcomposer'
            ),
            'previewH4Tooltip' => __(
                'H4',
                'visualcomposer'
            ),
            'previewH5Tooltip' => __(
                'H5',
                'visualcomposer'
            ),
            'previewH6Tooltip' => __(
                'H6',
                'visualcomposer'
            ),
            'previewParagraphTooltip' => __(
                'Paragraph',
                'visualcomposer'
            ),
            'previewCaptionTooltip' => __(
                'Caption',
                'visualcomposer'
            ),
            'previewBulletTooltip' => __(
                'Bullet',
                'visualcomposer'
            ),
            'previewBlockquoteTooltip' => __(
                'Blockquote',
                'visualcomposer'
            ),
            'previewButtonTooltip' => __(
                'Button',
                'visualcomposer'
            ),
            'skinToggleTooltip' => __(
                'Use the toggle to switch between light and dark backgrounds',
                'visualcomposer'
            ),
            'refreshIconTitle' => __(
                'Reset and sync with default values',
                'visualcomposer'
            ),
            // Activation Survey Options
            'myselfTitle' => __(
                'Myself',
                'visualcomposer'
            ),
            'myselfDescription' => __(
                'This is a site for myself or my business',
                'visualcomposer'
            ),
            'clientTitle' => __(
                'My Client',
                'visualcomposer'
            ),
            'clientDescription' => __(
                'I am getting paid by a client to create this site',
                'visualcomposer'
            ),
            'workTitle' => __(
                'My Work',
                'visualcomposer'
            ),
            'workDescription' => __(
                'I am creating a site for a company I work for',
                'visualcomposer'
            ),
            'elseTitle' => __(
                'Someone Else',
                'visualcomposer'
            ),
            'elseDescription' => __(
                'I am creating a site for my friend or family',
                'visualcomposer'
            ),
            'course1' => __(
                'How to create a new page',
                'visualcomposer'
            ),
            'courseDuration1' => __(
                '1:57',
                'visualcomposer'
            ),
            'course2' => __(
                'Add elements to your page',
                'visualcomposer'
            ),
            'courseDuration2' => __(
                '2:36',
                'visualcomposer'
            ),
            'course3' => __(
                'Learn quick actions',
                'visualcomposer'
            ),
            'courseDuration3' => __(
                '1:08',
                'visualcomposer'
            ),
            'courseButtonText' => __(
                'View full course (4 videos)',
                'visualcomposer'
            ),
            'addColumnBefore' => __(
                'Add column before',
                'visualcomposer'
            ),
            'addColumnAfter' => __(
                'Add column after',
                'visualcomposer'
            ),
            'rowMargin' => __(
                'Row margin',
                'visualcomposer'
            ),
            'layout' => __(
                'Layout',
                'visualcomposer'
            ),
            'content' => __(
                'Content',
                'visualcomposer'
            ),
            'toggleSection' => __(
                'Toggle section',
                'visualcomposer'
            ),
            'blankPageNonCapitalized' => __(
                'Blank page',
                'visualcomposer'
            ),
            'defaultLayout' => __(
                'Default layout',
                'visualcomposer'
            ),
            'customLayout' => __(
                'Custom layout',
                'visualcomposer'
            ),
            'noContent' => __(
                'No content',
                'visualcomposer'
            ),
            'myTemplate' => __(
                'My template',
                'visualcomposer'
            ),
            'layoutsDescription' => __(
                'Selecting a layout for the page, post, custom post type or layout is required.',
                'visualcomposer'
            ),
            'defaultLayoutDescription' => __(
                'The theme default layout.',
                'visualcomposer'
            ),
            'blankLayoutDescription' => __(
                'A layout without a header, footer and sidebar.',
                'visualcomposer'
            ),
            'singularLayoutDescription' => __(
                'Build a layout around the defined content area (ex. header, footer, sidebar).',
                'visualcomposer'
            ),
            'archiveLayoutDescription' => __(
                'Build a layout with a post grid.',
                'visualcomposer'
            ),
            'contentSectionDescription' => __(
                'Pre-select content or start with a blank content area.',
                'visualcomposer'
            ),
            'noContentDescription' => __(
                'The blank content template.',
                'visualcomposer'
            ),
            'blankPopup' => __(
                'Blank popup',
                'visualcomposer'
            ),
            'popupTemplate' => __(
                'Popup template',
                'visualcomposer'
            ),
            'selectAPopup' => __(
                'Select a popup',
                'visualcomposer'
            ),
            'singular' => __(
                'Singular',
                'visualcomposer'
            ),
            'archiveTitle' => __(
                'Archive',
                'visualcomposer'
            ),
            'layoutTemplate' => __(
                'Layout template',
                'visualcomposer'
            ),
            'selectATemplate' => __(
                'Select a template',
                'visualcomposer'
            ),
            'noTemplates' => __(
                'You don’t have any templates',
                'visualcomposer'
            ),
            'hubAccessTermsBlankPage' => __(
                'By downloading content from the Hub, you agree to the cloud <a href="https://visualcomposer.com/terms-of-use/" target="_blank" rel="noopener noreferrer">terms and services</a>',
                'visualcomposer'
            ),
            'removeElement' => __(
                'Remove Element',
                'visualcomposer'
            ),
            'editElement' => __(
                'Edit Element',
                'visualcomposer'
            ),
        ];

        return vcfilter('vcv:helpers:localizations:i18n', $locale);
    }

    public function getTranslatableAttributes($element)
    {
        $genericAttributeKeys = [
            'output',
            'title',
            'subtitle',
            'text',
            'messageText',
            'description',
            'buttonText',
        ];
        if (!isset($element['tag'])) {
            return $genericAttributeKeys; // inner elements or multi-value arrays values
        }

        if (array_key_exists($element['tag'], $this->translatableElementAttributes)) {
            return $this->translatableElementAttributes[ $element['tag'] ];
        }
        $keys = vcfilter(
            'vcv:helpers:localizations:i18n:element:attributes:' . $element['tag'],
            $genericAttributeKeys,
            ['element' => $element]
        );
        $this->translatableElementAttributes[ $element['tag'] ] = $keys;

        return $this->translatableElementAttributes[ $element['tag'] ];
    }
}
