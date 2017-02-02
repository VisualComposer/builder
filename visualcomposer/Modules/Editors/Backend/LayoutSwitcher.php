<?php

namespace VisualComposer\Modules\Editors\Backend;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Wp;

class LayoutSwitcher extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Editors\Backend\LayoutSwitcher::checkBackendMetabox */
        $this->addFilter('vcv:editors:backend:addMetabox', 'checkBackendMetabox');
    }

    protected function checkBackendMetabox($status, $payload, Request $requestHelper, Wp $wpHelper)
    {
        if ($requestHelper->exists('vcv-disable')) {
            $status = false;
        } else {
            $status = $wpHelper->getUserSetting(
                get_current_user_id(),
                'vcvEditorsBackendLayoutSwitcher',
                true
            );
            if (is_string($status)) {
                $status = $status !== '0'; // '0' => false, any other => true(add metabox)
            }
        }

        return $status;
    }
}
