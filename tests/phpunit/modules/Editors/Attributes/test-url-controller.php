<?php

class UrlControllerTest extends WP_UnitTestCase
{
    public function testPostFilter()
    {
        /** @var \VisualComposer\Helpers\Filters $helper */
        $helper = vchelper('Filters');
        $result = $helper->fire('vcv:ajax:attribute:linkSelector:getPosts');
        $this->assertTrue(is_array($result));
    }

    public function testPostSearch()
    {
        $factory = new WP_UnitTest_Factory_For_Post($this);
        $postId = $factory->create(['post_title' => 'Test Post for search']);
        /** @var \VisualComposer\Helpers\Request $requestHelper */
        $requestHelper = vchelper('Request');
        $requestHelper->setData(
            [
                'vcv-search' => 'for search',
            ]
        );
        /** @var \VisualComposer\Helpers\Filters $helper */
        $helper = vchelper('Filters');
        $result = $helper->fire('vcv:ajax:attribute:linkSelector:getPosts');
        $find = false;
        $findTitle = '';
        foreach ($result as $post) {
            if ($post['id'] === $postId) {
                $find = true;
                $findTitle = $post['title'];
                break;
            }
        }
        $this->assertEquals('Test Post for search', $findTitle);
        $this->assertTrue($find, 'post should be found');
    }
}
