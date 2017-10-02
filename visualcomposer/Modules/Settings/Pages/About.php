<?php

namespace VisualComposer\Modules\Settings\Pages;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Modules\Account\Pages\ActivationPage;

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
     *
     * @param \VisualComposer\Helpers\Token $tokenHelper
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
            'title' => __('About', 'vcwb'),
            'layout' => 'standalone',
            'showTab' => false,
            'controller' => $this,
            'capability' => 'edit_posts',
        ];

        return $pages;
    }

    public function getActivePage()
    {
        $licenseHelper = vchelper('License');
        if ($licenseHelper->isActivated()) {
            return 'last-go-premium';
        }

        return 'last';
    }
}
