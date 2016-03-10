<?php

namespace VisualComposer\Modules\Settings\Pages;

use VisualComposer\Helpers\Generic\Request;
use VisualComposer\Modules\Access\CurrentUser\Access as CurrentUserAccess;
use VisualComposer\Framework\Container;

class About extends Container
{
    use Page;
    /**
     * @var string
     */
    private $pageSlug = 'vc-v-about';
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
            function () {
                $args = func_get_args();

                return $this->call('addPage', $args);
            }
        );

        add_action(
            'vc:v:settings:pageRender:' . $this->getPageSlug(),
            function () {
                $args = func_get_args();
                $this->call('renderPage', $args);
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
     * @return string
     */
    public function getPageSlug()
    {
        return $this->pageSlug;
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
            'slug' => $this->getPageSlug(),
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
            'pageSlug' => $this->getPageSlug(),
            'activeSlug' => $request->input('tab', $this->defaultTabSlug),
            'hasAccessToSettings' => $hasAccessToSettings,
        ];

        $this->setSlug($this->getPageSlug())->setTemplatePath('settings/pages/about/index')->setTemplateArgs($args)
             ->render();
    }
}
