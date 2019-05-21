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

        $this->assertTrue(array_key_exists('VCV_HUB_GET_ELEMENTS', $filterResult['vcvGlobals']));
        $this->assertTrue(array_key_exists('VCV_HUB_GET_CATEGORIES', $filterResult['vcvGlobals']));
        $this->assertTrue(array_key_exists('VCV_HUB_GET_GROUPS', $filterResult['vcvGlobals']));
        $this->assertTrue(array_key_exists('VCV_GET_SHARED_ASSETS', $filterResult['vcvGlobals']));
    }
}
