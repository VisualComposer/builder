<?php

namespace VisualComposer\Helpers;

use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Class Wp
 * @package VisualComposer\Helpers
 */
class Wp implements Helper
{
    static private $isNewWpVersion;

    public function isMetaInput()
    {
        if (is_null(self::$isNewWpVersion)) {
            self::$isNewWpVersion = version_compare('4.4', $GLOBALS['wp_version'], '>=');
        }

        return self::$isNewWpVersion;
    }
}
