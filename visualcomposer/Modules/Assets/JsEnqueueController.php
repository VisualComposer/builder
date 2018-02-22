<?php

namespace VisualComposer\Modules\Assets;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Frontend;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class JsEnqueueController extends Container implements Module
{
    use WpFiltersActions;

    protected $globalJSAdded = false;

    public function __construct(Frontend $frontendHelper)
    {
        if (!$frontendHelper->isPreview()) {
            $this->wpAddAction('wp_print_footer_scripts', 'enqueueJs', 60);
        }
    }

    /**
     * Enqueue JS.
     *
     * @param \VisualComposer\Helpers\Options $optionsHelper
     */
    protected function enqueueJs(Options $optionsHelper)
    {
        $sourceId = get_the_ID();
        $globalJs = $optionsHelper->get('settingsGlobalJs');
        $localJs = get_post_meta($sourceId, 'vcv-settingsLocalJs', true);

        $this->printJs($globalJs, $localJs, $sourceId);
    }

    /**
     * @param $globalJs
     * @param $localJs
     * @param string $prefix
     */
    protected function printJs($globalJs, $localJs, $prefix = '')
    {
        $frontendHelper = vchelper('Frontend');
        if (!$frontendHelper->isPageEditable()) {
            if (!empty($globalJs) && !$this->globalJSAdded) {
                $this->globalJSAdded = true;
                evcview(
                    'partials/script',
                    [
                        'key' => $prefix . '-global-js',
                        'value' => $globalJs,
                    ]
                );
            }
            if (!empty($localJs)) {
                evcview(
                    'partials/script',
                    [
                        'key' => $prefix . '-local-js',
                        'value' => $localJs,
                    ]
                );
            }
        }
    }
}
