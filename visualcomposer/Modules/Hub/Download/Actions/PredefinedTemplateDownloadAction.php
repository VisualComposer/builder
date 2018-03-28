<?php

namespace VisualComposer\Modules\Hub\Download\Actions;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Modules\Hub\Download\Actions\Traits\Action;

class PredefinedTemplateDownloadAction extends Container implements Module
{
    protected $helperName = 'HubActionsTemplatesBundle';

    protected $actionName = 'predefinedTemplate/*';

    use Action;

    public function __construct()
    {
        if (vcvenv('VCV_HUB_DOWNLOAD_PREDEFINED_TEMPLATE')) {
            $this->helperName = 'HubActionsHubTemplatesBundle';
        }
        $this->addFilter('vcv:hub:process:action:' . $this->actionName, 'processAction');
    }
}
