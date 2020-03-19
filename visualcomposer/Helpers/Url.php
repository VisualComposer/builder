<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Helper API methods related to make Url for plugin directory.
 * Class Url.
 */
class Url implements Helper
{
    /**
     * Helper method assetUrl for plugin assets folder.
     *
     * @param $path
     *
     * @return string
     */
    public function assetUrl($path)
    {
        return $this->to('visualcomposer/resources/' . ltrim($path, '\//'));
    }

    /**
     * Url to whole plugin folder.
     *
     * @param $path
     *
     * @return string
     */
    public function to($path)
    {
        return VCV_PLUGIN_URL . ltrim($path, '\//');
    }

    /**
     * Url to whole plugin folder.
     *
     * @param $query
     *
     * @return string
     */
    public function ajax($query = [])
    {
        $ajax = [VCV_AJAX_REQUEST => 1];
        $query = $ajax + $query;
        // @codingStandardsIgnoreStart
        if (isset($_REQUEST['lang'])) {
            $query['lang'] = strip_tags(esc_attr($_REQUEST['lang']));
        }
        // // @codingStandardsIgnoreEnd
        $url = set_url_scheme(get_permalink());

        /** @var Str $strHelper */
        $strHelper = vchelper('Str');
        if (!$strHelper->contains($url, '?')) {
            $url .= '?';
        }

        return $this->query($url, $query);
    }

    /**
     * Url to whole plugin folder.
     *
     * @param $query
     *
     * @return string
     */
    public function adminAjax($query = [])
    {
        $ajax = [VCV_ADMIN_AJAX_REQUEST => 1];
        $query = $ajax + $query;
        $query['action'] = 'vcv-admin-ajax';
        // @codingStandardsIgnoreStart
        if (isset($_REQUEST['lang'])) {
            $query['lang'] = strip_tags(esc_attr($_REQUEST['lang']));
        }
        // @codingStandardsIgnoreEnd
        $url = set_url_scheme(admin_url('admin-ajax.php'));

        /** @var Str $strHelper */
        $strHelper = vchelper('Str');
        if (!$strHelper->contains($url, '?')) {
            $url .= '?';
        }

        return $this->query($url, $query);
    }

    /**
     * Returns queried request to url
     *
     * @param $query
     *
     * @return string
     */
    public function query($url, $query = [])
    {
        if (empty($query)) {
            return $url;
        }
        $q = '?';
        /** @var Str $strHelper */
        $strHelper = vchelper('Str');
        $trim = true;
        if ($strHelper->contains($url, '?')) {
            $q = '&';
            $trim = false;
        }

        if ($trim) {
            $url = rtrim($url, '/\\');
        }

        $result = $url . $q . http_build_query($query, '', '&');
        $result = str_replace('?&', '?', $result);

        return $result;
    }

    /**
     * @return string
     */
    public function current()
    {
        $currentUrl = set_url_scheme('http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);

        return $currentUrl;
    }

    /**
     * @return bool|void
     * @throws \Exception
     */
    public function redirectIfUnauthorized()
    {
        if (!is_user_logged_in()) {
            wp_redirect(wp_login_url($this->current()));

            return $this->terminate();
        }

        return true;
    }

    /**
     * @param string $message
     *
     * @throws \Exception
     */
    public function terminate($message = '')
    {
        vcvdie(esc_html($message));
    }

    public function isUrl($str = '')
    {
        return (bool)preg_match('/^(https?:)?\\/\\/?/', $str);
    }
}
