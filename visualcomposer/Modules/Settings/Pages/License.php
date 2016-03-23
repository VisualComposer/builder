<?php

namespace VisualComposer\Modules\Settings\Pages;

use VisualComposer\Framework\Container;
use VisualComposer\Modules\Settings\Page;

/**
 * Class License
 * @package VisualComposer\Modules\Settings\Pages
 */
class License extends Container
{
    use Page;
    /**
     * @var string
     */
    protected $slug = 'vc-v-license';
    protected $templatePath = 'settings/pages/license/index';

    /**
     * License constructor.
     */
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
            'title' => __('Product License', 'vc5'),
            'controller' => $this,
        ];

        return $pages;
    }
}
