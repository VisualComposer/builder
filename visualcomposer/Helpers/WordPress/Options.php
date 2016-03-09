<?php

namespace VisualComposer\Helpers\WordPress;

class Options
{
    /**
     * @param $optionName
     * @param bool $default
     *
     * @return mixed
     */
    public static function get($optionName, $default = false)
    {
        return get_option(VC_V_PREFIX . $optionName, $default);
    }

    /**
     * @param $optionName
     * @param $value
     */
    public static function set($optionName, $value)
    {
        update_option(VC_V_PREFIX . $optionName, $value);
    }
}
