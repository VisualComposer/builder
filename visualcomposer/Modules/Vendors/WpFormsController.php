<?php

namespace VisualComposer\Modules\Vendors;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class WpFormsController extends Container implements Module
{
    use WpFiltersActions;

    public function __construct(Request $requestHelper)
    {
        if ($requestHelper->exists(VCV_ADMIN_AJAX_REQUEST) || $requestHelper->exists(VCV_AJAX_REQUEST)) {
            $this->wpAddFilter('wpforms_frontend_missing_assets_error_js_disable', '__return_true');
        }
    }
}
