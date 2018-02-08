<?php

namespace VisualComposer\Modules\Elements\Traits;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\PostType;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Str;

/**
 * Class ShortcodesTrait
 * @package VisualComposer\Modules\Elements\Traits
 */
trait ShortcodesTrait
{
    /**
     * @param $response
     * @param \VisualComposer\Helpers\Request $request
     * @param \VisualComposer\Helpers\PostType $postTypeHelper
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserAccessHelper
     *
     * @return array
     */
    protected function renderEditor(
        $response,
        Request $request,
        PostType $postTypeHelper,
        CurrentUser $currentUserAccessHelper
    ) {
        $sourceId = (int)$request->input('vcv-source-id');
        if ($sourceId && $currentUserAccessHelper->wpAll(['edit_posts', $sourceId])->get()) {
            if (!is_array($response)) {
                $response = [];
            }

            $postTypeHelper->setupPost($sourceId);

            /** @see  \VisualComposer\Modules\Elements\Traits\ShortcodesTrait::renderEditorContent */
            $response['shortcodeContent'] = $this->call('renderEditorContent');
            /** @see \VisualComposer\Modules\Elements\Traits\ShortcodesTrait::renderEditorShortcode */
            $response['shortcode'] = $this->call('renderEditorShortcode');
            $response['status'] = true;
        }

        return $response;
    }

    /**
     * @return string
     */
    protected function renderEditorContent()
    {
        ob_start();
        /** @see \VisualComposer\Modules\Elements\Traits\ShortcodesTrait::renderEditorShortcode */
        $shortcodeString = $this->call('renderEditorShortcode');
        do_action('wp_loaded'); // Fix for WooCommerce
        // @codingStandardsIgnoreLine
        echo apply_filters(
            'the_content',
            $shortcodeString
        );
        wp_print_styles();
        print_late_styles();
        wp_print_head_scripts();
        wp_print_footer_scripts();
        $content = ob_get_clean();

        return $content;
    }

    /**
     * @param \VisualComposer\Helpers\Request $request
     *
     * @return mixed
     */
    protected function renderEditorShortcode(Request $request)
    {
        $atts = $request->input('vcv-atts');
        $content = $request->input('vcv-content');

        /** @see \VisualComposer\Modules\Elements\Traits\ShortcodesTrait::getShortcodeString */
        return $this->call(
            'getShortcodeString',
            [
                'atts' => $atts,
                'content' => $content,
            ]
        );
    }

    /**
     * @param \VisualComposer\Helpers\Str $strHelper
     * @param $atts
     * @param string $content
     *
     * @return string
     */
    protected function getShortcodeString(Str $strHelper, $atts, $content = '')
    {
        $shortcodeString = sprintf(
            '[%s %s]%s[/%s]',
            $this->shortcodeTag,
            $strHelper->buildQueryString($atts),
            rawurlencode(base64_encode($content)),
            $this->shortcodeTag
        );

        return $shortcodeString;
    }
}
