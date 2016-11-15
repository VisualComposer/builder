<?php

class HelpersStrTest extends WP_UnitTestCase
{
    public function testStrHelper()
    {
        /**
         * @var $helper VisualComposer\Helpers\Str
         */
        $helper = vcapp('VisualComposer\Helpers\Str');

        $this->assertTrue(is_object($helper), 'Str helper should be an object');
    }

    public function testCamel()
    {
        /**
         * @var $helper VisualComposer\Helpers\Str
         */
        $helper = vcapp('VisualComposer\Helpers\Str');

        $this->assertTrue(method_exists($helper, 'camel'));

        $this->assertEquals('someRandomString', $helper->camel('some random string'));
        $this->assertEquals('someRandomString', $helper->camel('some_random_string'));
        $this->assertEquals('someRandomString', $helper->camel('SomeRandom-string'));
        $this->assertEquals('someRandomString', $helper->camel('SomeRandom-String'));
        $this->assertEquals('sOMERANDOMSTRING', $helper->camel('SOME RANDOM STRING'));
        $this->assertEquals('sOMERANDOMSTRING', $helper->camel('SOME_RANDOM_STRING'));
        $this->assertEquals('***', $helper->camel('_*_ --* *'));
        $this->assertEquals('***', $helper->camel('_*_ --* *')); // test cache
        $this->assertEquals('', $helper->camel(null));
    }

    public function testContains()
    {
        /**
         * @var $helper VisualComposer\Helpers\Str
         */
        $helper = vcapp('VisualComposer\Helpers\Str');

        $this->assertTrue(method_exists($helper, 'contains'));

        $haystack = 'Some random string';

        $this->assertTrue($helper->contains($haystack, 'Some'));

        $this->assertTrue($helper->contains($haystack, ' random '));

        $this->assertTrue($helper->contains($haystack, ['Some', 'string']));

        $this->assertTrue($helper->contains($haystack, ['Some', 'foobar']));

        $this->assertFalse($helper->contains($haystack, ['foo', 'bar']));

        $this->assertFalse($helper->contains($haystack, 'some'));

        $this->assertFalse($helper->contains($haystack, ''));

        $this->assertFalse($helper->contains($haystack, []));
    }

    public function testEndsWith()
    {
        /**
         * @var $helper VisualComposer\Helpers\Str
         */
        $helper = vcapp('VisualComposer\Helpers\Str');

        $this->assertTrue(method_exists($helper, 'endsWith'));

        $haystack = 'Some random string';

        $this->assertTrue($helper->endsWith($haystack, ' string'));

        $this->assertTrue($helper->endsWith($haystack, ['foobar', 'string']));

        $this->assertFalse($helper->endsWith($haystack, 'String'));

        $this->assertFalse($helper->endsWith($haystack, ''));

        $this->assertFalse($helper->endsWith($haystack, []));
    }

    public function testFinish()
    {
        /**
         * @var $helper VisualComposer\Helpers\Str
         */
        $helper = vcapp('VisualComposer\Helpers\Str');

        $this->assertTrue(method_exists($helper, 'finish'));

        $value = 'Foo bar';

        $this->assertEquals('Foo barX', $helper->finish($value, 'X'));

        $this->assertEquals('Foo bar()', $helper->finish($value, '()'));

        $this->assertEquals('Foo bar', $helper->finish($value, ''));

        $this->assertEquals('/', $helper->finish('', '/'));
    }

    public function testIs()
    {
        /**
         * @var $helper VisualComposer\Helpers\Str
         */
        $helper = vcapp('VisualComposer\Helpers\Str');

        $this->assertTrue(method_exists($helper, 'is'));

        $this->assertTrue($helper->is('foo', 'foo'));

        $this->assertTrue($helper->is('Foo*', 'Foobar'));

        $this->assertTrue($helper->is('*bar*', 'foobarbaz'));

        $this->assertTrue($helper->is('1*9', '19'));

        $this->assertTrue($helper->is('1*9', '1foo9'));

        $this->assertTrue($helper->is('123', 123));

        $this->assertFalse($helper->is('*bar*', 'fooBARbaz'));

        $this->assertFalse($helper->is('one', true));
    }

    public function testLength()
    {
        /**
         * @var $helper VisualComposer\Helpers\Str
         */
        $helper = vcapp('VisualComposer\Helpers\Str');

        $this->assertTrue(method_exists($helper, 'length'));

        $this->assertEquals(14, $helper->length('glāžšķūņrūķīši'));

        $this->assertEquals(9, $helper->length(' foo bar '));

        $this->assertEquals(1, $helper->length('茶'));

        $this->assertEquals(0, $helper->length(null));

        $this->assertEquals(0, $helper->length(''));
    }

    public function testLimit()
    {
        /**
         * @var $helper VisualComposer\Helpers\Str
         */
        $helper = vcapp('VisualComposer\Helpers\Str');

        $value = 'The quick brown fox! Jumps over the lazy dog.';

        $this->assertTrue(method_exists($helper, 'limit'));

        $this->assertEquals('The quick...', $helper->limit($value, 9));

        $this->assertEquals('The--', $helper->limit($value, 3, '--'));

        $this->assertEquals($value, $helper->limit($value, 999));

        $this->assertEquals('', $helper->limit(null));

        $this->assertEquals('', $helper->limit(''));
    }

