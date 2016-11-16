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
}
