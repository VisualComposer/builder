<?php

class SiteControllerTest extends WP_UnitTestCase
{
    public function testAppendScript()
    {
        /** @var $module \VisualComposer\Modules\Site\Controller */
        $module = vcapp('SiteController');

        ob_start();
        /** @see \VisualComposer\Modules\Site\Controller::appendScript */
        vcapp()->call($module, 'appendScript');
        $output = ob_get_contents();
        ob_end_clean();

        $pattern = '/<script src=".+node_modules\/less\/dist\/less.js" data-async="true"><\/script>/';

        $this->assertEquals(1, preg_match($pattern, $output));
    }
}
