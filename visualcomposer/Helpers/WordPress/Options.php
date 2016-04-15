<?php

namespace VisualComposer\Helpers\WordPress;

/**
 * Class Options
 * @package VisualComposer\Helpers\WordPress
 */
class Options
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
