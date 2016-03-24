<?php

namespace VisualComposer\Modules\Settings\Pages;

use VisualComposer\Helpers\Generic\Request;
use VisualComposer\Helpers\Generic\Access\CurrentUser\Access as CurrentUserAccess;
use VisualComposer\Framework\Container;
use VisualComposer\Modules\Settings\Traits\Page;

/**
 * Class About
 * @package VisualComposer\Modules\Settings\Pages
 */
class About extends Container
{
    use Page;
    /**
     * @var string
     */
    protected $slug = 'vc-v-about';
    /**
     * @var string
     */
    protected $defaultTabSlug = 'vc-v-main';
    /**
     * @var string
     */
    protected $templatePath = 'settings/pages/about/index';
    /**
     * @var array
     */
    protected $tabs;

    /**
     * About constructor.
     */
    public function __construct()
    {
        add_filter(
            'vc:v:settings:getPages',
            function ($pages) {
                /** @see \VisualComposer\Modules\Settings\Pages\About::addPage */
                return $this->call('addPage', [$pages]);
            }
        );

        $this->setTabs(
            [
                [
                    'slug' => 'vc-v-main',
                    'title' => __('What\'s New', 'vc5'),
                    'view' => 'settings/pages/about/partials/main',
                ],
                [
                    'slug' => 'vc-v-faq',
                    'title' => __('FAQ', 'vc5'),
                    'view' => 'settings/pages/about/partials/faq',
                ],
                [
                    'slug' => 'vc-v-resources',
                    'title' => __('Resources', 'vc5'),
                    'view' => 'settings/pages/about/partials/resources',
                ],
            ]
        );
    }

    /**
     * @return array
     */
    public function getTabs()
    {
        return $this->tabs;
    }

    /**
     * @param $tabs
     * @return $this
     */
    public function setTabs($tabs)
    {
        $this->tabs = apply_filters(
            'vc:v:settings:page:about:tabs',
            $tabs
        );

        return $this;
    }

    /**
     * @param array $pages
     *
     * @return array
     */
    private function addPage($pages)
    {
        $pages[] = [
            'slug' => $this->getSlug(),
            'title' => __('About', 'vc5'),
            'layout' => 'standalone',
            'showTab' => false,
            'controller' => $this,
        ];

        return $pages;
    }

    /**
     * Render page
     *
     * @param Request $request
     * @param \VisualComposer\Helpers\Generic\Access\CurrentUser\Access $currentUserAccess
     * @throws \Exception
     */
    protected function beforeRender(Request $request, CurrentUserAccess $currentUserAccess)
    {
        $hasAccessToSettings = $currentUserAccess->wpAny('manage_options')->part('settings')->can('vc-general-tab')
                                                 ->get()
            && (!is_multisite() || !is_main_site());
        $args = [
            'tabs' => $this->getTabs(),
            'activeTabSlug' => $request->input('tab', $this->defaultTabSlug),
            'hasAccessToSettings' => $hasAccessToSettings,
        ];
        $this->setTemplateArgs($args);
    }
}
