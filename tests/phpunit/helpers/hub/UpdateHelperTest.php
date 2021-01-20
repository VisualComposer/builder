<?php

class UpdateHelperTest extends WP_UnitTestCase
{
    public function testGetVariables()
    {
        wp_set_current_user(1);
        $updatesHelper = vchelper('HubUpdate');
        $dataHelper = vchelper('Data');

        $variables = $updatesHelper->getVariables();
        $this->assertIsArray($variables);

        // Not change the ref
        $requestHelper = vchelper('Request');
        // TODO: update test
        $requestHelper->setData(
            [
                'vcv-ref' => 'all-hub-editor',
            ]
        );

        $variables = $updatesHelper->getVariables();
        $variableKeys = $dataHelper->arrayColumn($variables, 'key');
        $key = array_search('vcvGoPremiumUrlWithRef', $variableKeys);
        $this->assertEquals(
            'https://visualcomposer.com/premium/?utm_source=vcwb&utm_medium=all-hub-editor&utm_campaign=gopremium&utm_content=go-premium-button',
            $variables[ $key ]['value']
        );

        $requestHelper->setData([]);
    }
}
