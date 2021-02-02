<?php

class ContainerReflectorTest extends WP_UnitTestCase
{
    public function testReflector()
    {
        vcapp('ContainerReflectorModule');
        $this->assertEquals(1, vcfilter('vcv:reflector:test'));
        $this->assertEquals(1, vcfilter('vcv:reflector:test:good'));
        $this->assertEquals('protected', vcfilter('vcv:reflector:test:method:protected'));
        $this->assertEquals('private', vcfilter('vcv:reflector:test:method:private'));
        $this->assertEquals('ContainerReflectorModulepublic', vcfilter('vcv:reflector:test:method:public'));
        $this->assertEquals('ContainerReflectorModulestatic', vcfilter('vcv:reflector:test:method:static'));
        $this->assertEquals(true, vcfilter('vcv:reflector:test:general'));
        $this->assertEquals('ContainerReflectorModuleAnotherpublic', vcfilter('vcv:reflector:test:another:class'));
        $this->assertEquals('ContainerReflectorModuleAnotherstatic', vcfilter('vcv:reflector:test:another:static'));
        $this->assertEquals('ContainerReflectorModuleAnotherstatic', vcfilter('vcv:reflector:test:oneMore'));
        $this->assertEquals('ContainerReflectorModulestatic', vcfilter('vcv:another:reflector:test:another:static'));
    }
}

class ContainerReflectorModule extends \VisualComposer\Framework\Container
{
    use \VisualComposer\Helpers\Traits\EventsFilters;

    protected $good = 1;

    public function __construct()
    {
        $this->addFilter('vcv:reflector:test', function () {
            return 1;
        });
        $this->addFilter('vcv:reflector:test:good', function () {
            return $this->good;
        });
        $this->addFilter('vcv:reflector:test:method:protected', 'prot');
        $this->addFilter('vcv:reflector:test:method:private', 'priv');
        $this->addFilter('vcv:reflector:test:method:public', 'publ');
        $this->addFilter('vcv:reflector:test:method:static', 'stat');
        $this->addFilter('vcv:reflector:test:general', '__return_true');
        $this->addFilter('vcv:reflector:test:oneMore', function() {
            return $this->call('\ContainerReflectorModuleAnother::stat');
        });
        $this->addFilter('vcv:reflector:test:another:class', '\ContainerReflectorModuleAnother::publ');
        $this->addFilter('vcv:reflector:test:another:static', '\ContainerReflectorModuleAnother::stat');
    }

    protected function prot()
    {
        return 'protected';
    }

    private function priv()
    {
        return 'private';
    }

    public function publ()
    {
        return __CLASS__ . 'public';
    }

    public static function stat()
    {
        return __CLASS__ . 'static';
    }
}

class ContainerReflectorModuleAnother extends \VisualComposer\Framework\Container
{
    use \VisualComposer\Helpers\Traits\EventsFilters;

    protected $good = 2;

    public function __construct()
    {
        $this->addFilter('vcv:another:reflector:test', function () {
            return 2;
        });
        $this->addFilter('vcv:another:reflector:test:good', function () {
            return $this->good;
        });
        $this->addFilter('vcv:another:reflector:test:method:protected', 'prot');
        $this->addFilter('vcv:another:reflector:test:method:private', 'priv');
        $this->addFilter('vcv:another:reflector:test:method:public', 'publ');
        $this->addFilter('vcv:another:reflector:test:method:static', 'stat');
        $this->addFilter('vcv:another:reflector:test:general', '__return_true');
        $this->addFilter('vcv:another:reflector:test:another:class', '\ContainerReflectorModule::publ');
        $this->addFilter('vcv:another:reflector:test:another:static', '\ContainerReflectorModule::stat');
    }

    protected function prot()
    {
        return 'protected';
    }

    private function priv()
    {
        return 'private';
    }

    public function publ()
    {
        return __CLASS__ . 'public';
    }

    public static function stat()
    {
        return __CLASS__ . 'static';
    }
}
