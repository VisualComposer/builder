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
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\Settings\Traits\Page;
use VisualComposer\Modules\Settings\Traits\SubMenu;

/**
 * Class About.
 */
class About extends Container implements Module
{
    use Page;
    use SubMenu;
    use WpFiltersActions;
    use EventsFilters;

    /**
     * @var string
     */
    protected $slug = 'vcv-about';

    /**
     * @var string
     */
    protected $templatePath = 'license/layout';

    /**
     * About constructor.
     */
    public function __construct()
    {
        $this->wpAddAction(
            'admin_menu',
            function (Request $requestHelper, License $licenseHelper) {
                if (!$licenseHelper->getKey()) {
                    if ($requestHelper->input('page') === $this->getSlug()) {
                        wp_redirect(admin_url('admin.php?page=vcv-getting-started'));
                        exit;
                    }
                } else {
                    /** @see \VisualComposer\Modules\Settings\Pages\About::addPage */
                    $this->call('addPage');
                }
            },
            11
        );
    }

    /**
     *
     */
    protected function beforeRender()
    {
        $urlHelper = vchelper('Url');
        wp_register_script(
            'vcv:wpUpdate:script',
            $urlHelper->to('public/dist/wpUpdate.bundle.js'),
            ['vcv:assets:vendor:script'],
            VCV_VERSION
        );
        wp_register_style(
            'vcv:wpUpdate:style',
            $urlHelper->to('public/dist/wpUpdate.bundle.css'),
            [],
            VCV_VERSION
        );
        wp_enqueue_script('vcv:wpUpdate:script');
        wp_enqueue_style('vcv:wpUpdate:style');
    }

    /**
     * @throws \Exception
     */
    protected function addPage()
    {
        $page = [
            'slug' => $this->getSlug(),
            'title' => __('About', 'vcwb'),
            'layout' => 'standalone',
            'showTab' => false,
            'controller' => $this,
            'capability' => 'edit_posts',
        ];
        $this->addSubmenuPage($page);
    }
}
