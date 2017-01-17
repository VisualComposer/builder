<?php

class HelpersWpWidgetsTest extends WP_UnitTestCase
{
    public function testWpWidgetsHelper()
    {
        $helper = vchelper('WpWidgets');
        $this->assertTrue(is_object($helper));
        $widgets = $helper->all();
        $this->assertTrue(is_array($widgets));
        $this->assertTrue(!empty($widgets));
    }

    public function testDefaultWpWidgets()
    {
        $helper = vchelper('WpWidgets');
        $widgets = $helper->all();
        $defaults = [
            'pages' => false,
            'calendar' => false,
            'archives' => false,
            'meta' => false,
            'search' => false,
            'text' => false,
            'categories' => false,
            'recent-posts' => false,
            'recent-comments' => false,
            'rss' => false,
            'tag_cloud' => false,
            'nav_menu' => false,
        ];
        $this->assertTrue(count($widgets) >= 12);
        foreach ($widgets as $widget) {
            /** @var $widget \WP_Widget */
            $this->assertTrue(is_object($widget));
            $this->assertTrue(isset($widget->name));
            $this->assertTrue(array_key_exists($widget->id_base, $defaults));
            $defaults[ $widget->id_base ] = true;
        }
        foreach ($defaults as $widgetId => $exists) {
            $this->assertTrue($exists, 'Widget with id:' . $widgetId . ' are default and should exist');
        }
    }

    public function testGetWidget()
    {
        $this->assertTrue(is_object(vchelper('WpWidgets')->get('WP_Widget_Pages')));
        $this->assertNull(vchelper('WpWidgets')->get('wp_widget_pages'));
    }

    public function testExistsWidget()
    {
        $this->assertTrue(vchelper('WpWidgets')->exists('WP_Widget_Pages'));
        $this->assertFalse(vchelper('WpWidgets')->exists('wp_widget_pages'));
    }

    public function testGetWidgetsUrl()
    {
        $url = get_site_url() .
            '/?vcv-ajax=1&vcv-action=' .
            rawurlencode('elements:widget:script:adminNonce') .
            '&vcv-nonce=' .
            vchelper('Nonce')->admin();

        $this->assertEquals(
            $url,
            vchelper('WpWidgets')->getWidgetsUrl(vchelper('Url'), vchelper('Nonce'))
        );
    }

    public function testIsDefault()
    {
        $this->assertTrue(vchelper('WpWidgets')->isDefault('WP_Widget_Pages'));
    }

    public function testGetAllGrouped()
    {
        $helper = vchelper('WpWidgets');
        $all = $helper->allGrouped();
        $this->assertTrue(array_key_exists('wpWidgetsDefault', $all));
        $this->assertTrue(array_key_exists('wpWidgetsCustom', $all));
        $this->assertTrue(!empty($all['wpWidgetsDefault']));
    }
}
