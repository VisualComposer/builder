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
                        ],
                    ]
                ),
            ]
        );

        return $response;
    }
}
