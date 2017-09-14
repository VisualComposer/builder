<?php

namespace VisualComposer\Modules\Settings\Pages;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Token;
use VisualComposer\Modules\Settings\Traits\Page;

/**
 * Class Premium.
 */
class Premium extends About /*implements Module*/
{
    use Page;
    use EventsFilters;

    /**
     * @var string
     */
    protected $slug = 'vcv-upgrade';

    /**
     * Premium constructor.
     *
     * @param \VisualComposer\Helpers\Token $tokenHelper
     * @param \VisualComposer\Helpers\License $licenseHelper
     */
    public function __construct(Token $tokenHelper, License $licenseHelper)
    {
        /** @see \VisualComposer\Modules\Settings\Pages\Premium::addPage */
        $this->addFilter(
            'vcv:settings:getPages',
            'addPage',
            70
        );
        /** @see \VisualComposer\Modules\Settings\Pages\Premium::redirectToAccount */
        $this->addEvent('vcv:inited', 'redirectToAccount');
        /** @see \VisualComposer\Modules\Settings\Pages\Premium::unsetOptions */
        $this->addEvent('vcv:system:factory:reset', 'unsetOptions');
    }

    /**
     * Redirect to account to select license
     *
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserHelper
     * @param \VisualComposer\Helpers\License $licenseHelper
     * @param \VisualComposer\Modules\Settings\Pages\Premium $premiumPageModule
     * @param \VisualComposer\Helpers\Options $optionsHelper
     */
    protected function redirectToAccount(
        Request $requestHelper,
        CurrentUser $currentUserHelper,
        License $licenseHelper,
        Premium $premiumPageModule,
        Options $optionsHelper
    ) {
        if (!$currentUserHelper->wpAll('manage_options')->get()) {
            return;
        } elseif ($licenseHelper->isActivated() && $requestHelper->input('page') === $premiumPageModule->getSlug()
            && !$optionsHelper->getTransient(
                'license:activation:fromPremium'
            )) {
            $aboutPage = vcapp('SettingsPagesAbout');
            wp_redirect(admin_url('admin.php?page=' . rawurlencode($aboutPage->getSlug())));
            exit;
        } elseif ($requestHelper->input('page') === $premiumPageModule->getSlug()
            && !$optionsHelper->getTransient(
                'license:activation:fromPremium'
            )) {
            $optionsHelper->setTransient('license:activation:fromPremium', 1);
            $optionsHelper->deleteTransient('vcv:hub:download:json');
            wp_redirect(
                VCV_ACTIVATE_LICENSE_URL .
                '/?redirect=' . admin_url('admin.php?page=' . rawurlencode($premiumPageModule->getSlug())) .
                '&token=' . rawurlencode($licenseHelper->newKeyToken()) .
                '&url=' . VCV_PLUGIN_URL
            );
            exit;
        }
    }

    /**
     * @param array $pages
     *
     * @return array
     */
    protected function addPage($pages)
    {
        $tokenHelper = vchelper('Token');
        $licenseHelper = vchelper('License');
        $optionsHelper = vchelper('Options');

        if (!$tokenHelper->isSiteAuthorized()
            || $licenseHelper->isActivated()
            && !$optionsHelper->getTransient(
                'license:activation:fromPremium'
            )) {
            return $pages;
        }

        $pages[] = [
            'slug' => $this->getSlug(),
            'title' => $this->premiumIcon() . '<strong style="color:#fff;vertical-align: middle;font-weight:700">' .
                __('Go Premium', 'vcwb') . '</strong>',
            'layout' => 'standalone',
            'showTab' => false,
            'controller' => $this,
            'capability' => 'manage_options',
        ];

        return $pages;
    }

    protected function premiumIcon()
    {
        return '<svg version="1.1" id="Star" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 20 20" style="enable-background:new 0 0 20 20;fill:#fff;width:20px;padding: 0 8px 0 0;vertical-align: -6px;" xml:space="preserve">
<path d="M10,1.3l2.388,6.722H18.8l-5.232,3.948l1.871,6.928L10,14.744l-5.438,4.154l1.87-6.928L1.199,8.022h6.412L10,1.3z"/>
</svg>';
    }

    public function getActivePage()
    {
        return 'download';
    }

    /**
     * @param \VisualComposer\Helpers\Options $optionsHelper
     */
    protected function unsetOptions(Options $optionsHelper)
    {
        $optionsHelper->deleteTransient('license:activation:fromPremium');
    }
}
