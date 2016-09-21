<?php

class ContainerTest extends WP_UnitTestCase
{
    public function testContainerMake()
    {
        /** @var ContainerCustomModule $module */
        $module = vcapp('ContainerCustomModule', [1, ['test']]);
        $this->assertTrue($module->test());
    }

    public function testContainerMakeCustomParam()
    {
        /** @var ContainerCustomModule $module */
        $module = vcapp('ContainerCustomModule', [new stdClass(), ['test']]);
        $this->assertTrue($module->test2());
    }

    public function testContainerMakeDefaultParam()
    {
        /** @var ContainerCustomModule $module */
        $module = vcapp('ContainerCustomModule', [0]);
        $this->assertTrue($module->test());
    }

    public function testContainerCall()
    {
        /** @var ContainerCustomModule $module */
        $module = vcapp('ContainerCustomModule', [0]);
        $this->assertTrue($module->call('a'));
        $this->assertTrue($module->call('b'));
        $this->assertTrue($module->b());
        $this->assertTrue(vcapp()->call([$module, 'b']));
    }

    /**
     * @expectedException BadMethodCallException
     */
    public function testContainerException()
    {
        $module = vcapp('ContainerCustomModule', [0]);
        $module->call(['something']);

    }

    /**
     * @expectedException \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
     */
    public function testContainerBindingException()
    {
        $module = vcapp('PrivateContainerCustomModule');
        $module->call(['something']);
    }

    public function testInstance()
    {
        $module = vcapp('ContainerCustomModule', [0]);
        $vcapp = vcapp();
        $vcapp->instance(['UnrealAbstract' => 'myModule'], $module);
        // Test rebound.
        $vcapp->instance(['UnrealAbstract' => 'myModule'], $module);
        $this->assertEquals(vcapp('myModule'), $module);
        $this->assertNotEquals(vcapp('myModule'), vcapp('ContainerCustomModule'));
        $this->assertNotEquals(vcapp('ContainerCustomModule'), vcapp('ContainerCustomModule'));
    }

    public function testSingleton()
    {
        vcapp()->singleton(['ContainerCustomModule' => 'testSingleton']);
        $this->assertEquals(vcapp('testSingleton', [0]), vcapp('ContainerCustomModule', [0]));
        $this->assertEquals(vcapp('ContainerCustomModule', [0]), vcapp('ContainerCustomModule', [0]));
        // Test forget instance for singleton, must return new singleton!
        vcapp()->forgetInstance('ContainerCustomModule');
        $this->assertEquals(vcapp('testSingleton', [0]), vcapp('ContainerCustomModule', [0]));
        $this->assertEquals(vcapp('ContainerCustomModule', [0]), vcapp('ContainerCustomModule', [0]));
        // Unsettings singleton.
        vcapp()->bind(['ContainerCustomModule' => 'testSingleton'], null, false);
        $this->assertNotEquals(vcapp('testSingleton', [0]), vcapp('ContainerCustomModule', [0]));
        $this->assertNotEquals(vcapp('ContainerCustomModule', [0]), vcapp('ContainerCustomModule', [0]));
    }

    public function testSimpleMake()
    {
        /** @var CustomContainer $application */
        $application = vcapp()->make('CustomContainer');

        $application->bind('\\PrivateContainerCustomModule', 'SimpleCustomModule');
        $this->assertTrue($application->getCustomConcrete('\\PrivateContainerCustomModule') instanceof Closure);

        $application->setCustomConcrete('\\PrivateContainerCustomModule', 'SimpleCustomModule');
        $this->assertEquals('SimpleCustomModule', $application->getCustomConcrete('\\PrivateContainerCustomModule'));

        $application->make('PrivateContainerCustomModule');
        $this->assertTrue(SimpleCustomModule::$init);
    }

    public function testCallReflector()
    {
        $this->assertTrue(vcapp()->call('SimpleCustomModule::testCallReflector'));
        $this->assertTrue(SimpleCustomModule::$callReflectorCalled);
    }
}

class ContainerCustomModule extends \VisualComposer\Framework\Container
{
    private $creationTime;

    private $options;

    private $data;

    private $test;

    use \VisualComposer\Framework\Illuminate\Support\Traits\Container;

    public function __construct(\VisualComposer\Helpers\Options $options, $data, $test = [])
    {
        $this->options = $options;
        $this->creationTime = microtime(true);
        $this->data = $data;
        $this->test = $test;
    }

    public function test()
    {
        return is_numeric($this->data) && is_array($this->test) && count($this->test) == $this->data;
    }

    public function test2()
    {
        return is_object($this->data) && $this->data instanceof stdClass;
    }

    public function call($method, array $parameters = [])
    {
        return parent::call($method, $parameters);
    }

    private function a()
    {
        return true;
    }

    public function b()
    {
        return true;
    }
}

class PrivateContainerCustomModule
{
    private function __construct()
    {
    }
}

class SimpleCustomModule
{
    static $init = false;

    static $callReflectorCalled = false;

    public function __construct()
    {
        self::$init = true;
    }

    public static function testCallReflector()
    {
        self::$callReflectorCalled = true;

        return true;
    }
}

class CustomContainer extends \VisualComposer\Framework\Illuminate\Container\Container
{
    public function setCustomConcrete($abstract, $concrete)
    {
        $this->bindings[ $abstract ]['concrete'] = $concrete;
    }

    public function getCustomConcrete($abstract)
    {
        return $this->bindings[ $abstract ]['concrete'];
    }
}