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
        $basedir = WP_CONTENT_DIR;
        $destinationDir = WP_CONTENT_DIR . '/' . VCV_PLUGIN_ASSETS_DIRNAME . '/assets-bundles/';
        if (vcvenv('VCV_TF_ASSETS_IN_UPLOADS')) {
            $uploadDir = wp_upload_dir();
            $basedir = $uploadDir['basedir'];
            $destinationDir = $basedir . '/' . VCV_PLUGIN_ASSETS_DIRNAME . '/assets-bundles/';
        }
        $this->assertTrue(strpos($path, $basedir) !== false);

        $this->assertEquals($destinationDir, $path);
        $this->assertEquals($destinationDir, VCV_PLUGIN_ASSETS_DIR_PATH . '/assets-bundles/');

        $filepath = 'test.css';
        $path = $helper->getFilePath($filepath);
        $this->assertTrue(strpos($path, $basedir) !== false);
        $this->assertEquals($destinationDir . $filepath, $path);
    }

    public function testGetUrl()
    {
        $helper = vchelper('Assets');
        $path = $helper->getAssetUrl('/assets-bundles/');

        $basedir = WP_CONTENT_URL;
        $destinationDir = WP_CONTENT_URL . '/' . VCV_PLUGIN_ASSETS_DIRNAME . '/assets-bundles/';
        if (vcvenv('VCV_TF_ASSETS_IN_UPLOADS')) {
            $uploadDir = wp_upload_dir();
            $basedir = $uploadDir['baseurl'];
            $destinationDir = $basedir . '/' . VCV_PLUGIN_ASSETS_DIRNAME . '/assets-bundles/';
        }
        $this->assertTrue(strpos($path, $basedir) !== false);
        $this->assertEquals($destinationDir, $path);

        $filepath = 'test.css';
        $path = $helper->getAssetUrl('/assets-bundles/' . $filepath);
        $this->assertTrue(strpos($path, $basedir) !== false);
        $this->assertEquals($destinationDir . $filepath, $path);
    }
}