    public function testLower()
    {
        /**
         * @var $helper VisualComposer\Helpers\Str
         */
        $helper = vcapp('VisualComposer\Helpers\Str');

        $this->assertTrue(method_exists($helper, 'lower'));

        $this->assertEquals('glāžšķūņrūķīši', $helper->lower('GLĀŽŠĶŪŅrūķīši'));

        $this->assertEquals('foo bar', $helper->lower('FOO BAR'));

        $this->assertEquals('茶', $helper->lower('茶'));

        $this->assertEquals('', $helper->lower(null));

        $this->assertEquals('', $helper->lower(''));
    }

    public function testQuickRandom()
    {
        /**
         * @var $helper VisualComposer\Helpers\Str
         */
        $helper = vcapp('VisualComposer\Helpers\Str');

        $this->assertTrue(method_exists($helper, 'quickRandom'));

        $this->assertEquals(16, strlen($helper->quickRandom()));

        $this->assertEquals(10, strlen($helper->quickRandom(10)));

        $this->assertNotEquals($helper->quickRandom(), $helper->quickRandom());

        $this->assertEquals('', $helper->quickRandom(0));

        $this->assertEquals('', $helper->quickRandom(-10));
    }

    public function testUpper()
    {
        /**
         * @var $helper VisualComposer\Helpers\Str
         */
        $helper = vcapp('VisualComposer\Helpers\Str');

        $this->assertTrue(method_exists($helper, 'upper'));

        $this->assertEquals('GLĀŽŠĶŪŅRŪĶĪŠI', $helper->upper('GLĀŽŠĶŪŅrūķīši'));

        $this->assertEquals('FOO BAR', $helper->upper('foo bar'));

        $this->assertEquals('茶', $helper->upper('茶'));

        $this->assertEquals('', $helper->upper(null));

        $this->assertEquals('', $helper->upper(''));
    }

    public function testTitle()
    {
        /**
         * @var $helper VisualComposer\Helpers\Str
         */
        $helper = vcapp('VisualComposer\Helpers\Str');

        $this->assertTrue(method_exists($helper, 'title'));

        $value = 'Some-random_fooBarBaz!xyz string XXX ';

        $this->assertEquals('Some-Random_Foobarbaz!xyz String Xxx ', $helper->title($value));

        $this->assertEquals('', $helper->title(null));

        $this->assertEquals('', $helper->title(''));
    }

    public function testSnake()
    {
        /**
         * @var $helper VisualComposer\Helpers\Str
         */
        $helper = vcapp('VisualComposer\Helpers\Str');

        $this->assertTrue(method_exists($helper, 'snake'));

        $value = 'Some-random_fooBarBaz!xyz string XXX ';

        $this->assertEquals('some-random_foo*bar*baz!xyz string *x*x*x ', $helper->snake($value, '*'));

        $this->assertEquals('', $helper->snake(null));

        $this->assertEquals('', $helper->snake(''));
    }

    public function testStartsWith()
    {
        /**
         * @var $helper VisualComposer\Helpers\Str
         */
        $helper = vcapp('VisualComposer\Helpers\Str');

        $this->assertTrue(method_exists($helper, 'startsWith'));

        $haystack = 'Some random string';

        $this->assertTrue($helper->startsWith($haystack, 'Some '));

        $this->assertTrue($helper->startsWith($haystack, ['foobar', 'Some']));

        $this->assertFalse($helper->startsWith($haystack, 'some'));

        $this->assertFalse($helper->startsWith($haystack, ''));

        $this->assertFalse($helper->startsWith($haystack, []));
    }

    public function testStudly()
    {
        /**
         * @var $helper VisualComposer\Helpers\Str
         */
        $helper = vcapp('VisualComposer\Helpers\Str');

        $this->assertTrue(method_exists($helper, 'studly'));

        $value = 'Some-random_fooBarBaz!xyz string XXX ';

        $this->assertEquals('SomeRandomFooBarBaz!xyzStringXXX', $helper->studly($value));

        $this->assertEquals('', $helper->studly(null));

        $this->assertEquals('', $helper->studly(''));
    }

    public function testbuildQueryString()
    {
        $helper = vchelper('Str');

        $this->assertEquals(
            '',
            $helper->buildQueryString(
                [
                ]
            )
        );
        $this->assertEquals(
            'key="value"',
            $helper->buildQueryString(
                [
                    'key' => 'value',
                ]
            )
        );
        $this->assertEquals(
            'key="value" key2="value2"',
            $helper->buildQueryString(
                [
                    'key' => 'value',
                    'key2' => 'value2',
                ]
            )
        );
        $this->assertEquals(
            'key="value" key2="value2" something=""',
            $helper->buildQueryString(
                [
                    'key' => 'value',
                    'key2' => 'value2',
                    'something' => '',
                ]
            )
        );
        $this->assertEquals(
            'key="value" key2="value2" something="1"',
            $helper->buildQueryString(
                [
                    'key' => 'value',
                    'key2' => 'value2',
                    'something' => 1,
                ]
            )
        );
    }
}
