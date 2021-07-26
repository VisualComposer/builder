<?php

class DataUsageControllerTest extends \WP_UnitTestCase
{
    public function testInitialUsage()
    {
        wp_set_current_user(1);
        $factory = new WP_UnitTest_Factory_For_Post($this);
        $postId = $factory->create(['post_title' => 'Test post']);
        /** @var \VisualComposer\Helpers\Request $requestHelper */
        $requestHelper = vchelper('Request');
        $requestHelper->setData(
            [
                'vcv-source-id' => $postId,
            ]
        );

        /** @var \VisualComposer\Helpers\Filters $filterHelper */
        $filterHelper = vchelper('Filters');
        $postTypeHelper = vchelper('PostType');
        $optionsHelper = vchelper('Options');
        $postTypeHelper->setupPost($postId);
        $filterHelper->fire('vcv:editors:frontend:render');
        $startTime = get_post_meta($postId, '_' . VCV_PREFIX . 'editorStartedAt', true);
        $this->assertNotEmpty($startTime);
        $initialUsages = (int)$optionsHelper->get('initialEditorUsage');
        $this->assertEquals(1, $initialUsages);
        $filterHelper->fire('vcv:editors:frontend:render');
        $initialUsages = (int)$optionsHelper->get('initialEditorUsage');
        $this->assertEquals(2, $initialUsages);

        // Reset
        $requestHelper->setData([]);
    }

    public function testMostUsedItems()
    {
        $filterHelper = vchelper('Filters');
        $optionsHelper = vchelper('Options');

        $usageCount = $optionsHelper->get('usageCount', []);
        $itemTag = 'basicButton';
        $oldItemUsageCount = isset($usageCount[ $itemTag ]) ? $usageCount[ $itemTag ] : 0;
        if (!isset($oldItemUsageCount) || !is_numeric($oldItemUsageCount)) {
            $oldItemUsageCount = 0;
        }

        $filterHelper->fire('vcv:ajax:usageCount:updateUsage:adminNonce', '', [
            'tag' => $itemTag,
        ]);

        $usageCount = $optionsHelper->get('usageCount', []);
        $newItemUsageCount = $usageCount[ $itemTag ];
        $this->assertEquals($oldItemUsageCount + 1, $newItemUsageCount);
    }
}
