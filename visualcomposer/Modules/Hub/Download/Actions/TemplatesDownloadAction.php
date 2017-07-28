<?php

namespace VisualComposer\Modules\Hub\Download\Actions;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Modules\Hub\Download\Actions\Traits\Action;

class TemplatesDownloadAction extends Container implements Module
{
    protected $helperName = 'HubActionsTemplatesBundle';

    protected $actionName = 'templates';

    use Action;
}
