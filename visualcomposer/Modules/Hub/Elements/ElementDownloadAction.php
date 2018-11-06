<?php

namespace VisualComposer\Modules\Hub\Elements;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Modules\Hub\Traits\Action;

class ElementDownloadAction extends Container implements Module
{
    protected $helperName = 'HubActionsElementsBundle';

    protected $actionName = 'element/*';

    use Action;
}
