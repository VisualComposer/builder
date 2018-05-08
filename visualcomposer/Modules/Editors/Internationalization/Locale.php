<?php

namespace VisualComposer\Modules\Editors\Internationalization;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\EditorPostType;
use VisualComposer\Helpers\Frontend;
use VisualComposer\Helpers\Localizations;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class Locale extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    protected $printed = false;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Editors\Internationalization\Locale::outputLocalizations */
        $this->addFilter(
            'vcv:frontend:head:extraOutput vcv:frontend:update:head:extraOutput vcv:backend:settings:extraOutput',
            'outputLocalizations'
        );

        $this->wpAddAction('admin_print_scripts', 'printLocalizations');
    }

    protected function outputLocalizations($response, $payload, Localizations $localizationsHelper)
    {
        if ($this->printed) {
            return $response;
        }
        $this->printed = true;
        $response = array_merge(
            $response,
            [
                vcview(
                    'partials/constant-script',
                    [
                        'key' => 'VCV_I18N',
                        'value' => $localizationsHelper->getLocalizations(),
                    ]
                ),
            ]
        );

        return $response;
    }

    protected function printLocalizations(
        Localizations $localizationsHelper,
        EditorPostType $editorPostTypeHelper,
        Frontend $frontendHelper
    ) {
        if ($this->printed) {
            return;
        }
        if ($editorPostTypeHelper->isEditorEnabled(get_post_type()) && !$frontendHelper->isFrontend()) {
            $this->printed = true;
            evcview(
                'partials/constant-script',
                [
                    'key' => 'VCV_I18N',
                    'value' => $localizationsHelper->getLocalizations(),
                ]
            );
        }
    }
}
