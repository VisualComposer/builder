<?php

class ApiFactoryControllerTest extends WP_UnitTestCase
{
    public function testRegister()
    {
        /** @var \VisualComposer\Helpers\Filters $filterHelper */
        $filterHelper = vchelper('Filters');
        $filterHelper->listen(
            'vcv:api:service',
            function ($name) {
                if ($name === 'testRegister') {
                    return '\TestRegisterApiController';
                }
                if ($name === 'testRegister2') {
                    return '\TestRegister2ApiController';
                }
                if ($name === 'testRegister3') {
                    return '\TestRegister3ApiController';
                }

                return $name;
            }
        );
        /** @var \VisualComposer\Application $vcapp */
        $vcapp = vcapp();
        $vcapp->singleton('\TestRegister3ApiController');
        $this->assertTrue(is_object(vcapp('\VisualComposer\Modules\Api\Factory')->testRegister));
        $this->assertTrue(vcapp('\VisualComposer\Modules\Api\Factory')->testRegister->test());
        $this->assertEquals(0, vcapp('\VisualComposer\Modules\Api\Factory')->testRegister2->test());
        $this->assertEquals(100, vcapp('\VisualComposer\Modules\Api\Factory')->testRegister2(100)->test());

        // Make sure it is new instance always
        $this->assertEquals(0, vcapp('\VisualComposer\Modules\Api\Factory')->testRegister2->test());

        $this->assertEquals(0, vcapp('\VisualComposer\Modules\Api\Factory')->testRegister3->test());
        // For singleton it must be 0
        $this->assertEquals(0, vcapp('\VisualComposer\Modules\Api\Factory')->testRegister3(100)->test());
    }
}

class TestRegisterApiController
{
    public function test()
    {
        return true;
    }
}

class TestRegister2ApiController
{
    protected $value = 0;

    public function __construct($value = 0)
    {
        $this->value = $value;
    }

    public function test()
    {
        return $this->value;
    }
}

class TestRegister3ApiController
{
    protected $value = 0;

    public function __construct($value = 0)
    {
        $this->value = $value;
    }

    public function test()
    {
        return $this->value;
    }
}
