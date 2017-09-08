<?php

namespace VisualComposer\Modules\Settings\Pages;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Token;
use VisualComposer\Modules\Settings\Traits\Page;

/**
 * Class Premium.
 */
class Premium extends Container /*implements Module*/
{
    use Page;
    use EventsFilters;

    /**
     * @var string
     */
    protected $slug = 'vcv-update-to-premium';

    /**
     * Premium constructor.
     *
     * @param \VisualComposer\Helpers\Token $tokenHelper
     */
    public function __construct(Token $tokenHelper, License $licenseHelper)
    {
        if (!$tokenHelper->isSiteAuthorized() || $licenseHelper->isActivated()) {
            return;
        }

        /** @see \VisualComposer\Modules\Settings\Pages\Premium::addPage */
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
            'title' => __('Premium', 'vcwb'),
            'layout' => 'premium',
            'showTab' => false,
            'controller' => $this,
            'capability' => 'manage_options',
        ];

        return $pages;
    }
}
