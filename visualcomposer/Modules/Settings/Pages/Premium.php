<?php

namespace VisualComposer\Modules\Settings\Pages;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Token;
use VisualComposer\Modules\Account\Pages\ActivationPage;

/**
 * Class Premium.
 */
class Premium extends ActivationPage implements Module
{
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
    public function __construct(Token $tokenHelper)
    {
        if (!$tokenHelper->isSiteAuthorized()) {
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
