<?php

class WpWidgetsShortcodeTest extends \WP_UnitTestCase
{
    public function testRender()
    {
        $this->createPage();
        $this->assertEquals(1, did_action('init'));
        $this->assertTrue(shortcode_exists('vcv_widgets'));
        $output1 = do_shortcode(
            '[vcv_widgets args=' . rawurlencode(
                json_encode(['before_widget' => '', 'before_title' => '', 'after_title' => '', 'after_widget' => ''])
            ) . ']'
        );
        $output2 = do_shortcode(
            '[vcv_widgets args=' . rawurlencode(
                json_encode(['before_widget' => '', 'before_title' => '', 'after_title' => '', 'after_widget' => ''])
            ) . ' key=""]'
        );
        $output3 = do_shortcode(
            '[vcv_widgets args=' . rawurlencode(
                json_encode(['before_widget' => '', 'before_title' => '', 'after_title' => '', 'after_widget' => ''])
            ) . ' key="WP_Widget_Pages"]'
        );
        // Even if no key it will show some widget
        $this->assertTrue(!empty($output1), $output1);
        $this->assertTrue(!empty($output2), $output2);
        $this->assertTrue(!empty($output3), $output3);
    }

    protected function createPage()
    {
        wp_set_current_user(1);

        $postTypeHelper = vchelper('PostType');

        $postId = $postTypeHelper->create(
            [
                'post_type' => 'page',
                'post_status' => 'publish',
                'post_content' => "hello",
            ]
        );

        $this->assertIsInt($postId);

        return $postId;
    }
}
