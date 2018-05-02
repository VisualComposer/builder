<?php

namespace VisualComposer\Modules\Hub\Download\Pages;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Modules\Settings\Traits\Page;

class UpdateBePage extends Container implements Module
{
    use Page;
    use EventsFilters;

    /**
     * @var string
     */
    protected $slug = 'vcv-update';

    /**
     * @var string
     */
    protected $templatePath = 'hub/updating-layout';

    public function __construct(Token $tokenHelper)
    {
        $this->addEvent(
            'vcv:inited',
            function (Options $optionsHelper, Request $requestHelper, Token $tokenHelper) {
                if ($tokenHelper->isSiteAuthorized() && $optionsHelper->get('bundleUpdateRequired')) {
                    $this->addFilter(
                        'vcv:settings:getPages',
                        'addPage',
                        40
                    );
                } elseif ($requestHelper->input('page') === $this->getSlug()) {
                    $aboutPage = vcapp('SettingsPagesAbout');
                    wp_redirect(admin_url('admin.php?page=' . rawurlencode($aboutPage->getSlug())));
                    exit;
                }
            }
        );
    }

    /**
     *
     */
    protected function beforeRender()
    {
        wp_dequeue_script('vcv:settings:script');
    }

    /**
     * @param array $pages
     *
     * @return array
     */
    protected function addPage($pages)
    {
        $currentUserAccess = vchelper('AccessCurrentUser');
        if (!$currentUserAccess->wpAll('edit_posts')->get()) {
            return $pages;
        }
        $pages[] = [
            'slug' => $this->getSlug(),
            'title' => __('Update', 'vcwb'),
            'showTab' => false,
            'layout' => 'standalone',
            'controller' => $this,
            'capability' => 'edit_posts',
        ];

        return $pages;
    }
}
