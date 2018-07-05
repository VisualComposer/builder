<?php

namespace VisualComposer\Modules\Api;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class Factory extends Container implements Module
{
    use WpFiltersActions;

    public function __construct()
    {
        $this->wpAddAction(
            'init',
            function () {
                do_action('vcv:api', $this);
            }
        );
    }

    public function __call($name, $arguments)
    {
        return vcapp()->make(vcfilter('vcv:api:service', $name), $arguments);
    }

    public function __get($name)
    {
        return vcapp()->make(vcfilter('vcv:api:service', $name));
    }
}
