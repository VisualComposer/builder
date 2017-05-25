<?php

namespace VisualComposer\Modules\Account;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Traits\EventsFilters;

class DeactivationController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addEvent('vcv:system:deactivation:hook', 'unsetOptions');
    }

    protected function unsetOptions(Token $tokenHelper)
    {
        $tokenHelper->reset();
    }
}
