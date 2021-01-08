<?php

namespace VisualComposer\Modules\Editors\Settings\WordPressSettings;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\PostType;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;

class TagsController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter(
            'vcv:ajax:editors:settings:tags:autocomplete:findTag:adminNonce',
            'getFoundTags',
            11
        );
        $this->addFilter(
            'vcv:dataAjax:setData',
            'setData'
        );
        $this->addFilter(
            'vcv:editor:variables',
            'addTagsVariable'
        );
    }

    /**
     * @param $variables
     * @param \VisualComposer\Helpers\PostType $postTypeHelper
     *
     * @return array
     */
    protected function addTagsVariable(
        $variables,
        PostType $postTypeHelper
    ) {
        $currentPost = $postTypeHelper->get();
        $postTypeTaxonomies = get_object_taxonomies($currentPost);
        if (in_array('post_tag', $postTypeTaxonomies)) {
            $tagTaxonomy = get_taxonomy('post_tag');
            // @codingStandardsIgnoreLine
            if (isset($currentPost->post_type) && ($tagTaxonomy->show_ui || false !== $tagTaxonomy->meta_box_cb)) {
                $tags = get_the_tags($currentPost->ID);
                $variables[] = [
                    'key' => 'VCV_TAGS',
                    'value' => !empty($tags) ? $tags : [],
                ];
            }
        }
        return $variables;
    }

    /**
     * @return array
     */
    protected function getFoundTags($response, $payload, Request $requestHelper)
    {
        $searchValue = $requestHelper->input('vcv-search', '');

        $results = get_terms(
            array(
                'taxonomy'   => 'post_tag',
                'name__like' => $searchValue,
                'fields'     => 'names',
                'hide_empty' => false,
            )
        );

        return ['status' => true, 'results' => $results];
    }

    /**
     * Set tags
     *
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Request $requestHelper
     *
     * @return mixed
     */
    protected function setData($response, $payload, Request $requestHelper)
    {
        $currentPageId = $payload['sourceId'];
        if ($requestHelper->exists('vcv-settings-tags')) {
            $tags = $requestHelper->input('vcv-settings-tags', '');
            if (!empty($tags)) {
                $tags = json_decode($tags, true);
            }
            wp_set_post_tags($currentPageId, $tags);
        }

        return $response;
    }
}
