<?php

namespace VisualComposer\Modules\Settings\Pages;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\Settings\Traits\Page;

class Settings extends Container implements Module
{
    use Page;
    use EventsFilters;
    use WpFiltersActions;

    /**
     * @var string
     */
    protected $slug = 'vcv-settings';

    /**
     * @var string
     */
    protected $templatePath = 'settings/pages/index';

    /**
     * General constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Settings\Pages\PostTypes::addPage */
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
    protected function addPage($pages)
    {
        $currentUserAccess = vchelper('AccessCurrentUser');
        if (!$currentUserAccess->wpAll('manage_options')->get()) {
            return $pages;
        }
        $pages[] = [
            'slug' => $this->getSlug(),
            'title' => __('Settings', 'vcwb'),
            'showTab' => false,
            'layout' => 'settings-standalone',
            'controller' => $this,
        ];

        return $pages;
    }
}
