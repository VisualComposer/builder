<?php

class SiteControllerTest extends WP_UnitTestCase
{
    public function testAppendScript()
    {
        /** @var $module \VisualComposer\Modules\Site\Controller */
        $module = vc_create_module_mock('\VisualComposer\Modules\Site\Controller');

        ob_start();
        vcapp()->call([$module, 'appendScript']);
        $output = ob_get_contents();
        ob_end_clean();

        $pattern = '/<script src=".+node_modules\/less\/dist\/less.js" data-async="true"><\/script>/';

        $this->assertEquals(1, preg_match($pattern, $output));
    }
}
