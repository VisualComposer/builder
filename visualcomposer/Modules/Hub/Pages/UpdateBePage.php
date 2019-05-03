<?php

namespace VisualComposer\Modules\Hub\Pages;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Hub\Update;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\Settings\Traits\Page;
use VisualComposer\Modules\Settings\Traits\SubMenu;

class UpdateBePage extends Container implements Module
{
    use Page;
    use SubMenu;
    use WpFiltersActions;
    use EventsFilters;

    /**
     * @var string
     */
    protected $slug = 'vcv-update';

    /**
     * @var string
     */
    protected $templatePath = 'license/layout';

    public function __construct()
    {
        $this->wpAddAction(
            'admin_menu',
            function (Options $optionsHelper, Request $requestHelper, Update $updateHelper) {
                if ($optionsHelper->get('bundleUpdateRequired')) {
                    $actions = $updateHelper->getRequiredActions();
                    if (!empty($actions['actions']) || !empty($actions['posts'])) {
                        $this->call('addPage');

                        return;
                    }
                }

                // Bundle Update not required, or Actions was empty
                if ($requestHelper->input('page') === $this->getSlug()) {
                    $optionsHelper->set('bundleUpdateRequired', false);
                    wp_redirect(admin_url('admin.php?page=vcv-about'));
                    exit;
                }
            },
            40
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
            'title' => __('Update', 'vcwb'),
            'showTab' => false,
            'layout' => 'standalone',
            'controller' => $this,
            'capability' => 'edit_posts',
        ];
        $this->addSubmenuPage($page);
    }
}
