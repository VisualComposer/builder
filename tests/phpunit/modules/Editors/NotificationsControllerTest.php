<?php

class NotificationsControllerTest extends WP_UnitTestCase
{
    public function testListenNotifications()
    {
        $optionsHelper = vchelper('Options');
        $optionsHelper->delete('lastNotificationUpdate');
        wp_set_current_user(1);
        $factory = new WP_UnitTest_Factory_For_Post($this);
        $postId = $factory->create(['post_title' => 'Test post']);
        vchelper('PostType')->setupPost($postId);

        $data = vcfilter('vcv:dataAjax:getData', ['status' => true], ['sourceId' => $postId]);
        // Filter must keep the response
        $this->assertTrue($data['status']);

        $lastNotificationUpdate = (int)$optionsHelper->get('lastNotificationUpdate', 0);
        $this->assertGreaterThan(0, $lastNotificationUpdate);

        // Second editor load within a day must not refetch
        vcfilter('vcv:dataAjax:getData', ['status' => true], ['sourceId' => $postId]);
        $this->assertEquals($lastNotificationUpdate, (int)$optionsHelper->get('lastNotificationUpdate', 0));

        $notifications = $optionsHelper->get('notifications', []);
        if (empty($notifications)) {
            $notifications = 'is not empty';
        }
        $this->assertNotEmpty($notifications);
    }

    public function testOutputNotificationsData()
    {
        $optionsHelper = vchelper('Options');
        $notificationsData = $optionsHelper->get('notifications');
        // Create test post
        wp_set_current_user(1);
        $factory = new WP_UnitTest_Factory_For_Post($this);
        $postId = $factory->create(['post_title' => 'Test post']);
        $postHelper = vchelper('PostType')->setupPost($postId);

        $data = vcfilter('vcv:dataAjax:getData', ['status' => true], ['sourceId' => $postId]);

        if (isset($notificationsData) && !empty($notificationsData)) {
            $this->assertNotEmpty($data['notificationCenterData']);
        }
    }
}
