<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Class Options.
 */
class Options implements Helper
{
    /**
     * @param $optionName
     * @param bool $default
     *
     * @return mixed
     */
    public function get($optionName, $default = false)
    {
        return get_option(VCV_PREFIX . $optionName, $default);
    }

    /**
     * @param $optionName
     * @param $value
     *
     * @return $this
     */
    public function set($optionName, $value)
    {
        update_option(VCV_PREFIX . $optionName, $value);

        return $this;
    }

    /**
     * @param $optionName
     *
     * @return $this
     */
    public function delete($optionName)
    {
        delete_option(VCV_PREFIX . $optionName);

        return $this;
    }

    /**
     * @param $transient
     * @param $value
     * @param int $expiration
     *
     * @return $this
     */
    public function setTransient($transient, $value, $expiration = 0)
    {
        set_transient(VCV_PREFIX . VCV_VERSION . $transient, $value, $expiration);

        return $this;
    }

    /**
     * @param $transient
     *
     * @return $this
     */
    public function getTransient($transient)
    {
        return get_transient(VCV_PREFIX . VCV_VERSION . $transient);
    }

    /**
     * @param $transient
     *
     * @return $this
     */
    public function deleteTransient($transient)
    {
        delete_transient(VCV_PREFIX . VCV_VERSION . $transient);

        return $this;
    }

    /**
     * @param $optionName
     * @param $value
     *
     * @return $this
     */
    public function setUser($optionName, $value)
    {
        update_user_option(get_current_user_id(), VCV_PREFIX . $optionName, $value);

        return $this;
    }

    /**
     * @param $optionName
     * @param string $emptyResult
     *
     * @return mixed|string
     */
    public function getUser($optionName, $emptyResult = '')
    {
        $result = get_user_option(VCV_PREFIX . $optionName);
        if (empty($result)) {
            return $emptyResult;
        }

        return $result;
    }
}
