<?php

namespace VisualComposer\Modules\Settings\Fields;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\Logger;
use VisualComposer\Helpers\Nonce;
use VisualComposer\Helpers\Notice;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;
use VisualComposer\Modules\Settings\Traits\Fields;

class FactoryResetController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;
    use Fields;

    public function __construct()
    {
        $this->optionGroup = 'vcv-settings';
        $this->optionSlug = 'vcv-factory';
        /** @see \VisualComposer\Modules\Settings\Fields\FactoryResetController::buildPage */
        $this->wpAddAction(
            'admin_init',
            'buildPage',
            1000
        );

        $this->addFilter('vcv:ajax:vcv:settings:factoryReset:adminNonce', 'initiateFactoryReset');
    }

    /**
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserAccess
     * @param \VisualComposer\Helpers\Url $urlHelper
     * @param \VisualComposer\Helpers\Nonce $nonceHelper
     */
    protected function buildPage(
        Options $optionsHelper,
        Request $requestHelper,
        CurrentUser $currentUserAccess,
        Url $urlHelper,
        Nonce $nonceHelper
    ) {
        if (!$currentUserAccess->wpAll('manage_options')->get()) {
            return;
        }
        // Allow to make factory reset for 1h
        $sectionCallback = function () use ($urlHelper, $nonceHelper, $requestHelper, $optionsHelper) {
            $optionsHelper->setTransient('vcv:settings:factoryReset:allow', 1, 3600);
            $url = $urlHelper->adminAjax(
                ['vcv-action' => 'vcv:settings:factoryReset:adminNonce', 'vcv-nonce' => $nonceHelper->admin()]
            );
            $confirm = __('Proceed with a reset?', 'visualcomposer');
            $linkTitle = __('initiate reset', 'visualcomposer');
            $link = sprintf(
                '<a href="%s" onclick="return confirm(\'%s\')">%s</a>',
                // @codingStandardsIgnoreLine
                esc_url($url),
                esc_attr($confirm),
                esc_html($linkTitle)
            );

            // translators: %s: link to initiate reset
            $sectionDescription = __(
                'Restore default plugin state to re-download all installed bundles and auto-configure path after migration (don’t worry, the content of the site will not be affected) - %s.',
                'visualcomposer'
            );
            $outputHelper = vchelper('Output');
            $outputHelper->printNotEscaped(
                sprintf(
                    '<p class="description">%s</p>',
                    sprintf($sectionDescription, $link)
                )
            );
        };
        $this->addSection(
            [
                'title' => __('Reset', 'visualcomposer'),
                'page' => 'vcv-settings',
                'callback' => $sectionCallback,
            ]
        );
    }

    /**
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserAccess
     * @param \VisualComposer\Helpers\Logger $loggerHelper
     *
     * @param \VisualComposer\Helpers\Notice $noticeHelper
     *
     * @return bool
     */
    protected function initiateFactoryReset(
        Options $optionsHelper,
        CurrentUser $currentUserAccess,
        Logger $loggerHelper,
        Notice $noticeHelper
    ) {
        if (!$currentUserAccess->wpAll('manage_options')->get()) {
            $loggerHelper->log(__('Incorrect permissions.', 'visualcomposer') . ' #10072');
            wp_safe_redirect(admin_url('admin.php?page=vcv-settings&reset=false'));
            exit;
        }
        if (!$optionsHelper->getTransient('vcv:settings:factoryReset:allow')) {
            $loggerHelper->log(__('Session expired', 'visualcomposer') . ' #10073');

            return false;
        }
        $optionsHelper->deleteTransient('vcv:settings:factoryReset:allow');
        $optionsHelper->set('settingsResetInitiated', time());
        vcevent('vcv:system:factory:reset');
        wp_cache_flush();
        wp_safe_redirect(admin_url('admin.php?page=vcv-settings'));
        exit;
    }
}
