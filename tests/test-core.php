<?php

class CoreTest extends WP_UnitTestCase
{

    public function testPluginConstants()
    {
        $this->assertTrue(defined('VC_V_VERSION'));
        $this->assertTrue(defined('VC_V_PLUGIN_URL'));
        $this->assertTrue(defined('VC_V_PLUGIN_DIR_PATH'));
        $this->assertTrue(defined('VC_V_PLUGIN_BASE_NAME'));
        $this->assertTrue(defined('VC_V_PLUGIN_FULL_PATH'));
        $this->assertTrue(defined('VC_V_PLUGIN_DIRNAME'));
        $this->assertTrue(defined('VC_V_PREFIX'));

        // Used in requirements.php
        $this->assertTrue(defined('VC_V_REQUIRED_PHP_VERSION'));
        $this->assertTrue(defined('VC_V_REQUIRED_BLOG_VERSION'));


        $this->assertTrue(defined('VC_V_START'));

    }


}