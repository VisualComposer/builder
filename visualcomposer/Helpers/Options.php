<?php

namespace VisualComposer\Helpers;

use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Class Options
 * @package VisualComposer\Helpers
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
}
