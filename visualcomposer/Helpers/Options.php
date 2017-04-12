<?php

namespace VisualComposer\Helpers;

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
        set_transient(VCV_PREFIX . $transient, $value, $expiration);

        return $this;
    }

    /**
     * @param $transient
     *
     * @return mixed
     */
    public function getTransient($transient)
    {
        return get_transient(VCV_PREFIX . $transient);
    }

    public function deleteTransient($transient)
    {
        delete_transient(VCV_PREFIX . $transient);

        return $this;
    }
}
