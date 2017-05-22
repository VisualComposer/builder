<?php

namespace VisualComposer\Framework\Illuminate\Container;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use Exception;

/**
 * Class BindingResolutionException.
 */
class BindingResolutionException extends Exception
{
}
