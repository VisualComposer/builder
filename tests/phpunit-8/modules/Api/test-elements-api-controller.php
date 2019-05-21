<?php

class TestElementsApiController extends WP_UnitTestCase
{
    public function testElementsApi()
    {
        $this->assertTrue(is_object(vcapi()->elements));
        $this->assertFalse(vcapi()->elements->add());
    }
}
