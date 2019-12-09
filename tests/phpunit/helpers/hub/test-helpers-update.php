<?php

class UpdateHelperTest extends WP_UnitTestCase
{
    public function testIsUrlDev()
    {
        $updatesHelper = vchelper('HubUpdate');
        $this->assertTrue($updatesHelper->isUrlDev('http://localhost'));
        $this->assertTrue($updatesHelper->isUrlDev('https://localhost'));
        $this->assertTrue($updatesHelper->isUrlDev('https://127.0.0.1'));
        $this->assertTrue($updatesHelper->isUrlDev('http://127.0.0.1'));
        $this->assertTrue($updatesHelper->isUrlDev('http://some.test'));
        $this->assertTrue($updatesHelper->isUrlDev('http://some.local'));
        $this->assertTrue($updatesHelper->isUrlDev('http://some.vc'));
        $this->assertFalse($updatesHelper->isUrlDev('http://visualcomposer.com'));
        $this->assertFalse($updatesHelper->isUrlDev('https://visualcomposer.com'));
        $this->assertFalse($updatesHelper->isUrlDev('http://wordpress.org'));
        $this->assertFalse($updatesHelper->isUrlDev('https://wordpress.org'));
    }

    public function testGetVariables()
    {
        wp_set_current_user(1);
        $updatesHelper = vchelper('HubUpdate');
        $dataHelper = vchelper('Data');

        $variables = $updatesHelper->getVariables();
        $this->assertIsArray($variables);

        // VCV_GO_PREMIUM_URL
        // depends on ref. by default ref is getting-started
        $variableKeys = $dataHelper->arrayColumn($variables, 'key');
        $this->assertContains('VCV_GO_PREMIUM_URL', $variableKeys, 'VCV_GO_PREMIUM_URL');
        $key = array_search('VCV_GO_PREMIUM_URL', $variableKeys);

        $this->assertIsNumeric($key, 'key: ' . $key);
        $this->assertTrue(isset($variables[ $key ]));
        $this->assertTrue(isset($variables[ $key ]['value']));
        $this->assertEquals(
            'https://visualcomposer.com/premium?utm_medium=wp-dashboard&utm_source=getting-started&utm_campaign=gopremium',
            $variables[ $key ]['value']
        );

        // Not change the ref
        $requestHelper = vchelper('Request');
        $requestHelper->setData(
            [
                'vcv-ref' => 'hub-banner',
            ]
        );

        $variables = $updatesHelper->getVariables();
        $variableKeys = $dataHelper->arrayColumn($variables, 'key');
        $key = array_search('VCV_GO_PREMIUM_URL', $variableKeys);
        $this->assertEquals(
            'https://visualcomposer.com/premium?utm_medium=frontend-editor&utm_source=hub&utm_campaign=hub-banner',
            $variables[ $key ]['value']
        );

        $requestHelper->setData([]);
    }

    public function testGetFreeVariables()
    {
        wp_set_current_user(1);
        $updatesHelper = vchelper('HubUpdate');
        $dataHelper = vchelper('Data');

        $variables = $updatesHelper->getVariables();
        $this->assertIsArray($variables);

        // VCV_GO_PREMIUM_URL
        // depends on ref. by default ref is getting-started
        $variableKeys = $dataHelper->arrayColumn($variables, 'key');
        $this->assertContains('VCV_GO_FREE_URL', $variableKeys, 'VCV_GO_FREE_URL');
        $key = array_search('VCV_GO_FREE_URL', $variableKeys);

        $this->assertIsNumeric($key, 'key: ' . $key);
        $this->assertTrue(isset($variables[ $key ]));
        $this->assertTrue(isset($variables[ $key ]['value']));
        $this->assertEquals(
            vcvenv('VCV_HUB_URL')
            . 'free-license?utm_medium=wp-dashboard&utm_source=getting-started&utm_campaign=get-free-license',
            $variables[ $key ]['value']
        );

        // Not change the ref
        $requestHelper = vchelper('Request');
        $requestHelper->setData(
            [
                'vcv-ref' => 'hub-banner',
            ]
        );

        $variables = $updatesHelper->getVariables();
        $variableKeys = $dataHelper->arrayColumn($variables, 'key');
        $key = array_search('VCV_GO_FREE_URL', $variableKeys);
        $this->assertEquals(
            vcvenv('VCV_HUB_URL')
            . 'free-license?utm_medium=frontend-editor&utm_source=hub&utm_campaign=get-free-license&utm_content=hub-banner',
            $variables[ $key ]['value']
        );

        $requestHelper->setData([]);
    }
}
