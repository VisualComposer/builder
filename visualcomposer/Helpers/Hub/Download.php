<?php

namespace VisualComposer\Helpers\Hub;

use VisualComposer\Framework\Illuminate\Support\Helper;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

class Download implements Helper
{
    /**
     * Check if current user is allowed to access/download Hub content.
     * Falls back to per-part Role Manager access when the addon is enabled.
     *
     * @param string|null $part
     *
     * @return bool
     * @throws \Exception
     */
    public function hasAccess($part = null)
    {
        $currentUserAccessHelper = vchelper('AccessCurrentUser');
        if (!vcvenv('VCV_ADDON_ROLE_MANAGER_ENABLED')) {
            return $currentUserAccessHelper->wpAll('install_plugins')->get();
        }

        if ($part) {
            return $currentUserAccessHelper->part('hub')->can($part)->get();
        }

        return (
            $currentUserAccessHelper->part('hub')->can('elements_templates_blocks')->get()
            || $currentUserAccessHelper->part('hub')->can('addons')->get()
            || $currentUserAccessHelper->part('hub')->can('headers_footers_sidebars')->get()
            || $currentUserAccessHelper->part('hub')->can('unsplash')->get()
            || $currentUserAccessHelper->part('hub')->can('giphy')->get()
        );
    }

    public function getActionName($action)
    {
        $name = $action;
        /*
         Editor bundle
         Downloading assets 5%: Categories bundle
         Downloading assets 7.5%: Library extension
         Downloading assets 10%: Templates library
         Downloading assets 12.5%: Row element
         */
        switch ($action) {
            case 'editor':
                $name = __('Editor bundle', 'visualcomposer');
                break;
            case 'categories':
                $name = __('Categories bundle', 'visualcomposer');
                break;
            case 'assets':
                $name = __('Library extensions', 'visualcomposer');
                break;
            case 'templates':
                $name = __('Templates library', 'visualcomposer');
                break;
        }
        $name = preg_replace('/(element\/)(.*)/', '$2 Element', $name);

        return ucfirst($name);
    }
}
