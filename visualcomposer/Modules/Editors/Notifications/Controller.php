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
        $this->addFilter('vcv:dataAjax:getData', 'listenNotifications');
        $this->addFilter('vcv:dataAjax:getData', 'outputNotificationsData');
        $this->addFilter(
            'vcv:ajax:atarim:comment:button:click:adminNonce',
            'saveClickAction'
        );
    }

    /**
     * Listen and save the notifications to db once in a day.
     */
    protected function listenNotifications($response)
    {
        $optionsHelper = vchelper('Options');

        // Regular option instead of transient, so object cache flush/eviction can't reset it
        $lastUpdate = (int)$optionsHelper->get('lastNotificationUpdate', 0);
        $isUpdatedToday = time() - $lastUpdate < DAY_IN_SECONDS;
        if ($isUpdatedToday) {
            return $response;
        }

        // Set before request, so concurrent requests don't fetch too
        $optionsHelper->set('lastNotificationUpdate', time());

        $notificationsResponse = wp_remote_get(
            'https://visualcomposer.com/wp-json/vc-api/v1/notifications',
            [
                'timeout' => 5,
            ]
        );
        if (!vcIsBadResponse($notificationsResponse)) {
            $optionsHelper->set('notifications', $notificationsResponse['body']);
        }

        return $response;
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

    /**
     * We need some actions after user click comment atarim button in our notification.
     *
     * @return array
     */
    protected function saveClickAction()
    {
        $optionsHelper = vchelper('Options');

        $optionsHelper->set('atarim_message_button_active', 1);

        return ['status' => true];
    }
}
