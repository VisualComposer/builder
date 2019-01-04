<?php

namespace VisualComposer\Modules\Vendors;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Traits\EventsFilters;

class WpbController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    protected $printed = false;

    public function __construct()
    {
        $this->addFilter('vcv:helpers:localizations:i18n', 'addI18n');
        $this->wpAddAction('admin_print_scripts', 'outputWpb');
    }

    protected function addI18n($locale)
    {
        $locale['addonWpbMigration_minRequirement'] = __('WPBakery Page Builder version is 5.0 or newer', 'vcwb');
        if (defined('WPB_VC_VERSION')) {
            $locale['addonWpbMigration_minRequirementFail'] = sprintf(
                __('WPBakery Page Builder version is 5.0 or newer - your version is %s', 'vcwb'),
                WPB_VC_VERSION
            );
            $locale['addonWpbMigration_minRequirementFailAction'] = __('please update', 'vcwb');
        }
        $locale['addonWpbMigration_authorize'] = __(
            'Visual Composer Hub access to download migration add-on - Free or Premium',
            'vcwb'
        );
        $locale['addonWpbMigration_unlockHub'] = __('Unlock Visual Composer Hub', 'vcwb');

        return $locale;
    }

    /**
     * Output migration variable
     */
    protected function outputWpb()
    {
        if ($this->printed) {
            return;
        }
        $licenseHelper = vchelper('License');

        if (defined('WPB_VC_VERSION')) {
            evcview(
                'partials/constant-script',
                [
                    'key' => 'VCV_WPBAKERY_ALLOW_MIGRATION',
                    'value' => version_compare(WPB_VC_VERSION, '5.0', '>='),
                    'type' => 'constant',
                ]
            );
        }

        evcview(
            'partials/constant-script',
            [
                'key' => 'VCV_WPBAKERY_PLUGINS_URL',
                'value' => (is_multisite()) ? network_admin_url('plugins.php') : admin_url('plugins.php'),
                'type' => 'constant',
            ]
        );

        evcview(
            'partials/constant-script',
            [
                'key' => 'VCV_WPBAKERY_HUB_ACCESS',
                'value' => $licenseHelper->isActivated(),
                'type' => 'constant',
            ]
        );

        evcview(
            'partials/constant-script',
            [
                'key' => 'VCV_WPBAKERY_ACTIVATE_URL',
                'value' => esc_url(admin_url('admin.php?page=vcv-go-premium&vcv-ref=plugins-page')),
                'type' => 'constant',
            ]
        );

        $this->printed = true;
    }
}
