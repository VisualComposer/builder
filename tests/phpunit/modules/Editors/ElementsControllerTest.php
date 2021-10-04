<?php

class ElementsControllerTest extends \WP_UnitTestCase
{
    public function testSoftDelete()
    {
        wp_set_current_user(1);
        $factory = new WP_UnitTest_Factory_For_Post($this);
        $postId = $factory->create(['post_title' => 'Test post']);
        $elementToRemove = 'basicMenu';
        /** @var \VisualComposer\Helpers\Request $requestHelper */
        $requestHelper = vchelper('Request');
        $requestHelper->setData(
            [
                'vcv-source-id' => $postId,
                'vcv-element-tag' => $elementToRemove
            ]
        );

        $filterHelper = vchelper('Filters');
        $postTypeHelper = vchelper('PostType');
        $currentUserAccess = vchelper('AccessCurrentUser');
        $hubHelper = vchelper('HubElements');
        $postTypeHelper->setupPost($postId);
        $result = $filterHelper->fire('vcv:ajax:editors:elements:delete:adminNonce', '', [
            'sourceId' => $postId,
        ]);

        $hasAccess = $currentUserAccess->wpAll('manage_options')->get();
        if (vcvenv('VCV_ADDON_ROLE_MANAGER_ENABLED')) {
            $hasAccess = $currentUserAccess->part('hub')->can('elements_templates_blocks')->get();
        }

        if (
            !$hasAccess ||
            (in_array($elementToRemove, $hubHelper->getDefaultElements(), true)) ||
            $hubHelper->isElementUsed($elementToRemove)
        ) {
            $this->assertFalse($result['status']);
        } else {
            $this->assertTrue($result['status']);
        }

        // Reset
        $requestHelper->setData([]);
    }
}
