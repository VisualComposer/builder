<?php

namespace VisualComposer\Modules\License;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;

class EditorVariablesController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter('vcv:editor:variables vcv:wp:dashboard:variables', 'addVariables');
    }

    protected function addVariables($variables, $payload)
    {
        $licenseHelper = vchelper('License');
        $isPremiumActivated = $licenseHelper->isPremiumActivated();
        $variables[] = [
            'key' => 'vcvIsPremiumActivated',
            'value' => $isPremiumActivated,
            'type' => 'variable',
        ];
        $variables[] = [
            'key' => 'vcvIsFreeActivated',
            'value' => $licenseHelper->isFreeActivated(),
            'type' => 'variable',
        ];
        $variables[] = [
            'key' => 'vcvIsAnyActivated',
            'value' => $licenseHelper->isAnyActivated(),
            'type' => 'variable',
        ];
        $variables[] = [
            'key' => 'vcvGoPremiumUrl',
            'value' => set_url_scheme(admin_url('admin.php?page=vcv-go-premium')),
            'type' => 'variable',
        ];
        $variables[] = [
            'key' => 'vcvGettingStartedUrl',
            'value' => set_url_scheme(admin_url('admin.php?page=vcv-getting-started&vcv-ref=logoFrontend')),
            'type' => 'variable',
        ];
        $variables[] = [
            'key' => 'vcvUpgradeUrl',
            'value' => set_url_scheme(admin_url('admin.php?page=vcv-getting-started&vcv-ref=hub-banner')),
            'type' => 'variable',
        ];
        $variables[] = [
            'key' => 'vcvUpgradeUrlUnsplash',
            'value' => set_url_scheme(admin_url('admin.php?page=vcv-getting-started&vcv-ref=unsplash')),
            'type' => 'variable',
        ];
        $variables[] = [
            'key' => 'vcvUpgradeUrlGiphy',
            'value' => set_url_scheme(admin_url('admin.php?page=vcv-getting-started&vcv-ref=giphy')),
            'type' => 'variable',
        ];

        return $variables;
    }
}
