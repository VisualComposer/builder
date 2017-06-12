<?php

namespace VisualComposer\Modules\FrontEnd;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class MetaDataController extends Container implements Module
{
    use WpFiltersActions;

    public function __construct()
    {
        $this->wpAddAction('wp_head', 'addMetaGenerator');
    }

    protected function addMetaGenerator()
    {
        echo sprintf(
            '<meta name="generator" content="%s"/>',
            esc_attr__(
                'Powered by Visual Composer Website Builder - fast and easy to use drag and drop builder for experts and beginners.',
                'vcwb'
            )
        );
    }
}
