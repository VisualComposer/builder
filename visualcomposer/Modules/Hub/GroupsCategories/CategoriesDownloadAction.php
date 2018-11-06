<?php

namespace VisualComposer\Modules\Hub\GroupsCategories;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Modules\Hub\Traits\Action;

class CategoriesDownloadAction extends Container implements Module
{
    protected $helperName = 'HubActionsCategoriesBundle';

    protected $actionName = 'categories';

    use Action;
}
