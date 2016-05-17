<?php
namespace Tests\PhpUnit\Modules\System;

class DomainControllerTest extends \WP_UnitTestCase
{
    public function testLocale()
    {
        $dom = '';
        $called = false;
        $callback = function ($locale, $domain) use (&$called, &$dom) {
            $called = true;
            $dom = $domain;
        };
        add_filter('plugin_locale', $callback, 10, 2);
        vcevent('vcv:inited');
        $this->assertTrue($called);
        $this->assertEquals($dom, 'vc5');
    }
}
