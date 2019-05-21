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

    public function testUser()
    {
        wp_set_current_user(1);

        $helper = vchelper('Options');

        $this->assertEquals('1', $helper->getUser('test1', '1'));
        $this->assertEquals('2', $helper->getUser('test1', '2'));
        $this->assertEquals('', $helper->getUser('test1'));

        $helper->setUser('test2', ['watched' => true]);
        $this->assertEquals(['watched' => true], $helper->getUser('test2'));
        $this->assertEquals(['watched' => true], $helper->getUser('test2', ['watched' => false]));
        wp_set_current_user(0);
        $this->assertEquals('', $helper->getUser('test2'));

    }
}
