<?php

namespace VisualComposer\Modules\Disabled;

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
    protected $templatePath = 'hub/updating-layout';

    public function __construct()
    {
        if (vcvenv('VCV_FT_ACTIVATION_REDESIGN')) {
            return;
        }

        $this->wpAddAction(
            'admin_menu',
            function (Options $optionsHelper, Request $requestHelper, Token $tokenHelper) {
                if ($tokenHelper->isSiteAuthorized() && $optionsHelper->get('bundleUpdateRequired')) {
                    $this->call('addPage');
                } elseif ($requestHelper->input('page') === $this->getSlug()) {
                    $aboutPage = vcapp('SettingsPagesAbout');
                    wp_redirect(admin_url('admin.php?page=' . rawurlencode($aboutPage->getSlug())));
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
            'vcv:settings:script',
            $urlHelper->assetUrl('dist/wpsettings.bundle.js'),
            [],
            VCV_VERSION
        );
        wp_register_style(
            'vcv:settings:style',
            $urlHelper->assetUrl('dist/wpsettings.bundle.css'),
            [],
            VCV_VERSION
        );
        wp_enqueue_script('vcv:settings:script');
        wp_enqueue_style('vcv:settings:style');
    }

    /**
     *
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
