<?php

namespace VisualComposer\Modules\Assets;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Frontend;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class PreviewJsEnqueueController extends JsEnqueueController implements Module
{
    use WpFiltersActions;

    /** @noinspection PhpMissingParentConstructorInspection
     * @param \VisualComposer\Helpers\Frontend $frontendHelper
     */
    public function __construct(Frontend $frontendHelper)
    {
        if ($frontendHelper->isPreview()) {
            $this->wpAddAction('wp_print_scripts', 'enqueuePreviewHeadHtml', 60);

            $this->wpAddAction('wp_print_footer_scripts', 'enqueuePreviewFooterHtml', 60);
        }
    }

    /**
     * Enqueue JS for post preview head part.
     */
    protected function enqueuePreviewHeadHtml()
    {
        $sourceId = get_the_ID();
        $preview = wp_get_post_autosave($sourceId);
        if (is_object($preview)) {
            $sourceId = $preview->ID;
        }
        $globalJs = get_post_meta($sourceId, '_' . VCV_PREFIX . 'preview-settingsGlobalJsHead', true);
        $localJs = get_post_meta($sourceId, '_' . VCV_PREFIX . 'preview-settingsLocalJsHead', true);

        $this->printJs($globalJs, $localJs);
    }

    /**
     * Enqueue JS for post preview.
     */
    protected function enqueuePreviewFooterHtml()
    {
        $sourceId = get_the_ID();
        $preview = wp_get_post_autosave($sourceId);
        if (is_object($preview)) {
            $sourceId = $preview->ID;
        }
        $globalJs = get_post_meta($sourceId, '_' . VCV_PREFIX . 'preview-settingsGlobalJsFooter', true);
        $localJs = get_post_meta($sourceId, '_' . VCV_PREFIX . 'preview-settingsLocalJsFooter', true);

        $this->printJs($globalJs, $localJs);
    }
}
