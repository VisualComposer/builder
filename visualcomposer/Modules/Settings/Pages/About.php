<?php

namespace VisualComposer\Modules\Settings\Pages;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Modules\Settings\Traits\Page;

/**
 * Class About.
 */
class About extends Container implements Module
{
    use Page;
    use EventsFilters;

    /**
     * @var string
     */
    protected $slug = 'vcv-about';

    /**
     * @var string
     */
    protected $templatePath = 'account/partials/activation-layout';

    /**
     * About constructor.
     */
    public function __construct()
    {
        $this->addEvent(
            'vcv:inited',
            function (Token $tokenHelper, Request $requestHelper) {
                if (!$tokenHelper->isSiteAuthorized()) {
                    if ($requestHelper->input('page') === $this->getSlug()) {
                        $activationPageModule = vcapp('AccountPagesActivationPage');
                        wp_redirect(admin_url('admin.php?page=' . rawurlencode($activationPageModule->getSlug())));
                        exit;
                    }
                } else {
                    /** @see \VisualComposer\Modules\Settings\Pages\About::addPage */
                    $this->addFilter(
                        'vcv:settings:getPages',
                        'addPage',
                        70
                    );
                }
            }
        );
    }

    /**
     *
     */
    protected function beforeRender()
    {
        wp_enqueue_script('vcv:settings:script');
        wp_enqueue_style('vcv:settings:style');
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
