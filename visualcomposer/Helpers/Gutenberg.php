<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Helper;

class Gutenberg extends Container implements Helper
{
    public function isGutenbergAvailable()
    {
        $optionsHelper = vchelper('Options');
        $requestHelper = vchelper('Request');
        $isEnabled = (bool)$optionsHelper->get('settings-gutenberg-editor-enabled', true);

        $screen = get_current_screen();

        $available = false;
        if (
            (function_exists('the_gutenberg_project') || function_exists('use_block_editor_for_post'))
            && $isEnabled
            && !$requestHelper->exists('classic-editor')
            && (method_exists($screen, 'is_block_editor')
                && !$screen->is_block_editor())
        ) {
            $available = true;
        }

        return $available;
    }

    /**
     * Check if page build by Visual Composer
     *
     * @param $sourceId
     *
     * @return bool
     * @throws \ReflectionException
     * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
     */
    public function isVisualComposerPage($sourceId)
    {
        if (!$sourceId) {
            // New page cannot be VC
            return false;
        }
        $postContent = get_post_meta($sourceId, VCV_PREFIX . 'pageContent', true);
        /** @see \VisualComposer\Helpers\Gutenberg::overrideDisableGutenberg */
        if (!empty($postContent) && !$this->call('overrideDisableGutenberg', ['sourceId' => $sourceId])) {
            return true;
        }

        return false;
    }

    /**
     * To override the disabled gutenberg setting
     *
     * @param $sourceId
     *
     * @return bool
     */
    protected function overrideDisableGutenberg($sourceId)
    {
        if (!$sourceId) {
            $sourceId = get_the_ID();
        }
        $isOverrideDisableGutenberg = get_post_meta($sourceId, VCV_PREFIX . 'be-editor', true);

        return $isOverrideDisableGutenberg === 'gutenberg';
    }
}
