<?php

namespace Tests\PhpUnit\Modules\Elements;

class GlobalVariablesControllerTest extends \WP_UnitTestCase
{
    public function testVariables()
    {
        wp_set_current_user(1);
        /** @var \VisualComposer\Helpers\Access\CurrentUser $currentUserAccessHelper */
        $currentUserAccessHelper = vcapp('\VisualComposer\Helpers\Access\CurrentUser');
        $this->assertTrue($currentUserAccessHelper->wpAll(['activate_plugins'])->get());

        // vcv:ajax:elements:globalVariables:adminNonce
        $filterResult = vcfilter('vcv:ajax:elements:globalVariables:adminNonce', []);
        $this->assertTrue(array_key_exists('status', $filterResult));
        $this->assertTrue(array_key_exists('vcvGlobals', $filterResult));
        $this->assertTrue($filterResult['status']);
        $this->assertNotFalse(array_search('VCV_HUB_GET_ELEMENTS', array_column($filterResult['vcvGlobals'], 'key')));
        $this->assertNotFalse(array_search('VCV_HUB_GET_CATEGORIES', array_column($filterResult['vcvGlobals'], 'key')));
        $this->assertNotFalse(array_search('VCV_HUB_GET_GROUPS', array_column($filterResult['vcvGlobals'], 'key')));
        $this->assertNotFalse(array_search('VCV_GET_SHARED_ASSETS', array_column($filterResult['vcvGlobals'], 'key')));
    }
}
