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

class NoticeRedesign extends Container implements Module
{
    use WpFiltersActions;

    public function __construct()
    {
        if (!vcvenv('VCV_FT_ACTIVATION_REDESIGN')) {
            return;
        }
        $this->wpAddAction('pre_current_active_plugins', 'renderPluginNoticeTemplateRedesign');
    }

    protected function renderPluginNoticeTemplateRedesign()
    {
        evcview('settings/pages/plugins/noticeRedesign.php');
    }
}
