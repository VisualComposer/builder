<?php

namespace VisualComposer\Framework\Illuminate\Support;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/**
 * Empty interface to allow use in autoloader and instanceof methods.
 *
 * Interface Module.
 */
interface Module
{
}
