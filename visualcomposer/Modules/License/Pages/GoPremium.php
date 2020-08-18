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
    protected $slug = 'vcv-go-premium';

    /**
     * GoPremium constructor.
     *
     * @param \VisualComposer\Helpers\License $licenseHelper
     */
    public function __construct(License $licenseHelper)
    {
        $this->wpAddAction('current_screen', 'hubActivationNotice');

        if (!$licenseHelper->isPremiumActivated()) {
            /** @see \VisualComposer\Modules\License\Pages\GoPremium::addJs */
            $this->wpAddAction('in_admin_footer', 'addJs');

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

                if ($requestHelper->input('page') === $this->getSlug()) {
                    if ($licenseHelper->isFreeActivated()) {
                        // Check is license is upgraded?
                        $licenseHelper->refresh();
                    } elseif ($licenseHelper->isPremiumActivated() && !$licenseHelper->isThemeActivated()) {
                        wp_redirect(admin_url('admin.php?page=vcv-getting-started'));
                        exit;
                    }
                }
            },
            70
        );
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
        if (!$licenseHelper->isAnyActivated() && !strpos($screen->id, $this->slug) && !strpos($screen->id, 'vcv-getting-started')) {
            if (!isset($notices['hubActivationNotice'])) {
                $noticeHelper->addNotice(
                    'hubActivationNotice',
                    sprintf(
                        __(
                            '<strong>Visual Composer:</strong> <a href="%s">Activate Visual Composer Hub</a> with Free or Premium subscription to get more content elements, templates, and add-ons.',
                            'visualcomposer'
                        ),
                        admin_url('admin.php?page=vcv-getting-started')
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
     * @return string
     */
    protected function buttonTitle()
    {
        $licenseHelper = vchelper('License');

        return sprintf(
            '<strong style="vertical-align: middle;font-weight:500;">&#9733; %s</strong>',
            $licenseHelper->activationButtonTitle()
        );
    }

    /**
     * Add go premium link in plugins page
     *
     * @param $links
     *
     * @return mixed
     */
    protected function pluginsPageLink($links)
    {
        /** @noinspection HtmlUnknownTarget */
        $goPremiumLink = sprintf(
            '<a href="%s" class="vcv-plugins-go-premium">%s</a>',
            esc_url(admin_url('admin.php?page=vcv-go-premium&vcv-ref=plugins-page')),
            __('Go Premium', 'visualcomposer')
        );

        $links[] = $goPremiumLink;

        return $links;
    }

    /**
     * Add help center, api, premium support links in plugins page
     *
     * @param $pluginLinks
     *
     * @return mixed
     */
    protected function pluginRowMeta($pluginLinks, $pluginFile)
    {
        $urlHelper = vchelper('Url');
        wp_register_script(
            'vcv:wpVcSettings:script',
            $urlHelper->to('public/dist/wpVcSettings.bundle.js'),
            ['vcv:assets:vendor:script'],
            VCV_VERSION
        );
        wp_enqueue_script('vcv:wpVcSettings:script');
        wp_enqueue_script('vcv:assets:runtime:script');

        if (VCV_PLUGIN_BASE_NAME === $pluginFile) {
            $rowMeta = [
                'helpCenter' => sprintf(
                    '<a href="%s" target="_blank">%s</a>',
                    'https://visualcomposer.com/help/?utm_medium=wp-dashboard&utm_source=plugins-page&utm_campaign=vcwb&utm_content=help-center-link',
                    __('Help Center', 'visualcomposer')
                ),
                'api' => sprintf(
                    '<a href="%s" target="_blank">%s</a>',
                    'https://visualcomposer.com/help/api/?utm_medium=wp-dashboard&utm_source=plugins-page&utm_campaign=vcwb&utm_content=api-link',
                    __('API', 'visualcomposer')
                ),
                'premiumSupport' => sprintf(
                    '<a href="%s" target="_blank">%s</a>',
                    'https://my.visualcomposer.com/support/?utm_medium=wp-dashboard&utm_source=plugins-page&utm_campaign=vcwb&utm_content=premium-support-link',
                    __('Premium Support', 'visualcomposer')
                ),
            ];

            return array_merge($pluginLinks, $rowMeta);
        }

        return (array)$pluginLinks;
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
