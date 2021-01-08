<?php

class HelpersSettingsTest extends WP_UnitTestCase
{
    public function testFieldsRegistryHelper()
    {
        $fieldsRegistry = vchelper('SettingsFieldsRegistry');
        $this->assertTrue(is_object($fieldsRegistry));
        $this->assertTrue(method_exists($fieldsRegistry, 'set'));
        $this->assertTrue(method_exists($fieldsRegistry, 'get'));
        $this->assertTrue(method_exists($fieldsRegistry, 'all'));
        $this->assertTrue(method_exists($fieldsRegistry, 'findBySlug'));
    }

    /**
     * @
     * @throws \Exception
     */
    public function testFieldsRegistryException()
    {
        /** @var \VisualComposer\Helpers\Settings\FieldsRegistry $fieldsRegistry */
        $fieldsRegistry = vchelper('SettingsFieldsRegistry');
        $this->assertTrue(empty($fieldsRegistry->all()));

        $this->expectException(Exception::class);

        $fieldsRegistry->set(
            'vcv-test',
            [
                'some' => 1,
            ]
        );
    }

    public function testFieldsRegistryAdd()
    {
        /** @var \VisualComposer\Helpers\Settings\FieldsRegistry $fieldsRegistry */
        $fieldsRegistry = vchelper('SettingsFieldsRegistry');
        // should be empty as previous failed
        $this->assertTrue(empty($fieldsRegistry->all()));

        $fieldsRegistry->set(
            'vcv-test',
            [
                'id' => 'test',
                'fieldCallback' => 1,
            ]
        );

        $this->assertTrue(!empty($fieldsRegistry->all()));
        $this->assertEquals(
            [
                'id' => 'test',
                'fieldCallback' => 1,
            ],
            $fieldsRegistry->get('vcv-test')
        );
    }

    public function testFieldRegistryFind()
    {
        /** @var \VisualComposer\Helpers\Settings\FieldsRegistry $fieldsRegistry */
        $fieldsRegistry = vchelper('SettingsFieldsRegistry');
        // should not be empty
        $this->assertTrue(!empty($fieldsRegistry->all()));
        $this->assertTrue(!empty($fieldsRegistry->findBySlug('test', 'id')));
        $this->assertEquals(
            [
                'vcv-test' => [
                    'id' => 'test',
                    'fieldCallback' => 1,
                ],
            ],
            $fieldsRegistry->findBySlug('test', 'id')
        );
    }
}
