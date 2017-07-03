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
        if (apply_filters('vcv:output:meta', true)) {
            $text = sprintf(
                esc_attr__(
                    'Powered by Visual Composer Website Builder %s - fast and easy to use drag and drop builder for experts and beginners.'
                    ,
                    'vcwb'
                ),
                VCV_VERSION . ' <strong>(Lite)</strong>'
            );
            echo sprintf(
                '<meta name="generator" content="%s"/>',
                $text
            );
        }
    }
}
