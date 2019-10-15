<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

class Gutenberg implements Helper
{
    public function isGutenbergAvailable()
    {
        $optionsHelper = vchelper('Options');
        $requestHelper = vchelper('Request');
        $isEnabled = (bool)$optionsHelper->get('settings-gutenberg-editor-enabled', true);

        $screen = get_current_screen();

        $available = false;
        if ((function_exists('the_gutenberg_project') || function_exists('use_block_editor_for_post'))
            && $isEnabled
            && (method_exists($screen, 'is_block_editor')
                && !$screen->is_block_editor())
            && !$requestHelper->exists('classic-editor')
        ) {
            $available = true;
        }

        return $available;
    }
}
