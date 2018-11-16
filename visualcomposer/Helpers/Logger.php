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
            'message' => nl2br($message),
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
            return strip_tags($message, '<a><ul><li><br><span>');
        }

        return false;
    }

    public function details()
    {
        $unique = [];
        if (vcvenv('VCV_DEBUG')) {
            $dataHelper = vchelper('Data');
            $columns = $dataHelper->arrayColumn($this->logs, 'details');
            $unique = $dataHelper->arrayDeepUnique($columns);
        }

        return $unique;
    }

    public function reset()
    {
        $logs = $this->logs;
        $this->logs = [];

        return $logs;
    }
}
