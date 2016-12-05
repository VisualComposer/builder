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
        $uploadDir = wp_upload_dir();
        $destinationDir = $uploadDir['basedir'] . '/' . VCV_PLUGIN_DIRNAME . '/assets-bundles';
        $this->assertTrue(strpos($path, $uploadDir['basedir']) !== false);
        $this->assertEquals($destinationDir, $path);

        $filepath = 'test.css';
        $path = $helper->getFilePath($filepath);
        $this->assertTrue(strpos($path, $uploadDir['basedir']) !== false);
        $this->assertEquals($destinationDir . '/' . $filepath, $path);
    }

    public function testGetUrl()
    {
        $helper = vchelper('Assets');
        $path = $helper->getFileUrl();
        $uploadDir = wp_upload_dir();
        $destinationDir = $uploadDir['baseurl'] . '/' . VCV_PLUGIN_DIRNAME . '/assets-bundles';
        $this->assertTrue(strpos($path, $uploadDir['baseurl']) !== false);
        $this->assertEquals($destinationDir, $path);

        $filepath = 'test.css';
        $path = $helper->getFileUrl($filepath);
        $this->assertTrue(strpos($path, $uploadDir['baseurl']) !== false);
        $this->assertEquals($destinationDir . '/' . $filepath, $path);
    }
}
