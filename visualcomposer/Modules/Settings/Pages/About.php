<?php

namespace VisualComposer\Modules\Settings\Pages;

use VisualComposer\Helpers\Generic\Request;
use VisualComposer\Helpers\Generic\Access\CurrentUser\Access as CurrentUserAccess;
use VisualComposer\Framework\Container;

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
    private $slug = 'vc-v-about';
    /**
     * @var string
     */
    private $defaultTabSlug = 'vc-v-main';
    /**
     * @var array
     */
    private $tabs;

    /**
     * About constructor.
     */
    public function __construct()
    {
        add_filter(
            'vc:v:settings:getPages',
            function ($pages) {
                return $this->call('addPage', [$pages]);
            }
        );

        add_action(
            'vc:v:settings:pageRender:' . $this->getSlug(),
            function () {
                $this->call('render');
            }
        );

        $this->tabs = apply_filters(
            'vc:v:settings:page:about:tabs',
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
     * @param array $pages
     *
     * @return array
     */
    public function addPage($pages)
    {
        $pages[] = [
            'slug' => $this->getSlug(),
            'title' => __('About', 'vc5'),
            'layout' => 'standalone',
            'showTab' => false,
        ];

        return $pages;
    }

    /**
     * Render page
     *
     * @param Request $request
     */
    public function renderPage(Request $request, CurrentUserAccess $currentUserAccess)
    {
        $hasAccessToSettings = $currentUserAccess->wpAny('manage_options')->part('settings')->can('vc-general-tab')
                                                 ->get()
            && (!is_multisite() || !is_main_site());
        $args = [
            'tabs' => $this->getTabs(),
            'pageSlug' => $this->getSlug(),
            'activeSlug' => $request->input('tab', $this->defaultTabSlug),
            'hasAccessToSettings' => $hasAccessToSettings,
        ];

        $this->setSlug($this->getSlug())->setTemplatePath('settings/pages/about/index')->setTemplateArgs($args)
             ->render();
    }
}
