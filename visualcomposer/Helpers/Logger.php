<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
use VisualComposer\Framework\Illuminate\Support\Helper;

class Logger implements Helper
{
    protected $logs = [];

    public function log($message, $details = [])
    {
        $this->logs[] = [
            'message' => $message,
            'details' => $details,
        ];
    }

    public function all()
    {
        $dataHelper = vchelper('Data');

        $message = preg_replace(
            '/\.+/',
            '.',
            implode('. ', $dataHelper->arrayColumn($this->logs, 'message'))
        );

        if ($message) {
            return json_encode($message . '.');
        }

        return false;
    }

    public function details()
    {
        $dataHelper = vchelper('Data');

        return $dataHelper->arrayColumn($this->logs, 'details');
    }
}
