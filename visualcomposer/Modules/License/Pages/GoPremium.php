<?php

namespace VisualComposer\Modules\License\Pages;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Request;
use VisualComposer\Modules\Settings\Traits\Page;
use VisualComposer\Modules\Settings\Traits\SubMenu;

/**
 * Class GoPremium
 * @package VisualComposer\Modules\License\Pages
 */
class GoPremium extends Container implements Module
{
    use Page;
    use SubMenu;
    use EventsFilters;
    use WpFiltersActions;

    /**
     * @var string
     */
    protected $slug = 'vcv-go-premium';

    /**
     * GoPremium constructor.
     *
     * @param \VisualComposer\Helpers\License $licenseHelper
     */
    public function __construct(License $licenseHelper)
    {
        if (!$licenseHelper->isPremiumActivated()) {
            /** @see \VisualComposer\Modules\License\Pages\GoPremium::addJs */
            $this->wpAddAction('in_admin_footer', 'addJs');

            /** @see \VisualComposer\Modules\License\Pages\GoPremium::addCss */
            $this->wpAddAction('in_admin_header', 'addCss');
        }

        $this->wpAddAction(
            'admin_menu',
            function (License $licenseHelper, Request $requestHelper) {
                if (!vchelper('AccessCurrentUser')->wpAll('manage_options')->get()) {
                    return;
                }

                if (!$licenseHelper->isPremiumActivated() && !$licenseHelper->isThemeActivated()) {
                    $this->call('addPage');
                }

                if ($requestHelper->input('page') === $this->getSlug()) {
                    if ($licenseHelper->isFreeActivated()) {
                        // Check is license is upgraded?
                        $licenseHelper->refresh();
                    } elseif ($licenseHelper->isPremiumActivated()) {
                        wp_redirect(admin_url('admin.php?page=vcv-about'));
                        exit;
                    }
                }
            },
            70
        );
    }

    /**
     * @throws \Exception
     */
    protected function addPage()
    {
        $page = [
            'slug' => $this->getSlug(),
            'title' => $this->buttonTitle(),
            'layout' => 'standalone',
            'showTab' => false,
            'capability' => 'manage_options',
        ];
        $this->addSubmenuPage($page);
    }

    /**
     * @return string
     */
    protected function buttonTitle()
    {
        return sprintf(
            '<strong style="vertical-align: middle;font-weight:500;">%s</strong>',
            __('&#9733; Go Premium', 'visualcomposer')
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
            'vcv:wpVcSettings:style',
            $urlHelper->to('public/dist/wpVcSettings.bundle.css'),
            [],
            VCV_VERSION
        );
        wp_enqueue_script('vcv:wpUpdate:script');
        wp_enqueue_style('vcv:wpVcSettings:style');
    }

    /**
     * Add target _blank to external "Go Premium" link in sidebar
     */
    protected function addJs()
    {
        evcview('license/get-premium-js');
    }

    /**
     * Add style to "Go Premium" link in sidebar
     */
    protected function addCss()
    {
        evcview('license/get-premium-css');
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
