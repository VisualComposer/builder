<?php
$testContainerDIFunctionFunctionCalled = false;
$testContainerDIFunctionNameFunctionCalled = false;

class Php8ContainerTest extends WP_UnitTestCase
{
    /** @var MyTestModule */
    protected $container;

    public function setUp(): void
    {
        parent::setUp();
        $this->container = vcapp('MyTestModulePhp8');
    }

    public function testVcAppMake()
    {
        $this->assertIsObject($this->container);
        // Generic Tests on Object
        $this->assertEquals('Hello World!', $this->container->test());
        $this->assertEquals('Hello-World!', $this->container->testAB('Hello', 'World!'));
        $this->assertEquals('Hello-100', $this->container->testNamedAB('Hello', 100));
    }

    public function testContainerDIFunction()
    {
        global $testContainerDIFunctionFunctionCalled;
        $result = vcapp()->call('checkFunction');
        $this->assertTrue($testContainerDIFunctionFunctionCalled);
        $this->assertEquals(500, $result);
    }

    public function testContainerDIFunctionName()
    {
        global $testContainerDIFunctionNameFunctionCalled;
        $result = vcapp()->call('checkFunctionNamed');
        $this->assertTrue($testContainerDIFunctionNameFunctionCalled);
        $this->assertEquals(1000, $result);
    }
}

class MyTestModulePhp8 extends \VisualComposer\Framework\Container
{
    /**
     * Call the given callback and inject its dependencies.
     *
     * @param  $method
     * @param array $parameters
     *
     * @return mixed
     */
    public function call($method, array $parameters = [])
    {
        return parent::call($method, $parameters);
    }

    public function test()
    {
        return 'Hello World!';
    }

    public function testAB($a, $b)
    {
        return $a . '-' . $b;
    }

    public function testNamedAB(string $a, int $b)
    {
        return $a . '-' . $b;
    }
}

function checkFunction($defaultInt = 100)
{
    global $testContainerDIFunctionFunctionCalled;
    $testContainerDIFunctionFunctionCalled = true;

    return $defaultInt * 5;
}

function checkFunctionNamed(int $defaultInt = 100)
{
    global $testContainerDIFunctionNameFunctionCalled;
    $testContainerDIFunctionNameFunctionCalled = true;

    return $defaultInt * 10;
}
