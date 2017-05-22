<?php

namespace VisualComposer\Framework\Illuminate\Support;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/**
 * Allows to make helper to non-singleton, all new request for helper will cause new object creation
 * Interface Immutable
 * @package VisualComposer\Framework\Illuminate\Support
 */
interface Immutable
{
}
