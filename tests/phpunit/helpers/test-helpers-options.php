<?php

class HelpersOptionsTest extends WP_UnitTestCase
{
    public function testOptionsHelper()
    {
        /**
         * @var $helper VisualComposer\Helpers\Options
         */
        $helper = vcapp('VisualComposer\Helpers\Options');

        $this->assertTrue(is_object($helper), 'File helper should be an object');
    }

    public function testGetSet()
    {
        /**
         * @var $helper VisualComposer\Helpers\Options
         */
        $helper = vcapp('VisualComposer\Helpers\Options');

        $name = 'test' . md5(microtime());

        $this->assertFalse($helper->get($name));
        $this->assertEquals('default-value', $helper->get($name, 'default-value'));

        $helper->set($name, 'foobar');
        $this->assertEquals('foobar', $helper->get($name));
    }

}
