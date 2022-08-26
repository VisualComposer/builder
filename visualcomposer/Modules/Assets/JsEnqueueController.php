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
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class JsEnqueueController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    protected $globalJSHeadAdded = false;

    protected $globalJSFooterAdded = false;

    protected $localJsHeadEnqueueList = [];

    protected $localJsFooterEnqueueList = [];

    public function __construct()
    {
        $this->addEvent('vcv:inited', 'initialize', 11);
    }

    protected function initialize(Frontend $frontendHelper)
    {
        $this->wpAddAction('wp_print_scripts', 'migrateSourceJs', 1);
        if (
            !$frontendHelper->isPreview()
            && !$frontendHelper->isPageEditable()
            && (
                !is_admin() || $frontendHelper->isFrontend()
            )
        ) {
            /** @see \VisualComposer\Modules\Assets\JsEnqueueController::enqueueHeadHtml */
            if ($frontendHelper->isFrontend()) {
                $this->addEvent('vcv:frontend:render', 'enqueueHeadHtml');
            } else {
                $this->wpAddAction('wp_print_scripts', 'enqueueHeadHtml', 60);
            }

            /** @see \VisualComposer\Modules\Assets\JsEnqueueController::enqueueFooterHtml */
            $this->wpAddAction('wp_print_footer_scripts', 'enqueueFooterHtml', 60);
        }
    }

    protected function migrateSourceJs()
    {
        $sourceId = get_the_ID();
        $localJs = get_post_meta($sourceId, 'vcv-settingsLocalJs', true);
        if (!empty($localJs)) {
            $localJs = '<script type="text/javascript">' . $localJs . '</script>';
            update_post_meta($sourceId, 'vcv-settingsLocalJsFooter', $localJs);
            delete_post_meta($sourceId, 'vcv-settingsLocalJs');
        }
    }

    /**
     * Enqueue HTML or JS snippets in head.
     *
     * @param \VisualComposer\Helpers\Options $optionsHelper
     */
    protected function enqueueHeadHtml(Options $optionsHelper)
    {
        $sourceId = get_the_ID();
        $globalJs = '';
        $localJs = '';
        if (!$this->globalJSHeadAdded) {
            $globalJs = $optionsHelper->get('settingsGlobalJsHead');
            $this->globalJSHeadAdded = true;
        }
        if (!in_array($sourceId, $this->localJsHeadEnqueueList) && is_singular()) {
            $this->localJsHeadEnqueueList[] = $sourceId;
            $localJs = get_post_meta($sourceId, 'vcv-settingsLocalJsHead', true);
        }

        $this->printJs($globalJs, $localJs, $sourceId, 'head');
    }

    /**
     * Enqueue HTML or JS snippets in footer.
     *
     * @param \VisualComposer\Helpers\Options $optionsHelper
     */
    protected function enqueueFooterHtml(Options $optionsHelper)
    {
        $sourceId = get_the_ID();
        $globalJs = '';
        $localJs = '';
        if (!$this->globalJSFooterAdded) {
            $globalJs = $optionsHelper->get('settingsGlobalJsFooter');
            $this->globalJSFooterAdded = true;
        }
        if (!in_array($sourceId, $this->localJsFooterEnqueueList) && is_singular()) {
            $this->localJsFooterEnqueueList[] = $sourceId;
            $localJs = get_post_meta($sourceId, 'vcv-settingsLocalJsFooter', true);
        }

        $this->printJs($globalJs, $localJs, $sourceId, 'footer');
    }

    /**
     * @param $globalJs
     * @param $localJs
     * @param $sourceId
     * @param $part
     */
    protected function printJs($globalJs, $localJs, $sourceId, $part)
    {
        if (vcvenv('VCV_DEBUG')) {
            echo '<!-- \VisualComposer\Modules\Assets\JsEnqueueController::printJs ' . esc_attr($sourceId) . '-' . esc_attr($part)
                . ' START -->';
        }
        $frontendHelper = vchelper('Frontend');
        $outputHelper = vchelper('Output');
        if (!$frontendHelper->isPageEditable()) {
            if (!empty($globalJs)) {
                $outputHelper->printNotEscaped($globalJs);
            }
            if (!empty($localJs)) {
                $outputHelper->printNotEscaped($localJs);
            }
        }
        if (vcvenv('VCV_DEBUG')) {
            echo '<!-- \VisualComposer\Modules\Assets\JsEnqueueController::printJs ' . esc_attr($sourceId) . '-' . esc_attr($part)
                . ' END -->';
        }
    }
}
