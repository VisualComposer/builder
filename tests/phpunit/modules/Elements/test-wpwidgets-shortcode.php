<?php

class WpWidgetsShortcodeTest extends \WP_UnitTestCase
{
    public function testRender()
    {
        vcevent('vcv:inited', vcapp());
        $output1 = do_shortcode('[vcv_widget]');
        $output2 = do_shortcode('[vcv_widget key=""]');
        $output3 = do_shortcode('[vcv_widget key="WP_Widget_Pages"]');
        $this->assertTrue(empty($output1));
        $this->assertTrue(empty($output2));
        $this->assertTrue(!empty($output3));
    }
}
