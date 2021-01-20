<?php

class HelpersStatusTest extends WP_UnitTestCase
{
    /**
     * OK, this is a bit strange test maybe, but our docker testing environment will have the correct versions :)
     */
    public function testBasicVersions()
    {
        /** @var \VisualComposer\Helpers\Status $helper */
        $helper = vcapp('VisualComposer\Helpers\Status');

        $this->assertTrue($helper->getPhpVersionStatus());
        $this->assertTrue($helper->getWpVersionStatus());
        $this->assertFalse($helper->getWpDebugStatus());
    }

    public function testFileSystemStatus()
    {
        /** @var \VisualComposer\Helpers\Status $helper */
        $helper = vcapp('VisualComposer\Helpers\Status');

        $this->assertTrue($helper->getFileSystemStatus());

        define('FS_METHOD', 'ftpext');

        $this->assertFalse($helper->getFileSystemStatus());
    }

    public function testToBytesConversion()
    {
        /** @var \VisualComposer\Helpers\Status $helper */
        $helper = vcapp('VisualComposer\Helpers\Status');

        $this->assertEquals(2 * 1024 * 1024, $helper->convertMbToBytes('2m'));
        $this->assertEquals(2 * 1024 * 1024, $helper->convertMbToBytes('2M'));
        $this->assertEquals(256 * 1024 * 1024, $helper->convertMbToBytes('256m'));
        $this->assertEquals(256 * 1024 * 1024, $helper->convertMbToBytes('256M'));
        $this->assertEquals(1 * 1024 * 1024 * 1024, $helper->convertMbToBytes('1g'));
    }
}
