<?php

namespace VisualComposer\Modules\Settings\Pages;

use VisualComposer\Framework\Container;

/**
 * Class Authorization
 * @package VisualComposer\Modules\Settings\Pages
 */
class Authorization extends Container
{
    use Page;
    protected $slug = 'vc-v-auth';
    protected $templatePath = 'settings/pages/auth/index';

    public function __construct()
    {
        add_filter(
            'vc:v:settings:getPages',
            function ($pages) {
                return $this->call('addPage', [$pages]);
            }
        );

        add_action(
            'vc:v:settings:pageRender:' . $this->slug,
            function () {
                $this->call('render');
            }
        );
    }

    /**
     * @param array $pages
     *
     * @return array
     */
    private function addPage($pages)
    {
        $pages[] = [
            'slug' => $this->slug,
            'title' => __('Authorize Site', 'vc5'),
        ];

        return $pages;
    }
}
