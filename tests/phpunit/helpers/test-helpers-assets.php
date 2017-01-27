<?php

class HelpersAssetsTest extends WP_UnitTestCase
{
    public function testAssetsHelper()
    {
        /**
         * @var $helper VisualComposer\Helpers\Assets
         */
        $helper = vcapp('VisualComposer\Helpers\Assets');

        $this->assertTrue(is_object($helper), 'Assets helper should be an object');
    }

    public function testGetPath()
    {
        $helper = vchelper('Assets');
        $path = $helper->getFilePath();
        $destinationDir = WP_CONTENT_DIR . '/' . VCV_PLUGIN_ASSETS_DIRNAME . '/assets-bundles';
        $this->assertTrue(strpos($path, WP_CONTENT_DIR) !== false);
        $this->assertEquals($destinationDir, $path);

        $filepath = 'test.css';
        $path = $helper->getFilePath($filepath);
        $this->assertTrue(strpos($path, WP_CONTENT_DIR) !== false);
        $this->assertEquals($destinationDir . '/' . $filepath, $path);
    }

    public function testGetUrl()
    {
        $helper = vchelper('Assets');
        $path = $helper->getFileUrl();
        $destinationDir = WP_CONTENT_URL . '/' . VCV_PLUGIN_ASSETS_DIRNAME . '/assets-bundles';
        $this->assertTrue(strpos($path, WP_CONTENT_URL) !== false);
        $this->assertEquals($destinationDir, $path);

        $filepath = 'test.css';
        $path = $helper->getFileUrl($filepath);
        $this->assertTrue(strpos($path, WP_CONTENT_URL) !== false);
        $this->assertEquals($destinationDir . '/' . $filepath, $path);
    }
}
