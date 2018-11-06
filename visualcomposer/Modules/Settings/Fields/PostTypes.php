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
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\PostType;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\Settings\Traits\Fields;

class PostTypes extends Container implements Module
{
    use Fields;
    use WpFiltersActions;
    use EventsFilters;

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
            'buildPage'
        );
        $this->addEvent('vcv:system:factory:reset', 'unsetOptions');
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
                esc_html__('Specify post types where you want to use Visual Composer Website Builder.', 'vcwb')
            );
        };
        $this->addSection(
            [
                'title' => __('Post Types', 'vcwb'),
                'page' => $this->slug,
                'callback' => $sectionCallback,
            ]
        );

        $availablePostTypes = $postTypeHelper->getPostTypes(['attachment']);
        foreach ($availablePostTypes as $postType) {
            $fieldCallback = function ($data) use ($postType) {
                /** @see \VisualComposer\Modules\Settings\Pages\PostTypes::renderPostTypes */
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

    protected function renderPostTypes($data, $postType, EditorPostType $editorPostTypeHelper)
    {
        return vcview(
            'settings/pages/post-types/post-types-toggle',
            [
                'postType' => $postType,
                'enabledPostTypes' => $editorPostTypeHelper->getEnabledPostTypes(),
            ]
        );
    }

    protected function unsetOptions(Options $optionsHelper)
    {
        $optionsHelper->delete('post-types');
    }
}
