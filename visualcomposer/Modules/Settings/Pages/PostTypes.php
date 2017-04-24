<?php

namespace VisualComposer\Modules\Settings\Pages;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
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
     */
    public function __construct()
    {
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
            'controller' => $this,
        ];

        return $pages;
    }

    /**
     * Page: Post Types Settings.
     */
    protected function buildPage()
    {
        $this->addSection(
            [
                'page' => $this->getSlug(),
            ]
        );

        $fieldCallback = function ($data) {
            /** @see \VisualComposer\Modules\Settings\Pages\PostTypes::renderPostTypes */
            echo $this->call('renderPostTypes', [$data]);
        };

        $this->addField(
            [
                'page' => $this->getSlug(),
                'title' => __('Post Types', 'vc5'),
                'name' => 'post-types',
                'fieldCallback' => $fieldCallback,
            ]
        );
    }

    protected function renderPostTypes(Options $optionsHelper)
    {
        return vcview(
            'settings/pages/post-types/post-types-toggle',
            [
                'postTypes' => (array)$optionsHelper->get('post-types', []),
            ]
        );
    }
}
