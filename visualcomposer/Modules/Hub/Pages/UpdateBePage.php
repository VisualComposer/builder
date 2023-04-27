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
        $this->wpAddAction('admin_menu', 'addUpdatePage', 40);
    }

    /**
     * We use it to launch update process in plugin settings.
     *
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param \VisualComposer\Helpers\Hub\Update $updateHelper
     *
     * @throws \ReflectionException
     * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
     */
    protected function addUpdatePage(Options $optionsHelper, Update $updateHelper)
    {
        if ($updateHelper->isBundleUpdateRequired()) {
            $actions = $updateHelper->getRequiredActions();
            if (!empty($actions['actions']) || !empty($actions['posts'])) {
                $this->call('addPage');

                return;
            }

            $optionsHelper->set('bundleUpdateRequired', false);
        }

        $this->call('redirectAfterUpdate');
    }

    /**
     * Redirect user back to his initial settings page after our update.
     *
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Options $optionsHelper
     */
    protected function redirectAfterUpdate(Request $requestHelper, Options $optionsHelper)
    {
        // Bundle Update not required, or Actions was empty
        if ($requestHelper->input('page') !== $this->getSlug()) {
            return;
        }

        $optionsHelper->set('bundleUpdateRequired', false);

        $redirectPage = empty($_COOKIE['vcv:redirect:update:url']) ? 'vcv-getting-started' : $_COOKIE['vcv:redirect:update:url'];

        unset($_COOKIE['vcv:redirect:update:url']);

        wp_safe_redirect(admin_url('admin.php?page=' . $redirectPage));
        exit;
    }

    /**
     * Add update page to menu.
     *
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

    protected function beforeRender()
    {
        wp_enqueue_script('vcv:wpUpdate:script');
        wp_enqueue_style('vcv:wpVcSettings:style');
        wp_enqueue_script('vcv:assets:runtime:script');
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
