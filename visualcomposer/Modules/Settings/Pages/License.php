<?php

namespace VisualComposer\Modules\Settings\Pages;

use VisualComposer\Framework\ContainerInner;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Modules\Settings\Traits\Page;

/**
 * Class License.
 */
class License extends ContainerInner implements Module
{
    use Page;
    /**
     * @var string
     */
    protected $slug = 'vcv-license';
    /**
     * @var string
     */
    protected $templatePath = 'settings/pages/license/index';

    /**
     * License constructor.
     */
    public function __construct()
    {
        add_filter(
            'vcv:settings:getPages',
            function ($pages) {
                /** @see \VisualComposer\Modules\Settings\Pages\License::addPage */
                return $this->call('addPage', [$pages]);
            },
            30
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
