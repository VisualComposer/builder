<?php

namespace VisualComposer\Modules\System\Activation;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class Notice extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    public function __construct()
    {
        $this->wpAddAction('pre_current_active_plugins', 'renderPluginsNameVariable');
        $this->wpAddAction('pre_current_active_plugins', 'enqueueScripts');
        $this->wpAddAction('pre_current_active_plugins', 'renderPluginNoticeTemplate');
    }

    protected function enqueueScripts()
    {
        wp_enqueue_script('vcv:settings:script');
    }

    protected function renderPluginsNameVariable()
    {
        echo vcview('settings/pages/plugins/variable.php');
    }

    protected function renderPluginNoticeTemplate()
    {
        echo vcview('settings/pages/plugins/notice.php');
    }
}
