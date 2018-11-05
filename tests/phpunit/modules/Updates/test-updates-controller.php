<?php

class TestUpdates extends WP_UnitTestCase
{
    public function testCheckCreateToken()
    {
        if (vcvenv('VCV_FT_ACTIVATION_REDESIGN')) {
            // TODO: Finish tests
            return;
        }
        $loggerHelper = vchelper('Logger');
        $messages = $loggerHelper->all();
        $this->assertEmpty($messages, $messages);
        $token = true;
        add_filter(
            'pre_http_request',
            function ($response) use (&$token) {
                $args = func_get_args();
                if ($token) {
                    $token = false;

                    return '';
                }

                return $response;
            },
            10,
            100
        );
        $tokenHelper = vchelper('Token');
        $this->assertFalse($tokenHelper->isSiteAuthorized());
        $this->assertFalse($tokenHelper->createToken(''));
        $this->assertEquals('"Token generation failed."', $loggerHelper->all());
        $loggerHelper->reset();
    }

    public function testCheckCreateTokenSuccess()
    {
        if (vcvenv('VCV_FT_ACTIVATION_REDESIGN')) {
            // TODO: Finish tests
            return;
        }
        $loggerHelper = vchelper('Logger');
        $x = true;
        add_filter(
            'pre_http_request',
            function ($response) use (&$x) {
                $args = func_get_args();
                if ($x) {
                    $x = false;

                    return ['body' => '{"success":true, "data":{"token":"temp1token"}}'];
                }

                return $response;
            },
            10,
            100
        );
        $tokenHelper = vchelper('Token');
        $this->assertEquals("temp1token", $tokenHelper->createToken(''));
        $this->assertEquals("temp1token", $tokenHelper->getToken(''));
        $messages = $loggerHelper->all();
        $this->assertEmpty($messages, $messages);
    }

    public function testCheckVersionHubUpdate()
    {
        if (vcvenv('VCV_FT_ACTIVATION_REDESIGN')) {
            // TODO: Finish tests
            return;
        }
        $loggerHelper = vchelper('Logger');
        $messages = $loggerHelper->all();
        $this->assertEmpty($messages, $messages);
        $filterHelper = vchelper('Filters');
        $token = true;
        $actions = true;
        add_filter(
            'pre_http_request',
            function ($response, $body, $url) use (&$token, &$actions) {
                if (strpos($url, VCV_TOKEN_URL) !== false && $token) {
                    $token = false;

                    return ['body' => '{"success":true, "data":{"token":"temp2token"}}'];
                }
                $args = func_get_args();
                if ($actions) {
                    $actions = false;
                    // url should be download/json/lite?plugin=[vcv_version]&token=temp2token
                    $this->assertEquals(
                        VCV_HUB_URL . '/download/json/lite?plugin=' . VCV_VERSION . '&token=temp2token',
                        $url
                    );

                    return ['body' => '{"actions":[]}'];
                }

                return $response;
            },
            10,
            100
        );
        $tokenHelper = vchelper('Token');
        /** @var \VisualComposer\Modules\Hub\Download\BundleUpdateController $mock */
        $tokenHelper->setSiteAuthorized();
        $listeners = $filterHelper->getListeners('vcv:hub:update:checkVersion');
        $this->assertEmpty($listeners);
        $mock = vc_create_module_mock('\VisualComposer\Modules\Hub\Download\BundleUpdateController');
        $listeners = $filterHelper->getListeners('vcv:hub:update:checkVersion');
        $this->assertNotEmpty($listeners);
        $response = $filterHelper->fire('vcv:hub:update:checkVersion');
        $this->assertEquals(['status' => true, 'json' => ['actions' => []]], $response);
        $messages = $loggerHelper->all();
        $this->assertEmpty($messages, $messages);
    }
}
