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
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\Settings\Traits\Page;
use VisualComposer\Modules\Settings\Traits\SubMenu;

/**
 * Class UpdateBePage
 * @package VisualComposer\Modules\Hub\Pages
 */
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
     * UpdateBePage constructor.
     */
    public function __construct()
    {
        $this->wpAddAction(
            'admin_menu',
            function (License $licenseHelper, Options $optionsHelper, Request $requestHelper, Update $updateHelper) {
                if (
                    ($licenseHelper->isPremiumActivated() || $optionsHelper->get('agreeHubTerms'))
                    && $optionsHelper->get('bundleUpdateRequired')
                ) {
                    $actions = $updateHelper->getRequiredActions();
                    if (!empty($actions['actions']) || !empty($actions['posts'])) {
                        $this->call('addPage');

                        return;
                    }

                    $optionsHelper->set('bundleUpdateRequired', false);
                }

                // Bundle Update not required, or Actions was empty
                if ($requestHelper->input('page') === $this->getSlug()) {
                    $optionsHelper->set('bundleUpdateRequired', false);
                    wp_safe_redirect(admin_url('admin.php?page=vcv-getting-started'));
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
        wp_enqueue_script('vcv:wpUpdate:script');
        wp_enqueue_style('vcv:wpVcSettings:style');
        wp_enqueue_script('vcv:assets:runtime:script');
    }

    /**
     * @throws \Exception
     */
    protected function addPage()
    {
        $page = [
            'slug' => $this->getSlug(),
            'title' => __('Update', 'visualcomposer'),
            'capability' => 'edit_posts',
            'layout' => 'dashboard-tab-content-standalone',
            'showTab' => false,
            'isDashboardPage' => true,
            'hideInWpMenu' => false,
            'hideTitle' => true,
            'iconClass' => 'vcv-ui-icon-dashboard-update',
        ];
        $this->addSubmenuPage($page, false);
    }

    /**
     * @param $response
     *
     * @return string
     */
    protected function afterRender($response)
    {
        return $response . implode('', vcfilter('vcv:update:extraOutput', []));
    }
}
