<?php

namespace VisualComposer\Modules\Vendors;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;

class WpFormsController extends Container implements Module
{
    public function __construct()
    {
        add_filter('wpforms_frontend_missing_assets_error_js_disable', '__return_true');
    }
}
