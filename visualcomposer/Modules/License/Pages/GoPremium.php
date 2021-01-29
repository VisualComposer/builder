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
use VisualComposer\Helpers\Notice;
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
    protected $slug = 'vcv-activate-license';

    /**
     * GoPremium constructor.
     *
     * @param \VisualComposer\Helpers\License $licenseHelper
     */
    public function __construct(License $licenseHelper)
    {
        $this->wpAddAction('current_screen', 'hubActivationNotice');

        if (!$licenseHelper->isPremiumActivated()) {
            /** @see \VisualComposer\Modules\License\Pages\GoPremium::addCss */
            $this->wpAddAction('admin_head', 'addCss');
        }

        $this->wpAddAction(
            'admin_menu',
            function (License $licenseHelper, Request $requestHelper) {
                if (!vchelper('AccessCurrentUser')->wpAll('manage_options')->get()) {
                    return;
                }

                if (!$licenseHelper->isPremiumActivated() || $licenseHelper->isThemeActivated()) {
                    $this->call('addPage');
                }

                if (
                    $requestHelper->input('page') === $this->getSlug()
                    && $licenseHelper->isPremiumActivated()
                    && !$licenseHelper->isThemeActivated()
                ) {
                    wp_redirect(admin_url('admin.php?page=vcv-getting-started'));
                    exit;
                }
            },
            70
        );
        $this->addFilter('vcv:editor:variables vcv:wp:dashboard:variables', 'addVariables');
    }

    protected function addVariables($variables, $payload)
    {
        $variables[] = [
            'key' => 'vcvGoPremiumUrl',
            'value' => set_url_scheme(admin_url('admin.php?page=vcv-activate-license')),
            'type' => 'variable',
        ];

        return $variables;
    }

    /**
     * Notice user if there is no activation.
     *
     * @param \VisualComposer\Helpers\Notice $noticeHelper
     * @param \VisualComposer\Helpers\License $licenseHelper
     */
    protected function hubActivationNotice(Notice $noticeHelper, License $licenseHelper)
    {
        $notices = $noticeHelper->all();
        $screen = get_current_screen();
        if (
            !$licenseHelper->isPremiumActivated()
            && !strpos($screen->id, $this->slug)
            && !strpos(
                $screen->id,
                'vcv-getting-started'
            )
        ) {
            if (!isset($notices['hubActivationNotice'])) {
                $noticeHelper->addNotice(
                    'hubActivationNotice',
                    sprintf(
                        __(
                            '<strong>Visual Composer:</strong> <a href="%s">Activate Premium</a> license to get full access to Visual Composer Hub. A place to download more content elements, templates, and addons.',
                            'visualcomposer'
                        ),
                        admin_url('admin.php?page=vcv-activate-license&vcv-ref=wpdashboard')
                    ),
                    'info'
                );
            }
        } else {
            $noticeHelper->removeNotice('hubActivationNotice');
        }
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
        wp_enqueue_script('vcv:assets:runtime:script');
    }

    /**
     * @return string
     */
    protected function buttonTitle()
    {
        return sprintf(
            '<strong style="vertical-align: middle;font-weight:500;">&#9733; %s</strong>',
            __('Activate Premium', 'visualcomposer')
        );
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
