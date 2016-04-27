<?php

class SiteControllerTest extends WP_UnitTestCase
{
    public function testAppendScript()
    {
        /** @var $module \VisualComposer\Modules\Site\Controller */
        $module = vcapp('SiteController');

        /** @var \VisualComposer\Helpers\Url $urlHelper */
        $urlHelper = vchelper('Url');

        ob_start();
        $module->appendScript($urlHelper);
        $output = ob_get_contents();
        ob_end_clean();

        $pattern = '/<script src=".+node_modules\/less\/dist\/less.js" data-async="true"><\/script>/';

        $this->assertEquals(1, preg_match($pattern, $output));
    }

}
