<?php

namespace VisualComposer\Modules\Settings\Fields;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\EditorPostType;
use VisualComposer\Helpers\PostType;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\Settings\Traits\Fields;

/**
 * Class PostTypes
 * @package VisualComposer\Modules\Settings\Fields
 */
class PostTypes extends Container implements Module
{
    use Fields;
    use WpFiltersActions;
    use EventsFilters;

    /**
     * @var string
     */
    protected $slug = 'vcv-settings';

    /**
     * General constructor.
     */
    public function __construct()
    {
        $this->optionGroup = $this->slug;
        $this->optionSlug = 'vcv-post-types';
        /** @see \VisualComposer\Modules\Settings\Fields\PostTypes::buildPage */
        $this->wpAddAction(
            'admin_init',
            'buildPage',
            9
        );
    }

    /**
     * Page: Post Types Settings.
     *
     * @param \VisualComposer\Helpers\PostType $postTypeHelper
     */
    protected function buildPage(PostType $postTypeHelper)
    {
        $sectionCallback = function () {
            echo sprintf(
                '<p class="description">%s</p>',
                esc_html__(
                    'Specify post types where you want to use Visual Composer Website Builder.',
                    'visualcomposer'
                )
            );
        };
        $this->addSection(
            [
                'title' => __('Post Types', 'visualcomposer'),
                'page' => $this->slug,
                'callback' => $sectionCallback,
            ]
        );

        $availablePostTypes = $postTypeHelper->getPostTypes(['attachment']);
        foreach ($availablePostTypes as $postType) {
            $fieldCallback = function ($data) use ($postType) {
                /** @see \VisualComposer\Modules\Settings\Fields\PostTypes::renderPostTypes */
                echo $this->call('renderPostTypes', ['data' => $data, 'postType' => $postType]);
            };

            $this->addField(
                [
                    'page' => $this->slug,
                    'title' => $postType['label'],
                    'name' => 'post-types',
                    'id' => 'vcv-post-types-' . $postType['value'],
                    'fieldCallback' => $fieldCallback,
                ]
            );
        }
    }

    /**
     * Render post types toggle list
     *
     * @param $data
     * @param $postType
     * @param \VisualComposer\Helpers\Access\EditorPostType $editorPostTypeHelper
     *
     * @return mixed|string
     */
    protected function renderPostTypes($data, $postType, EditorPostType $editorPostTypeHelper)
    {
        return vcview(
            'settings/fields/post-types/post-types-toggle',
            [
                'postType' => $postType,
                'enabledPostTypes' => $editorPostTypeHelper->getEnabledPostTypes(),
            ]
        );
    }
}
