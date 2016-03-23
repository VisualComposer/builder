<?php

namespace VisualComposer\Modules\Settings\Pages;

use VisualComposer\Framework\Container;
use VisualComposer\Modules\Settings\Page;

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
            'title' => __('Authorize Site', 'vc5'),
            'controller' => $this,
        ];

        return $pages;
    }
}
