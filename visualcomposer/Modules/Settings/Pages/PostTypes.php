<?php

namespace VisualComposer\Modules\Settings\Pages;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\EditorPostType;
use VisualComposer\Helpers\PostType;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\Settings\Traits\Fields;
use VisualComposer\Modules\Settings\Traits\Page;

class PostTypes extends Container implements Module
{
    use Fields;
    use Page;
    use EventsFilters;
    use WpFiltersActions;

    /**
     * @var string
     */
    protected $slug = 'vcv-post-types';

    /**
     * @var string
     */
    protected $templatePath = 'settings/pages/index';

    /**
     * General constructor.
     *
     * @param \VisualComposer\Helpers\Token $tokenHelper
     */
    public function __construct(Token $tokenHelper)
    {
        if ($tokenHelper->isSiteAuthorized()) {
            $this->optionGroup = 'vcv-post-types';
            $this->optionSlug = 'vcv-post-types';

            /** @see \VisualComposer\Modules\Settings\Pages\PostTypes::addPage */
            $this->addFilter(
                'vcv:settings:getPages',
                'addPage',
                20
            );

            /** @see \VisualComposer\Modules\Settings\Pages\PostTypes::buildPage */
            $this->wpAddAction(
                'vcv:settings:initAdmin:page:' . $this->getSlug(),
                'buildPage'
            );
        }
    }

    /**
     * @param array $pages
     *
     * @return array
     */
    protected function addPage($pages)
    {
        $pages[] = [
            'slug' => $this->getSlug(),
            'title' => __('Settings', 'vc5'),
            'showTab' => false,
            'layout' => 'settings-standalone',
            'controller' => $this,
        ];

        return $pages;
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
                __('Specify post types where you want to use Visual Composer Website Builder.', 'vc5')
            );
        };
        $this->addSection(
            [
                'title' => __('Post Types', 'vc5'),
                'page' => $this->getSlug(),
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
                    'page' => $this->getSlug(),
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
}
