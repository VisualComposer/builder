<?php

namespace VisualComposer\Modules\Settings;

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
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;
use VisualComposer\Modules\Account\Pages\ActivationPage;
use VisualComposer\Modules\Settings\Pages\Settings;
use VisualComposer\Modules\Settings\Traits\Fields;

class FactoryResetController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;
    use Fields;


    public function getSlug()
    {
        /** @var Settings $settings */
        $settings = vcapp('SettingsPagesSettings');
        return $settings->getSlug();
    }


    public function __construct()
    {
        $this->optionGroup = $this->getSlug();
        $this->optionSlug = 'vcv-factory';
        /** @see \VisualComposer\Modules\Settings\Pages\PostTypes::buildPage */
        $this->wpAddAction(
            'vcv:settings:initAdmin:page:' . $this->getSlug(),
            'buildPage',
            100
        );

        $this->addFilter('vcv:ajax:vcv:settings:factoryReset:adminNonce', 'initiateFactoryReset');
    }

    protected function buildPage(Options $optionsHelper, Request $requestHelper, CurrentUser $currentUserAccess, Url $urlHelper, Nonce $nonceHelper)
    {
        if (!$currentUserAccess->wpAll('manage_options')->get()) {
            return;
        }
        // Allow to make factory reset for 1h
        $sectionCallback = function () use ($urlHelper, $nonceHelper, $requestHelper, $optionsHelper) {
            $optionsHelper->setTransient('vcv:settings:factoryReset:allow', 1, 3600);
            $url = $urlHelper->adminAjax(['vcv-action' => 'vcv:settings:factoryReset:adminNonce', 'vcv-nonce' => $nonceHelper->admin()]);
            $confirm = __('Proceed with a factory reset?', 'vcwb');
            $linkTitle = __('initiate factory reset', 'vcwb');
            $link = sprintf('<a href="%s" onclick="return confirm(\'%s\')">%s</a>', $url, $confirm, $linkTitle);

            $sectionDescription = __('Overwrite your existing extensions and assets with the latest versions from Visual Composer Cloud service - %s.', 'vcwb');
            echo sprintf(
                '<p class="description">%s</p>',
                sprintf($sectionDescription, $link)
            );
        };
        $this->addSection(
            [
                'title' => __('Factory Reset', 'vcwb'),
                'page' => $this->getSlug(),
                'callback' => $sectionCallback,
            ]
        );
    }

    protected function initiateFactoryReset(Options $optionsHelper, CurrentUser $currentUserAccess, Logger $loggerHelper, ActivationPage $activationPageModule)
    {
        if (!$currentUserAccess->wpAll('manage_options')->get()) {
            $loggerHelper->log(__('Wrong permissions #10072'));
            wp_redirect(admin_url('admin.php?page=' . rawurlencode($this->getSlug()) . '&reset=false'));
            die;
        }
        if (!$optionsHelper->getTransient('vcv:settings:factoryReset:allow')) {
            $loggerHelper->log(__('Session expired #10073'));
            return false;
        }
        $optionsHelper->deleteTransient('vcv:settings:factoryReset:allow');
        $optionsHelper->set('version', VCV_VERSION);
        vcevent('vcv:system:factory:reset');
        wp_cache_flush();
        wp_redirect(admin_url('admin.php?page=' . rawurlencode($activationPageModule->getSlug())));
        die();
    }
}
