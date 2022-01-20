<?php

namespace VisualComposer\Modules\Elements;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class ViewPageRender extends Container implements Module
{
    use WpFiltersActions;

    public function __construct()
    {
        if (vcvenv('FT_DISABLE_VIEW_PAGE_RENDER', true)) {
            return;
        }
        // Use WordPress 5.1 pre_render_block as it is more performance efficient
        if (version_compare(get_bloginfo('version'), '5.1', '>=')) {
            $this->wpAddFilter('pre_render_block', 'renderDynamicBlock');
        } else {
            $this->wpAddFilter('render_block', 'renderDynamicBlock');
        }
    }

    /**
     * Rendering dynamic view-page element render blocks.
     *
     * @param null $response
     * @param array $block
     *
     * @return string
     * @throws \ReflectionException|\VisualComposer\Framework\Illuminate\Container\BindingResolutionException
     *
     */
    protected function renderDynamicBlock($response, $block)
    {
        if (!isset($block) || !is_array($block) || !array_key_exists('blockName', $block)) {
            return $response;
        }

        if (strpos($block['blockName'], 'vcwb/empty-comment-element-wrapper') !== false) {
            return ''; // clear all the content
        }
        $isDynamicViewPageRender = strpos($block['blockName'], 'vcwb-view-page-render-element') !== false;
        if (!$isDynamicViewPageRender) {
            return $response;
        }

        if (!empty($block['innerBlocks'])) {
            $before = $block['innerContent'][0];
            $after = $block['innerContent'][ count($block['innerContent']) - 1 ];
            $content = '';
            foreach ($block['innerBlocks'] as $innerBlock) {
                $content .= render_block($innerBlock);
            }
        } else {
            $before = $block['innerContent'][0];
            $after = '';
            $content = '';
        }

        $response = vcfilter('vcv:' . $block['blockName'], $before . $content . $after, [
            'atts' => $block['attrs'],
            'before' => $before,
            'after' => $after,
            'content' => $content,
        ]);

        return $response;
    }
}
