<?php

class VcAccessRolesUsersTest extends WP_UnitTestCase
{
    protected $userId;

    protected $roleKey;

    protected $roleKey2;

    protected $tempKey;

    public function setUp(): void
    {
        parent::setUp();
        foreach (get_editable_roles() as $roleKey => $roleData) {
            foreach ($roleData['capabilities'] as $capabilityKey => $capabilityValue) {
                if (strpos($capabilityKey, 'vcv_') !== false) {
                    get_role($roleKey)->remove_cap($capabilityKey);
                }
            }
        }
        $user = wp_set_current_user(1);
        $user->remove_all_caps();
        $user->set_role('administrator');
        vcevent('vcv:migration:enabledPostTypesMigration');

        $time = time();
        $this->userId = wp_create_user('vcwb-temp-' . $time, 'admin', 'vcwb-temp' . $time . '@dev.local');
        $user = wp_set_current_user($this->userId);
        $user->remove_all_caps();

        $this->roleKey = 'custom_vcwb_tests_' . time();
        $this->tempKey = 'custom_test' . time() . '_';

        add_role(
            $this->roleKey,
            'Custom VCWB-tests_users' . $this->roleKey,
            [
                'read' => true,
                'level_0' => true,

                // Custom checks
                $this->tempKey . 'custom_test_1' => true,
                $this->tempKey . 'custom_test_2' => true,
            ]
        );

        $this->roleKey2 = 'custom_vcwb_tests2_' . time();
        add_role(
            $this->roleKey2,
            'Custom VCWB-tests_users' . $this->roleKey2,
            [
                'read' => true,
                'level_0' => true,

                // Custom checks
                $this->tempKey . 'custom_test_2' => false,
                $this->tempKey . 'custom_test_3' => false,
                $this->tempKey . 'custom_test_4' => true,
            ]
        );

        $user->add_role($this->roleKey);
        $user->add_role($this->roleKey2);
    }

    public function tearDown(): void
    {
        remove_role($this->roleKey);
        remove_role($this->roleKey2);

        foreach (get_editable_roles() as $roleKey => $roleData) {
            foreach ($roleData['capabilities'] as $capabilityKey => $capabilityValue) {
                if (strpos($capabilityKey, 'vcv_') !== false) {
                    get_role($roleKey)->remove_cap($capabilityKey);
                }
            }
        }
        $user = wp_set_current_user(1);
        $user->remove_all_caps();
        $user->set_role('administrator');
        vcevent('vcv:migration:enabledPostTypesMigration');

        parent::tearDown();
    }

