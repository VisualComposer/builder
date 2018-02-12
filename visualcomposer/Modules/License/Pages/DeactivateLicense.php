<?php

namespace VisualComposer\Modules\License\Pages;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
// use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\Nonce;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;
use VisualComposer\Modules\Settings\Pages\Settings;
use VisualComposer\Modules\Settings\Traits\Fields;
use VisualComposer\Helpers\License;

/**
 * Class DeactivateLicense.
 */
class DeactivateLicense extends Container /*implements Module*/
{
    use Fields;
    use EventsFilters;
    use WpFiltersActions;

    public function getSlug()
    {
        /** @var Settings $settings */
        $settings = vcapp('SettingsPagesSettings');

        return $settings->getSlug();
    }

    public function __construct(License $licenseHelper)
    {
        if ('account' === vcvenv('VCV_ENV_ADDONS_ID')) {
            $this->optionGroup = $this->getSlug();
            $this->optionSlug = 'vcv-deactivate-license';

            if ($licenseHelper->isActivated()) {
                $this->wpAddAction(
                    'vcv:settings:initAdmin:page:' . $this->getSlug(),
                    'buildPage',
                    110
                );

                $this->addFilter('vcv:ajax:settings:license:deactivate', [$licenseHelper, 'deactivateInAccount']);
            }
        }
    }

    protected function buildPage(CurrentUser $currentUserAccess, Url $urlHelper, Nonce $nonceHelper)
    {
        if (!$currentUserAccess->wpAll('manage_options')->get()) {
            return;
        }
        $sectionCallback = function () use ($urlHelper, $nonceHelper) {
            $deactivatePremiumUrl = $urlHelper->adminAjax(
                ['vcv-action' => 'settings:license:deactivate', 'vcv-nonce' => $nonceHelper->admin()]
            );
            $deactivatePremiumTitle = __('Visual Composer account', 'vcwb');
            $deactivatePremium = sprintf(
                '<a href="%s">%s</a>',
                // @codingStandardsIgnoreStart
                $deactivatePremiumUrl,
                esc_html($deactivatePremiumTitle)
            );

            $sectionDescription = sprintf(
                __(
                    'You can deactivate your premium license on this site via your %s. You will not be able to receive new premium updates, elements and templates.',
                    'vcwb'
                ),
                $deactivatePremium
            );

            echo sprintf(
                '<p class="description">%s</p>',
                // @codingStandardsIgnoreLine
                $sectionDescription
            );
        };
        $this->addSection(
            [
                'title' => __('Deactivate Premium', 'vcwb'),
                'page' => $this->getSlug(),
                'callback' => $sectionCallback,
            ]
        );
    }
}
