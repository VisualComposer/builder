<?php

namespace VisualComposer\Helpers\Hub\Actions;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

class HubTemplatesBundle extends ActionBundle implements Helper
{
    /** @noinspection PhpMissingParentConstructorInspection */
    /**
     * ElementsBundle constructor.
     */
    public function __construct()
    {
        $this->bundlePath = VCV_PLUGIN_ASSETS_DIR_PATH . '/temp-bundle-hub-templates';
    }
}
