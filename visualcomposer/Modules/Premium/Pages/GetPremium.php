<?php

namespace VisualComposer\Modules\Premium\Pages;

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
use VisualComposer\Helpers\Token;
use VisualComposer\Modules\Settings\Traits\Page;

/**
 * Class GetPremium.
 */
class GetPremium extends Container implements Module
{
    use Page;
    use EventsFilters;
    use WpFiltersActions;

    /**
     * @var string
     */
    protected $slug = 'vcv-go-premium';

    /**
     * @var string
     */
    protected $templatePath = 'account/partials/activation-layout';

    public function __construct(License $licenseHelper, Token $tokenHelper, Request $requestHelper)
    {
        if ('account' === vcvenv('VCV_ENV_ADDONS_ID') && vcvenv('VCV_ENV_LICENSES')) {
            if (!$licenseHelper->isActivated()) {
                $this->wpAddAction(
                    'in_admin_footer',
                    'addJs'
                );
                $this->wpAddAction(
                    'in_admin_header',
                    'addCss'
                );
            }

            $this->addEvent(
                'vcv:inited',
                function (License $licenseHelper, Request $requestHelper) {
                    if (!$licenseHelper->isActivated()) {
                        /** @see \VisualComposer\Modules\Account\Pages\ActivationPage::addPage */
                        $this->addFilter(
                            'vcv:settings:getPages',
                            'addPage',
                            70
                        );
                    } elseif ($requestHelper->input('page') === $this->getSlug()) {
                        $aboutPage = vcapp('SettingsPagesAbout');
                        wp_redirect(admin_url('admin.php?page=' . rawurlencode($aboutPage->getSlug())));
                        exit;
                    }
                },
                70
            );

            if (!$tokenHelper->isSiteAuthorized()
                || ($tokenHelper->isSiteAuthorized() && !$licenseHelper->isActivated())
            ) {
                $this->wpAddFilter(
                    'plugin_action_links_' . VCV_PLUGIN_BASE_NAME,
                    'pluginsPageLink'
                );
            }
        }
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
            'title' => $this->buttonTitle(),
            'layout' => 'standalone',
            'showTab' => false,
            'controller' => $this,
            'capability' => 'manage_options',
        ];

        return $pages;
    }

    protected function buttonTitle()
    {
        return sprintf(
            '<strong style="vertical-align: middle;font-weight:500;">%s</strong>',
            __('Go Premium', 'vcwb')
        );
    }

    /**
     * Add target _blank to external "Go Premium" link in sidebar
     */
    protected function addJs()
    {
        evcview('premium/partials/get-premium-js');
    }

    /**
     * Add style to "Go Premium" link in sidebar
     */
    protected function addCss()
    {
        evcview('premium/partials/get-premium-css');
    }

    public function getActivePage()
    {
        return 'go-premium';
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
        $getPremiumPage = vcapp('PremiumPagesGetPremium');

        $goPremiumLink = '<a href="' . esc_url(admin_url('admin.php?page=' . rawurlencode($getPremiumPage->getSlug()))) . '&vcv-ref=plugins-page">' . __('Go Premium', 'vcwb') . '</a>';

        array_push($links, $goPremiumLink);

        return $links;
    }
}
