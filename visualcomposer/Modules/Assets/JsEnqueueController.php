<?php

namespace VisualComposer\Modules\Assets;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class JsEnqueueController extends Container implements Module
{
    use WpFiltersActions;

    public function __construct()
    {
        if (vcvenv('VCV_TF_JS_SETTINGS')) {
            $actionPriority = 60;
            $requestHelper = vchelper('Request');
            if ($requestHelper->input('preview', '') === 'true') {
                $this->wpAddAction('wp_footer', 'enqueuePreviewJs', $actionPriority);

                return;
            }
            $this->wpAddAction('wp_footer', 'enqueueJs', $actionPriority);
        }
    }

    /**
     * Enqueue JS for post preview.
     */
    protected function enqueuePreviewJs()
    {
        $sourceId = get_the_ID();
        $globalJs = get_post_meta($sourceId, 'vcv-preview-settingsGlobalJs', true);
        $localJs = get_post_meta($sourceId, 'vcv-preview-settingsLocalJs', true);

        $this->printJs($globalJs, $localJs, 'preview');
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

        $this->printJs($globalJs, $localJs);
    }

    /**
     * @param $globalJs
     * @param $localJs
     * @param string $prefix
     */
    protected function printJs($globalJs, $localJs, $prefix = '')
    {
        $requestHelper = vchelper('Request');
        if (!$requestHelper->exists('vcv-editable')) {
            if (!empty($globalJs)) {
                echo vcview(
                    'partials/script',
                    [
                        'key' => $prefix . 'global-js',
                        'value' => $globalJs,
                    ]
                );
            }
            if (!empty($localJs)) {
                echo vcview(
                    'partials/script',
                    [
                        'key' => $prefix . 'local-js',
                        'value' => $localJs,
                    ]
                );
            }
        }
    }
}
