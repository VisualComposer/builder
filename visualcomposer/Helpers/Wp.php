<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Class Wp
 * @package VisualComposer\Helpers
 */
class Wp implements Helper
{
    private static $isMetaInput;

    public function isMetaInput()
    {
        if (is_null(self::$isMetaInput)) {
            self::$isMetaInput = version_compare('4.4', $GLOBALS['wp_version'], '<=');
        }

        return self::$isMetaInput;
    }

    public function getAllUserSettings($userId)
    {
        $settings = (string)get_user_option('user-settings', $userId);

        if (isset($_COOKIE['wp-settings-' . $userId])) {
            $cookie = preg_replace('/[^A-Za-z0-9=&_]/', '', $_COOKIE['wp-settings-' . $userId]);

            // No change or both empty
            if ($cookie == $settings) {
                return $settings;
            }

            $lastSaved = (int)get_user_option('user-settings-time', $userId);
            $current = isset($_COOKIE['wp-settings-time-' . $userId]) ? preg_replace(
                '/[^0-9]/',
                '',
                $_COOKIE['wp-settings-time-' . $userId]
            ) : 0;

            // The cookie is newer than the saved value. Update the user_option and leave the cookie as-is
            if ($current > $lastSaved) {
                return $cookie;
            }
        }

        return $settings;
    }

    public function getUserSetting($userId, $key, $default = false)
    {
        $all = $this->getAllUserSettings($userId);
        parse_str($all, $parsed);

        return isset($parsed[$key]) ? $parsed[$key] : $default;
    }

    public function getUpdateVersionFromWordpressOrg()
    {
        $updatePlugins = get_plugin_updates();
        return isset($updatePlugins[VCV_PLUGIN_BASE_NAME]) ? $updatePlugins[VCV_PLUGIN_BASE_NAME]->update->new_version : 0;
    }
}
