<?php

namespace VisualComposer\Modules\Elements\WooCommerce;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

// use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\PostType;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Str;
use VisualComposer\Helpers\Traits\EventsFilters;

class Elements extends Container /*implements Module*/
{
    use EventsFilters;

    /**
     * Controller constructor.
     */
    public function __construct()
    {
        /** @see ShortcodesFactory::renderEditor */
        $this->addFilter(
            'vcv:ajax:elements:woocommerce:*:adminNonce',
            'renderEditor'
        );
    }

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
        global $wp;

        $atts = $request->input('vcv-atts');
        $content = $request->input('vcv-content');
        $tag = $request->input('vcv-tag');

        // @codingStandardsIgnoreLine
        if ('woocommerce_my_account' === $tag && !isset($wp->query_vars)) {
            // @codingStandardsIgnoreLine
            $wp->query_vars['page_id'] = get_the_ID();
        }

        /** @see \VisualComposer\Modules\Elements\Traits\ShortcodesTrait::getShortcodeString */
        return $this->call(
            'getShortcodeString',
            [
                'atts' => $atts,
                'content' => $content,
                'tag' => $tag,
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
    protected function getShortcodeString(Str $strHelper, $atts, $content, $tag)
    {
        $shortcodeString = sprintf(
            '[%s %s]%s[/%s]',
            $tag,
            $strHelper->buildQueryString($atts),
            rawurlencode(base64_encode($content)),
            $tag
        );

        return $shortcodeString;
    }
}
