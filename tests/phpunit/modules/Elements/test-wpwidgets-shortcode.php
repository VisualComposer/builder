<?php

class WpWidgetsShortcodeTest extends \WP_UnitTestCase
{
    public function testRender()
    {
        $this->assertEquals(1, did_action('init'));
        $this->assertTrue(shortcode_exists('vcv_widgets'));
        $output1 = do_shortcode('[vcv_widgets]');
        $output2 = do_shortcode('[vcv_widgets key=""]');
        $output3 = do_shortcode('[vcv_widgets key="WP_Widget_Pages"]');
        $this->assertTrue(empty($output1));
        $this->assertTrue(empty($output2));
        $this->assertTrue(!empty($output3));
    }
}
