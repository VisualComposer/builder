<?php

namespace VisualComposer\Modules\Settings\Pages;

use VisualComposer\Framework\Container;
//use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Filters;
use VisualComposer\Modules\Settings\Traits\Page;

/**
 * Class Hub.
 */
class Hub extends Container/* implements Module*/
{
    use Page;

    /**
     * @var string
     */
    protected $slug = 'vcv-hub';

    /**
     * @var string
     */
    protected $templatePath = 'settings/pages/hub/index';

    /**
     * Hub constructor.
     *
     * @param \VisualComposer\Helpers\Filters $filterHelper
     */
    public function __construct(Filters $filterHelper)
    {
        $filterHelper->listen(
            'vcv:settings:getPages',
            function ($pages) {
                /** @see \VisualComposer\Modules\Settings\Pages\Hub::addPage */
                return $this->call('addPage', [$pages]);
            },
            50
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
            'title' => __('HUB', 'vc5'),
            'controller' => $this,
        ];

        return $pages;
    }
}
