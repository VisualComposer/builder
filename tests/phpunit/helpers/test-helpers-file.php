<?php

class HelpersFileTest extends WP_UnitTestCase
{
    public function testFileHelper()
    {
        /**
         * @var $helper VisualComposer\Helpers\File
         */
        $helper = vcapp('VisualComposer\Helpers\File');

        $this->assertTrue(is_object($helper), 'File helper should be an object');
    }

    public function testGetSetContents()
    {
        /**
         * @var $helper VisualComposer\Helpers\File
         */
        $helper = vcapp('VisualComposer\Helpers\File');

        $dir = wp_upload_dir();

        $filepath = $dir['path'] . '/test-' . md5(microtime());

        $this->assertEquals(6, $helper->setContents($filepath, 'foobar'));

        $this->assertEquals('foobar', $helper->getContents($filepath));

        unlink($filepath);

        $this->assertFalse($helper->getContents($filepath));
    }
    public function testCheckDir() {
        /**
         * @var $helper VisualComposer\Helpers\File
         */
        $helper = vcapp('VisualComposer\Helpers\File');

        $dir = wp_upload_dir();
        $directory = $dir['path'] . 'test-directory-' . md5(microtime());
        $this->assertEquals(true, $helper->checkDir($directory));
        unlink($directory);
    }
}
