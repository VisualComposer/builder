<?php

class HelpersWpMediaTest extends WP_UnitTestCase
{
    public function testWpMediaHelper()
    {
        /**
         * @var $helper VisualComposer\Helpers\WpMedia
         */
        $helper = vcapp('VisualComposer\Helpers\WpMedia');

        $this->assertTrue(is_object($helper), 'WpMedia helper should be an object');
    }
}
