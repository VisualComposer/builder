<?php

namespace VisualComposer\Modules\Account\Pages;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Modules\Settings\Traits\Page;

class ActivationFinishPage extends Container implements Module
{
    use Page;
    use EventsFilters;

    /**
     * @var string
     */
    protected $slug = 'vcv-activated';

    /**
     * @var string
     */
    protected $templatePath = 'account/pages/activation-finish';

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Account\Pages\ActivationFinishPage::addPage */
        $this->addFilter(
            'vcv:settings:getPages',
            'addPage',
            40
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
            'title' => __('Activation', 'vc5'),
            'controller' => $this,
        ];

        return $pages;
    }
}
