<?php

class CoreTest extends WP_UnitTestCase
{
    public function testPluginConstants()
    {
        $this->assertTrue(defined('VCV_VERSION'));
        $this->assertTrue(defined('VCV_PLUGIN_URL'));
        $this->assertTrue(defined('VCV_PLUGIN_DIR_PATH'));
        $this->assertTrue(defined('VCV_PLUGIN_BASE_NAME'));
        $this->assertTrue(defined('VCV_PLUGIN_FULL_PATH'));
        $this->assertTrue(defined('VCV_PLUGIN_DIRNAME'));
        $this->assertTrue(strpos(VCV_PLUGIN_DIRNAME, '/') === false);
        $this->assertTrue(strpos(VCV_PLUGIN_DIRNAME, '\\') === false);
        $this->assertTrue(defined('VCV_PREFIX'));

        // Used in requirements.php
        $this->assertTrue(defined('VCV_REQUIRED_PHP_VERSION'));
        $this->assertTrue(defined('VCV_REQUIRED_BLOG_VERSION'));
    }
}
