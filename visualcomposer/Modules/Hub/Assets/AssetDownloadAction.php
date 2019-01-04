<?php

namespace VisualComposer\Modules\Hub\Assets;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Modules\Hub\Traits\Action;

class AssetDownloadAction extends Container implements Module
{
    protected $helperName = 'HubActionsSharedLibrariesBundle';

    protected $actionName = 'asset/*';

    use Action;
}
