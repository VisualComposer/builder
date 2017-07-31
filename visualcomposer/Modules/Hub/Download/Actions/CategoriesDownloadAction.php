<?php

namespace VisualComposer\Modules\Hub\Download\Actions;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Modules\Hub\Download\Actions\Traits\Action;

class CategoriesDownloadAction extends Container implements Module
{
    protected $helperName = 'HubActionsCategoriesBundle';

    protected $actionName = 'categories';

    use Action;
}
