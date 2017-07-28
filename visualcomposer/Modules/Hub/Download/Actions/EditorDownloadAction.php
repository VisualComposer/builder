<?php

namespace VisualComposer\Modules\Hub\Download\Actions;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Modules\Hub\Download\Actions\Traits\Action;

class EditorDownloadAction extends Container implements Module
{
    protected $helperName = 'HubActionsEditorBundle';

    protected $actionName = 'editor';

    use Action;
}
