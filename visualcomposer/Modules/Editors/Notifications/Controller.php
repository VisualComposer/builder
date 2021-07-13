<?php

namespace VisualComposer\Modules\Editors\Notifications;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class Controller.
 */
class Controller extends Container implements Module
{
    use EventsFilters;

    /**
     * Controller constructor.
     */
    public function __construct()
    {
        $this->addEvent('vcv:inited', 'listenNotifications');
        $this->addFilter('vcv:dataAjax:getData', 'outputNotificationsData');
    }

    /**
     * Listen and save the notifications to db once in a day.
     */
    protected function listenNotifications()
    {
        $optionsHelper = vchelper('Options');

        if (!$optionsHelper->getTransient('lastNotificationUpdate')) {
            $response = wp_remote_get(
                'https://visualcomposer.com/wp-json/vc-api/v1/notifications',
                [
                    'timeout' => 30,
                ]
            );
            if (!vcIsBadResponse($response)) {
                $body = $response['body'];
                $optionsHelper->set('notifications', $body);
            }
            $optionsHelper->setTransient('lastNotificationUpdate', 1, DAY_IN_SECONDS);
        }
    }

    /**
     * Provide the notifications for the frontend side.
     */
    protected function outputNotificationsData($response, $payload)
    {
        $optionsHelper = vchelper('Options');
        $notificationsData = $optionsHelper->get('notifications');

        if (isset($notificationsData) && !empty($notificationsData)) {
            $response['notificationCenterData'] = $notificationsData;
        }

        return $response;
    }
}
