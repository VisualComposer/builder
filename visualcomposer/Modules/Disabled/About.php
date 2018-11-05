<?php

namespace VisualComposer\Modules\Disabled;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Token;
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
    protected $templatePath = 'account/partials/activation-layout';

    /**
     * About constructor.
     */
    public function __construct()
    {
        if (vcvenv('VCV_FT_ACTIVATION_REDESIGN')) {
            return;
        }
        $this->wpAddAction(
            'admin_menu',
            function (Token $tokenHelper, Request $requestHelper, License $licenseHelper) {
                if (($tokenHelper->isSiteAuthorized() && !$licenseHelper->getKey())
                    || !$tokenHelper->isSiteAuthorized()) {
                    if ($requestHelper->input('page') === $this->getSlug()) {
                        $url = vcapp('LicensePagesActivationPage')->getSlug();
                        wp_redirect(admin_url('admin.php?page=' . rawurlencode($url)));
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
        $bundleName = 'wpsettings';
        $urlHelper = vchelper('Url');
        wp_register_script(
            'vcv:settings:script',
            $urlHelper->assetUrl('dist/' . $bundleName . '.bundle.js'),
            [],
            VCV_VERSION
        );
        wp_register_style(
            'vcv:settings:style',
            $urlHelper->assetUrl('dist/' . $bundleName . '.bundle.css'),
            [],
            VCV_VERSION
        );
        wp_enqueue_script('vcv:settings:script');
        wp_enqueue_style('vcv:settings:style');
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

    public function getActivePage()
    {
        $licenseHelper = vchelper('License');
        if ($licenseHelper->isActivated()) {
            return 'last-go-premium';
        }

        return 'last';
    }
}
