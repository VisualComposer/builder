<?php

namespace VisualComposer\Modules\Settings\Pages;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Framework\Container;
use VisualComposer\Modules\Settings\Traits\Page;

/**
 * Class About
 */
class About extends Container implements Module
{
    use Page;
    /**
     * @var string
     */
    protected $slug = 'vcv-about';
    /**
     * @var string
     */
    protected $defaultTabSlug = 'vcv-main';
    /**
     * @var string
     */
    protected $templatePath = 'settings/pages/about/index';
    /**
     * @var array
     */
    protected $tabs;

    /**
     * About constructor
     */
    public function __construct()
    {
        add_filter(
            'vcv:settings:getPages',
            function ($pages) {
                /** @see \VisualComposer\Modules\Settings\Pages\About::addPage */
                return $this->call('addPage', [$pages]);
            }
        );

        $this->setTabs(
            [
                [
                    'slug' => 'vcv-main',
                    'title' => __('What\'s New', 'vc5'),
                    'view' => 'settings/pages/about/partials/main',
                ],
                [
                    'slug' => 'vcv-faq',
                    'title' => __('FAQ', 'vc5'),
                    'view' => 'settings/pages/about/partials/faq',
                ],
                [
                    'slug' => 'vcv-resources',
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
     *
     * @return $this
     */
    public function setTabs($tabs)
    {
        $this->tabs = apply_filters(
            'vcv:settings:page:about:tabs',
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
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserAccess
     *
     * @throws \Exception
     */
    protected function beforeRender(Request $request, CurrentUser $currentUserAccess)
    {
        $hasAccessToSettings = $currentUserAccess->wpAny('manage_options')->part('settings')->can('vcv-general-tab')
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
