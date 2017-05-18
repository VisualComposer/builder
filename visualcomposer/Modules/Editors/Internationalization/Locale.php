<?php

namespace VisualComposer\Modules\Editors\Internationalization;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Localizations;
use VisualComposer\Helpers\Traits\EventsFilters;

class Locale extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Editors\Internationalization\Locale::outputLocalizations */
        $this->addFilter('vcv:backend:extraOutput vcv:frontend:head:extraOutput', 'outputLocalizations');
    }

    protected function outputLocalizations($response, $payload, Localizations $localizationsHelper)
    {
        $response = array_merge(
            $response,
            [
                vcview(
                    'i18n/locale',
                    [
                        'locale' => $localizationsHelper->getLocalizations(),
                    ]
                ),
            ]
        );

        return $response;
    }
}
