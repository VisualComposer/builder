<?php

namespace VisualComposer\Modules\Assets;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Frontend;

class PreviewJsEnqueueController extends JsEnqueueController implements Module
{
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
        $sourceId = vchelper('Preview')->updateSourceIdWithPreviewId(get_the_ID());

        $globalJs = '';
        $localJs = '';
        if (!$this->globalJSHeadAdded) {
            $globalJs = get_post_meta($sourceId, '_' . VCV_PREFIX . 'preview-settingsGlobalJsHead', true);
            $this->globalJSHeadAdded = true;
        }
        if (!in_array($sourceId, $this->localJsHeadEnqueueList)) {
            $this->localJsHeadEnqueueList[] = $sourceId;
            $localJs = get_post_meta($sourceId, '_' . VCV_PREFIX . 'preview-settingsLocalJsHead', true);
        }

        $this->printJs($globalJs, $localJs, $sourceId, 'head');
    }

    /**
     * Enqueue JS for post preview.
     */
    protected function enqueuePreviewFooterHtml()
    {
        $sourceId = vchelper('Preview')->updateSourceIdWithPreviewId(get_the_ID());

        $globalJs = '';
        $localJs = '';
        if (!$this->globalJSFooterAdded) {
            $globalJs = get_post_meta($sourceId, '_' . VCV_PREFIX . 'preview-settingsGlobalJsFooter', true);
            $this->globalJSFooterAdded = true;
        }
        if (!in_array($sourceId, $this->localJsFooterEnqueueList)) {
            $this->localJsFooterEnqueueList[] = $sourceId;
            $localJs = get_post_meta($sourceId, '_' . VCV_PREFIX . 'preview-settingsLocalJsFooter', true);
        }

        $this->printJs($globalJs, $localJs, $sourceId, 'footer');
    }
}
