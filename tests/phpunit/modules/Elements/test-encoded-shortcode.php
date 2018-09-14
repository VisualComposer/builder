<?php

namespace Tests\PhpUnit\Modules\Elements;

class EncodedShortcodeTest extends \WP_UnitTestCase
{
    public function testRender()
    {
        $content = 'test encoded shortcode';
        $encoded = rawurlencode(base64_encode($content));

        $this->assertEquals($content, do_shortcode('[vcv_encoded_shortcode]' . $encoded . '[/vcv_encoded_shortcode]'));
    }
}
