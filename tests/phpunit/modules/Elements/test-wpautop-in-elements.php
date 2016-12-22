<?php

class WpAutopTests extends \WP_UnitTestCase
{
    public function testAnimatedOutlineButtonSpans()
    {
        $buttonHtml = <<<HTML
<div class="vce-button--style-animated-outline-container vce-button--style-animated-outline-container--align-left" data-vcv-element="29844a03" data-vcv-dnd-element="29844a03" data-vcv-dnd-element-handler="29844a03"><span class="vce-button--style-animated-outline-wrapper vce" id="el-29844a03"><button class="vce-button--style-animated-outline vce-button--style-animated-outline--color-555555--FFC000"><span class="vce-button--style-animated-outline__content-box"><span class="vce-button--style-animated-outline__content">Apply Now</span></span></button></span></div>
HTML;
        $expected = $buttonHtml;
        $this->assertEquals($expected, trim(wpautop($buttonHtml)));
    }
}
