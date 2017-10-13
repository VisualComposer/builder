<?php

namespace VisualComposer\Modules\Elements\Grids;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
// use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class PostDescriptionVariablesController
 * @package VisualComposer\Modules\Elements\Grids
 */
class PostDescriptionVariablesController extends Container /*implements Module*/
{
    use EventsFilters;

    /**
     * PostDescriptionVariablesController constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Elements\Grids\PostDescriptionVariablesController::featuredImage */
        $this->addFilter(
            'vcv:elements:grid_item_template:variable:custom_post_description_featured_image',
            'featuredImage'
        );

        /** @see \VisualComposer\Modules\Elements\Grids\PostDescriptionVariablesController::postTitle */
        $this->addFilter(
            'vcv:elements:grid_item_template:variable:custom_post_description_title',
            'postTitle'
        );

        /** @see \VisualComposer\Modules\Elements\Grids\PostDescriptionVariablesController::postExcerpt */
        $this->addFilter(
            'vcv:elements:grid_item_template:variable:custom_post_description_excerpt',
            'postExcerpt'
        );

        /** @see \VisualComposer\Modules\Elements\Grids\PostDescriptionVariablesController::customContent */
        $this->addFilter(
            'vcv:elements:grid_item_template:variable:custom_post_description_content',
            'customContent'
        );
    }

    /**
     * @param $result
     * @param $payload
     *
     * @return mixed|string
     */
    protected function featuredImage($result, $payload)
    {
        $url = vcfilter(
            'vcv:elements:grid_item_template:variable:featured_image_url',
            '',
            [
                'key' => 'featured_image_url',
                'value' => null,
                'post' => $payload['post'],
            ]
        );
        if ($url) {
            $result = vcview(
                'elements/grids/postdescription-image',
                [
                    'url' => $url,
                ]
            );
        }

        return $result;
    }

    /**
     * @param $result
     * @param $payload
     *
     * @return mixed|string
     */
    protected function postTitle($result, $payload)
    {
        $title = vcfilter(
            'vcv:elements:grid_item_template:variable:post_title',
            '',
            [
                'key' => 'post_title',
                'value' => null,
                'post' => $payload['post'],
            ]
        );
        if ($title) {
            $permalink = vcfilter(
                'vcv:elements:grid_item_template:variable:post_permalink',
                '',
                [
                    'key' => 'post_permalink',
                    'value' => null,
                    'post' => $payload['post'],
                ]
            );
            $result = vcview(
                'elements/grids/postdescription-title',
                [
                    'title' => $title,
                    'permalink' => $permalink,
                ]
            );
        }

        return $result;
    }

    /**
     * @param $result
     * @param $payload
     *
     * @return mixed|string
     */
    protected function postExcerpt($result, $payload)
    {
        /** @var string $teaser */
        $teaser = vcfilter(
            'vcv:elements:grid_item_template:variable:post_teaser',
            '',
            [
                'key' => 'post_teaser',
                'value' => null,
                'post' => $payload['post'],
            ]
        );
        if (trim(strip_tags($teaser)) !== '') {
            $result = vcview(
                'elements/grids/postdescription-excerpt',
                [
                    'teaser' => $teaser,
                ]
            );
        }

        return $result;
    }

    /**
     * @param $result
     * @param $payload
     *
     * @return mixed|string
     */
    protected function customContent($result, $payload)
    {
        $title = vcfilter(
            'vcv:elements:grid_item_template:variable:custom_post_description_title',
            '',
            [
                'key' => 'custom_post_description_title',
                'value' => null,
                'post' => $payload['post'],
            ]
        );
        $excerpt = vcfilter(
            'vcv:elements:grid_item_template:variable:custom_post_description_excerpt',
            '',
            [
                'key' => 'custom_post_description_excerpt',
                'value' => null,
                'post' => $payload['post'],
            ]
        );
        $classes = [];
        if ($title) {
            $classes[] = 'vce-post-description-content--has-title';
        }
        if ($excerpt) {
            $classes[] = 'vce-post-description-content--has-excerpt';
        }
        if (!empty($classes)) {
            $result = vcview(
                'elements/grids/postdescription-content',
                [
                    'classes' => implode(' ', $classes),
                    'title' => $title,
                    'excerpt' => $excerpt,
                ]
            );
        }

        return $result;
    }
}
