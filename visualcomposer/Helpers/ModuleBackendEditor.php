<?php

namespace VisualComposer\Helpers;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Helper;

class ModuleBackendEditor extends Container implements Helper
{
    public function render()
    {
        return 'hi from editor';
    }
}
