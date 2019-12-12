<?php

class TeasersControllerTest extends WP_UnitTestCase
{
    public function testVariablesEditor()
    {
        $dataHelper = vchelper('Data');
        $variables = vcfilter('vcv:editor:variables', []);

        $this->assertIsArray($variables);

        $variableKeys = $dataHelper->arrayColumn($variables, 'key');
        $this->assertIsArray($variableKeys);
        $this->assertContains('VCV_HUB_GET_TEASER', $variableKeys, 'VCV_HUB_GET_TEASER');
        $this->assertContains('vcvHubTeaserShowBadge', $variableKeys, 'vcvHubTeaserShowBadge');
    }
}
