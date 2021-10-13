<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

class Notice implements Helper
{
    public function addNotice($name, $message, $type = 'warning', $dismissible = true, $wpDismissible = false)
    {
        $notices = $this->all();
        if (!is_array($notices)) {
            $notices = [];
        }
        $notices[ $name ] = [
            'name' => $name,
            'message' => $message,
            'type' => $type,
            'time' => time(),
            'dismissible' => $dismissible,
            'wpDismissible' => $wpDismissible
        ];
        $optionsHelper = vchelper('Options');
        $optionsHelper->setTransient('admin:notices', $notices);
    }

    public function removeNotice($name)
    {
        $notices = $this->all();

        if (isset($notices[ $name ])) {
            unset($notices[ $name ]);
        }
        $optionsHelper = vchelper('Options');
        $optionsHelper->setTransient('admin:notices', $notices);
    }

    public function dismissNotice($name)
    {
        $notices = $this->all();
        if (!empty($notices)) {
            foreach ($notices as $notice) {
                if ($notice['name'] && $notice['dismissible'] && $notice['name'] === $name) {
                    update_user_meta(
                        get_current_user_id(),
                        'vcv:' . $notice['name'] . ':notice:' . $notice['time'],
                        true
                    );
                    break;
                }
            }
        }
    }

    public function all()
    {
        $optionsHelper = vchelper('Options');

        return $optionsHelper->getTransient('admin:notices');
    }

    public function reset()
    {
        $optionsHelper = vchelper('Options');

        $optionsHelper->delete('admin:notices');
    }
}
