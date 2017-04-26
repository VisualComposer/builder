<?php

namespace VisualComposer\Modules\Settings\Pages;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Modules\Account\Pages\ActivationPage;
use VisualComposer\Modules\Settings\Traits\Page;

/**
 * Class About.
 */
class About extends ActivationPage implements Module
{
    use EventsFilters;

    /**
     * @var string
     */
    protected $slug = 'vcv-about';

    /**
     * About constructor.
     */
    public function __construct(Token $tokenHelper)
    {
        if (!$tokenHelper->isSiteAuthorized()) {
            return;
        }
        /** @see \VisualComposer\Modules\Settings\Pages\About::addPage */
        $this->addFilter(
            'vcv:settings:getPages',
            'addPage',
            70
        );
    }

    /**
     * @param array $pages
     *
     * @return array
     */
    protected function addPage($pages)
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

    public function getActivePage()
    {
        return 'last';
    }
}
