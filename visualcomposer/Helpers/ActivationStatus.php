<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
use VisualComposer\Framework\Illuminate\Support\Helper;

class ActivationStatus implements Helper
{
    protected $failed = false;

    public function activationFailed()
    {
        $this->failed = true;
    }

    public function getStatus()
    {
        return $this->failed;
    }
}