    public function testPartCapabilities()
    {
        wp_set_current_user($this->userId);
        $allCaps = wp_get_current_user()->get_role_caps();

        // Comes from first role
        $this->assertTrue(current_user_can($this->tempKey . 'custom_test_1'));
        // Second role overrides previous one
        $this->assertFalse(current_user_can($this->tempKey . 'custom_test_2'));
        $this->assertFalse(current_user_can($this->tempKey . 'custom_test_3'));
        $this->assertTrue(current_user_can($this->tempKey . 'custom_test_4'));

        // Not exists
        $this->assertFalse(current_user_can($this->tempKey . 'custom_test_5'));

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something_role_users')->can()->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something_role_users')->can()->get()
        );

        // false state = enabled
        vcapp('VisualComposer\Helpers\Access\Role')->who($this->roleKey)->part('something_role_users')->setState(
            true
        );
        // false also for users ( because role contains users )
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something_role_users')->can()->get()
        );

        // force state = disabled
        vcapp('VisualComposer\Helpers\Access\Role')->who($this->roleKey)->part('something_role_users')->setState(
            false
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something_role_users')->can()->get()
        );
    }

    public function testPartCapabilitiesForEmptyCanCananyCanall()
    {
        wp_set_current_user($this->userId);

        // for state=null any cap checks will be just cap checks
        vcapp('VisualComposer\Helpers\Access\Role')->who($this->roleKey)->part('something_role_users')->setCapRule(
            'something_role_users',
            true
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something_role_users')->can(
                'something_role_users'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something_role_users')->canAny(
                'something_role_users'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something_role_users')->canAny(
                'something_role_users',
                'something_role_users2'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something_role_users')->canAll(
                'something_role_users'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something_role_users')->canAll(
                'something_role_users',
                'something_role_users2'
            )->get()
        );

        vcapp('VisualComposer\Helpers\Access\Role')->who($this->roleKey)->part('something_role_users')->setCapRule(
            'something_role_users',
            false
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something_role_users')->can(
                'something_role_users'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something_role_users')->canAny(
                'something_role_users'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something_role_users')->canAny(
                'something_role_users',
                'something_role_users2'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something_role_users')->canAll(
                'something_role_users'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something_role_users')->canAll(
                'something_role_users',
                'something_role_users2'
            )->get()
        );
    }

    public function testPartCapabilitiesForDisabledCanCananyCanall()
    {
        wp_set_current_user($this->userId);

        vcapp('VisualComposer\Helpers\Access\Role')->who($this->roleKey)->part('something_role_users')->setState(
            false
        );
        // always false..
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something_role_users')->can()->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something_role_users')->can(
                'something_role_users'
            )->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something_role_users')->canAny(
                'something_role_users'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something_role_users')->canAny(
                'something_role_users',
                'something_role_users2'
            )->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something_role_users')->canAll(
                'something_role_users'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something_role_users')->canAll(
                'something_role_users',
                'something_role_users2'
            )->get()
        );

        // what if I try to add capability to false state? It must be false anyway!- cannot set capability for false state
        vcapp('VisualComposer\Helpers\Access\Role')->who($this->roleKey)->part('something_role_users')->setCapRule(
            'something_role_users',
            true
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something_role_users')->can(
                'something_role_users'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something_role_users')->canAny(
                'something_role_users'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something_role_users')->canAny(
                'something_role_users',
                'something_role_users2'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something_role_users')->canAll(
                'something_role_users'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something_role_users')->canAll(
                'something_role_users',
                'something_role_users2'
            )->get()
        );
    }

    public function testSetStateTrue()
    {
        wp_set_current_user($this->userId);
        $this->assertEquals(
            null,
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testSetStateTrue')->getState()
        );
        vcapp('VisualComposer\Helpers\Access\Role')->who($this->roleKey)->part('testSetStateTrue')->setState(
            true
        );

        $this->assertEquals(
            true,
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testSetStateTrue')->getState()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testSetStateTrue')->can()->get()
        );
    }

    public function testSetStateFalse()
    {
        wp_set_current_user($this->userId);
        $this->assertEquals(
            null,
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testSetStateFalse')->getState()
        );
        vcapp('VisualComposer\Helpers\Access\Role')->who($this->roleKey)->part('testSetStateFalse')->setState(
            false
        );

        $this->assertEquals(
            false,
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testSetStateFalse')->getState()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testSetStateFalse')->can()->get()
        );
    }

    public function testPartCapabilitiesForCustomCanCananyCanallNull()
    {
        vcapp('VisualComposer\Helpers\Access\Role')->who($this->roleKey)->part(
            'testPartCapabilitiesForCustomCanCananyCanallNull'
        )->setState(
            true
        );
        wp_set_current_user(null);
        $this->assertEquals(
            null,
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanallNull'
            )->getState()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanallNull',
            )->can()->get()
        );
        wp_set_current_user($this->userId); // this will reset user capabilities and get latests from user role

        /// State is true so it will just check state
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanallNull'
            )->can(
                'some_rule'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanallNull'
            )->can(
                'some_rule',
                false
            )->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanallNull'
            )->canAny(
                'some_rule'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanallNull'
            )->canAny(
                'some_rule',
                'some_other_rule'
            )->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanallNull'
            )->canAll(
                'some_rule'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanallNull'
            )->canAll(
                'some_rule',
                'some_other_rule'
            )->get()
        );
    }

    public function testCustomStateRoleRule()
    {
        vcapp('VisualComposer\Helpers\Access\Role')->who($this->roleKey2)->part('testCustomStateRoleRule')->setCapRule(
            'custom_inner_cap',
            true
        );

        wp_set_current_user($this->userId); // this will reset user capabilities and get latests from user role

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testCustomStateRoleRule')->can(
                'custom_inner_cap'
            )->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testCustomStateRoleRule')->canAny(
                'custom_inner_cap'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testCustomStateRoleRule')->canAny(
                'custom_inner_cap',
                'something_role_users2'
            )->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testCustomStateRoleRule')->canAll(
                'custom_inner_cap'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testCustomStateRoleRule')->canAll(
                'custom_inner_cap',
                'something_role_users2'
            )->get()
        );

        // For false
        vcapp('VisualComposer\Helpers\Access\Role')->who($this->roleKey)->part('testCustomStateRoleRule')
            ->setCapRule('custom_inner_cap2', false);

        wp_set_current_user($this->userId); // this will reset user capabilities and get latests from user role
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testCustomStateRoleRule')->can(
                'custom_inner_cap2'
            )->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something_role_users')->canAny(
                'custom_inner_cap2'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something_role_users')->canAny(
                'something_role_users',
                'custom_inner_cap2'
            )->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something_role_users')->canAll(
                'custom_inner_cap2'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something_role_users')->canAll(
                'something_role_users',
                'custom_inner_cap2'
            )->get()
        );
    }

    public function testMultipleRolesParts()
    {
        // For multiple
        vcapp('VisualComposer\Helpers\Access\Role')->who($this->roleKey)->part('testMultipleRolesParts')
            ->setCapRule('custom_3', true);
        vcapp('VisualComposer\Helpers\Access\Role')->who($this->roleKey2)->part('testMultipleRolesParts')
            ->setCapRule('custom_4', true);

        wp_set_current_user($this->userId); // this will reset user capabilities and get latests from user role
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testMultipleRolesParts')->can(
                'custom_3'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testMultipleRolesParts')->can(
                'custom_4'
            )->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testMultipleRolesParts')->canAny(
                'custom_3'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testMultipleRolesParts')->canAny(
                'custom_4'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testMultipleRolesParts')->canAny(
                'custom_3',
                'custom_4'
            )->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testMultipleRolesParts')->canAll(
                'custom_3'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testMultipleRolesParts')->canAll(
                'custom_4'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testMultipleRolesParts')->canAll(
                'custom_3',
                'custom_4'
            )->get()
        );
    }

    public function testMultipleRolesFalse()
    {
        // For multiple false
        vcapp('VisualComposer\Helpers\Access\Role')->who($this->roleKey)->part('testMultipleRolesFalse')
            ->setCapRule('testMultipleRolesFalse_1', false);
        vcapp('VisualComposer\Helpers\Access\Role')->who($this->roleKey2)->part('testMultipleRolesFalse')
            ->setCapRule('testMultipleRolesFalse_2', true);

        wp_set_current_user($this->userId); // this will reset user capabilities and get latests from user role
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testMultipleRolesFalse')->can(
                'testMultipleRolesFalse_1'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testMultipleRolesFalse')->can(
                'testMultipleRolesFalse_2'
            )->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testMultipleRolesFalse')->canAny(
                'testMultipleRolesFalse_1'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testMultipleRolesFalse')->canAny(
                'testMultipleRolesFalse_2'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testMultipleRolesFalse')->canAny(
                'testMultipleRolesFalse_1',
                'testMultipleRolesFalse_2'
            )->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testMultipleRolesFalse')->canAll(
                'testMultipleRolesFalse_1'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testMultipleRolesFalse')->canAll(
                'testMultipleRolesFalse_2'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something_role_users')->canAll(
                'testMultipleRolesFalse_1',
                'testMultipleRolesFalse_2'
            )->get()
        );
    }
}
