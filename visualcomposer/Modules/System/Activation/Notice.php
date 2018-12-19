<?php

namespace VisualComposer\Modules\System\Activation;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class Notice extends Container implements Module
{
    use WpFiltersActions;

    public function __construct()
    {
        $this->wpAddAction('pre_current_active_plugins', 'renderPluginNoticeTemplate');
    }

    protected function renderPluginNoticeTemplate()
    {
        evcview('settings/pages/plugins/notice.php');
    }
}
