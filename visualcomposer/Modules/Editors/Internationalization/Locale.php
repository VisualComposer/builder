<?php

namespace VisualComposer\Modules\Editors\Internationalization;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;

class Locale extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Editors\Internationalization\Locale::outputLocalizations */
        $this->addFilter('vcv:backend:extraOutput vcv:frontend:head:extraOutput', 'outputLocalizations');
    }

    protected function outputLocalizations($response, $payload)
    {
        $response = array_merge(
            $response,
            [
                vcview(
                    'i18n/locale',
                    [
                        'locale' => [
                            'addElement' => __('Add Element', 'vc5'),
                            'addTemplate' => __('Add Template', 'vc5'),
                            'treeView' => __('Tree View', 'vc5'),
                            'undo' => __('Undo', 'vc5'),
                            'redo' => __('Redo', 'vc5'),
                            'responsiveView' => __('Responsive View', 'vc5'),
                            'desktop' => __('Desktop', 'vc5'),
                            'tabletLandscape' => __('Tablet Landscape', 'vc5'),
                            'tabletPortrait' => __('Tablet Portrait', 'vc5'),
                            'mobileLandscape' => __('Mobile Landscape', 'vc5'),
                            'mobilePortrait' => __('Mobile Portrait', 'vc5'),
                            'settings' => __('Settings', 'vc5'),
                            'update' => __('Update', 'vc5'),
                            'menu' => __('Menu', 'vc5'),
                            'viewPage' => __('View Page', 'vc5'),
                            'backendEditor' => __('Backend Editor', 'vc5'),
                            'editInBackendEditor' => __('Edit in Backend Editor', 'vc5'),
                            'wordPressDashboard' => __('WordPress Dashboard', 'vc5'),
                            'publish' => __('Publish', 'vc5'),
                            'submitForReview' => __('Submit for Review', 'vc5'),
                            'saveDraft' => __('Save Draft', 'vc5'),
                            'close' => __('Close', 'vc5'),
                            'premiumElementsButton' => __('Premium Elements - Coming Soon', 'vc5'),
                            'premiumTemplatesButton' => __('Premium Templates - Coming Soon', 'vc5'),
                            'emptyTreeView' => __('There are no elements on your canvas - start by adding element or template', 'vc5'),
                            'customCSS' => __('Custom CSS', 'vc5'),
                            'localCSS' => __('Local CSS', 'vc5'),
                            'localCSSLabel' => __('Local CSS will be applied to this particular page only', 'vc5'),
                            'globalCSS' => __('Global CSS', 'vc5'),
                            'globalCSSLabel' => __('Global CSS will be applied site wide', 'vc5'),
                            'save' => __('Save', 'vc5'),
                            'templateName' => __('Template Name', 'vc5'),
                            'saveTemplate' => __('Save Template', 'vc5'),
                            'templateSaveFailed' => __('Template save failed.', 'vc5'),
                            'downloadMoreTemplates' => __('Download More Templates', 'vc5'),
                            'noTemplatesFound' => __('You don\'t have any templates yet. Try to save your current layout as a template or download templates from Visual Composer Hub.', 'vc5'),
                            'notRightTemplatesFound' => __('Didn\'t find the right template? Check out Visual Composer Hub for more layout templates.', 'vc5'),
                            'removeTemplateWarning' => __('Do you want to remove this template?', 'vc5'),
                            'templateRemoveFailed' => __('Template remove failed.', 'vc5'),
                        ],
                    ]
                ),
            ]
        );

        return $response;
    }
}
