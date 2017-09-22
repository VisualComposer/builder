<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
use VisualComposer\Framework\Illuminate\Support\Helper;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class Notice implements Helper
{
    use WpFiltersActions;

    protected $notices = [];

    public function addNotice($name, $message, $type = 'warning', $dismissible = true)
    {
        $optionsHelper = vchelper('Options');
        $notices = $optionsHelper->getTransient('admin:notices');

        if (is_array($notices)) {
            $this->notices = $notices;
        }

        if (!isset($this->notices[ $name ]) && !isset($this->notices[ $name ][ $message ])) {
            $this->notices[$name] = [
                'name' => $name,
                'message' => $message,
                'type' => $type,
                'time' => time(),
                'dismissible' => $dismissible,
            ];
            $optionsHelper->setTransient('admin:notices', $this->notices);
        }
    }

    public function removeNotice($name)
    {
        $optionsHelper = vchelper('Options');
        $this->notices = $optionsHelper->getTransient('admin:notices');

        if (isset($this->notices[ $name ])) {
            unset($this->notices[ $name ]);
        }

        $optionsHelper->setTransient('admin:notices', $this->notices);
    }
}
