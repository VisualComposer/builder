<?php

use VisualComposer\Helpers\Nonce;

class VcAccessRolesTest extends WP_UnitTestCase
{
    protected $userId;

    protected $roleKey;

    protected $roleKey2;

    protected $roleKey3;

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

        $time = time();
        $this->userId = wp_create_user('vcwb-roles_temp-' . $time, 'admin', 'vcwb-temp' . $time . '@dev.local');
        $user = wp_set_current_user($this->userId);
        $user->remove_all_caps();
        vcevent('vcv:migration:enabledPostTypesMigration');

        $this->roleKey = 'custom_roles_vcwb_tests_' . time();
        $this->tempKey = 'custom_roles_test' . time() . '_';

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

        $this->roleKey2 = 'custom_roles_vcwb_tests2_' . time();
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
        $this->roleKey3 = 'custom_roles_vcwb_tests3_' . time();
        add_role(
            $this->roleKey3,
            'Custom VCWB-tests_users' . $this->roleKey3,
            [
                'read' => true,
                'level_0' => true,
                'edit_posts' => true,
                'edit_post' => true,
                'edit_pages' => true,
                'edit_page' => true,
            ]
        );

        $user->add_role($this->roleKey);
        $user->add_role($this->roleKey2);
    }

    public function tearDown(): void
    {
        remove_role($this->roleKey);
        remove_role($this->roleKey2);
        remove_role($this->roleKey3);

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

    public function testRoleAccess()
    {
        $this->assertTrue(is_object(vcapp('VisualComposer\Helpers\Access\CurrentUser')));
        $this->assertTrue(is_object(vcapp('VisualComposer\Helpers\Access\Role')));
        $this->assertTrue(is_object(vcapp('AccessRoleHelper')));
        $this->assertEquals(vcapp('VisualComposer\Helpers\Access\Role'), vcapp('AccessRoleHelper'));
        $this->assertEquals(vchelper('AccessRole'), vcapp('AccessRoleHelper'));
    }

    public function testRoleAccessGet()
    {
        $role_access = vcapp('VisualComposer\Helpers\Access\Role');

        // getValidAccess tests:
        $this->assertTrue($role_access->getValidAccess());
        $this->assertTrue(
            $role_access->setValidAccess(true)->getValidAccess()
        );
        $this->assertFalse(
            $role_access->setValidAccess(false)->getValidAccess()
        );

        // ->get() by default resets after used
        $this->assertFalse($role_access->setValidAccess(false)->get());
        // now access should be again true
        $this->assertTrue($role_access->getValidAccess());
        $this->assertTrue($role_access->get());

    }

    public function testRoleAccessValidateDie()
    {
        $role_access = vcapp('VisualComposer\Helpers\Access\Role');
        // validateDie and setValidAccess tests
        try {
            $role_access->setValidAccess(false)->validateDie('test message')->get();
        } catch (Exception $e) {
            $this->assertEquals(
                'test message',
                $e->getMessage(),
                'message should be applied to exception'
            );
            $this->assertTrue(true, 'exception must be triggered');
            $role_access->setValidAccess(true); // reset value
        }

        // in case of true no exception should be triggered
        try {
            $this->assertTrue(
                $role_access->setValidAccess(true)->validateDie()->get()
            );
        } catch (Exception $e) {
            $this->assertTrue(false, 'exception must not to be triggered');
        }
    }

    public function testCheckAdminNonce()
    {
        wp_set_current_user(1);
        $this->assertTrue(vcapp('NonceHelper')->verifyAdmin(vcapp('NonceHelper')->admin()));
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\Role')->checkAdminNonce(vcapp('NonceHelper')->admin())->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\Role')->checkAdminNonce(vcapp('NonceHelper')->admin())->getValidAccess(
            )
        );

        // negative tests
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\Role')->checkAdminNonce('abc')->getValidAccess()
        );
        //reset
        vcapp('VisualComposer\Helpers\Access\Role')->setValidAccess(true);
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\Role')->checkAdminNonce('abc')->get()
        );
    }

    public function testCheckPublicNonce()
    {
        $this->assertTrue(vcapp('NonceHelper')->verifyUser(vcapp('NonceHelper')->user()));
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\Role')->checkPublicNonce(
                vcapp('NonceHelper')->user()
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\Role')->checkPublicNonce(vcapp('NonceHelper')->user())->getValidAccess(
            )
        );

        // negative tests
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\Role')->checkPublicNonce('abc')->getValidAccess()
        );
        //reset
        vcapp('VisualComposer\Helpers\Access\Role')->setValidAccess(true);
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\Role')->checkPublicNonce('abc')->get()
        );
    }

    public function _check($value)
    {
        // used in next test
        return (bool)$value;
    }

    public function testCheckMethod()
    {
        // custom validators:
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\Role')->check(
                [
                    $this,
                    '_check',
                ],
                true
            )->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\Role')->check(
                [
                    $this,
                    '_check',
                ],
                false
            )->get()
        );

        // checkAny
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\Role')->checkAny(
                [
                    [
                        $this,
                        '_check',
                    ],
                    true,
                ]
            )->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\Role')->checkAny(
                [
                    [
                        $this,
                        '_check',
                    ],
                    false,
                ]
            )->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\Role')->checkAny(
                [
                    [
                        $this,
                        '_check',
                    ],
                    false,
                ],
                [
                    [
                        $this,
                        '_check',
                    ],
                    true,
                ]
            )->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\Role')->checkAny(
                [
                    [
                        $this,
                        '_check',
                    ],
                    true,
                ],
                [
                    [
                        $this,
                        '_check',
                    ],
                    false,
                ]
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\Role')->checkAny(
                [
                    [
                        $this,
                        '_check',
                    ],
                    true,
                ],
                [
                    [
                        $this,
                        '_check',
                    ],
                    true,
                ]
            )->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\Role')->checkAny(
                [
                    [
                        $this,
                        '_check',
                    ],
                    false,
                ],
                [
                    [
                        $this,
                        '_check',
                    ],
                    false,
                ]
            )->get()
        );

        //checkAll
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\Role')->checkAll(
                [
                    [
                        $this,
                        '_check',
                    ],
                    false,
                ]
            )->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\Role')->checkAll(
                [
                    [
                        $this,
                        '_check',
                    ],
                    true,
                ],
                [
                    [
                        $this,
                        '_check',
                    ],
                    false,
                ]
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\Role')->checkAll(
                [
                    [
                        $this,
                        '_check',
                    ],
                    false,
                ],
                [
                    [
                        $this,
                        '_check',
                    ],
                    false,
                ]
            )->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\Role')->checkAll(
                [
                    [
                        $this,
                        '_check',
                    ],
                    false,
                ],
                [
                    [
                        $this,
                        '_check',
                    ],
                    true,
                ]
            )->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\Role')->checkAll(
                [
                    [
                        $this,
                        '_check',
                    ],
                    true,
                ]
            )->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\Role')->checkAll(
                [
                    [
                        $this,
                        '_check',
                    ],
                    true,
                ],
                [
                    [
                        $this,
                        '_check',
                    ],
                    true,
                ]
            )->get()
        );
    }

    public function testCurrentRoleAccess()
    {
        $this->assertEquals(
            'administrator',
            vcapp('VisualComposer\Helpers\Access\Role')->who('administrator')->getRole()->name
        );
        $this->assertEquals(
            'administrator',
            vcapp('VisualComposer\Helpers\Access\Role')->who('administrator')->getRoleName()
        );
        $this->assertEquals(
            'administrator',
            vcapp('VisualComposer\Helpers\Access\Role')->who('administrator')->part('any')->getRole()->name
        );
        $this->assertEquals(
            'administrator',
            vcapp('VisualComposer\Helpers\Access\Role')->who('administrator')->part('any')->getRoleName()
        );
    }

    public function testStates()
    {
        wp_set_current_user(null);
        $roleHelper = vcapp('VisualComposer\Helpers\Access\Role');
        $roleHelper->who('administrator');
        $this->assertTrue(
            $roleHelper->part('testStates_something_role')->getState()
        );
        $this->assertTrue(
            $roleHelper->part('testStates_frontend_editor')->getState()
        );
        $this->assertTrue(
            $roleHelper->part('testStates_shortcodes')->getState()
        );

        // check can (administrator always CAN)
        $this->assertTrue(
            $roleHelper->part('testStates_frontend_editor')->can()->get()
        );
        $this->assertTrue(
            $roleHelper->part('testStates_shortcodes')->can()->get()
        );

        // check nonce falses
        $this->assertFalse(
            $roleHelper->checkAdminNonce()// no nonce exists
            ->part('shortcodes')->can()->get()
        );
        $this->assertFalse(
            $roleHelper->checkPublicNonce()// no nonce exists
            ->part('shortcodes')->can()->get()
        );
        $this->assertFalse(
            $roleHelper->checkAdminNonce()// no nonce exists
            ->checkPublicNonce()// no nonce exists
            ->part('shortcodes')->can()->get()
        );

        $this->assertTrue($roleHelper->getValidAccess());
    }

    public function testPartCheckState()
    {
        $roleHelper = vcapp('VisualComposer\Helpers\Access\Role');
        $roleHelper->who('administrator');
        $this->assertFalse(
            $roleHelper->part('something_role')->checkState(null)->get()
        );

        $this->assertTrue(
            $roleHelper->part('something_role')->checkState(true)->get()
        );

        $this->assertTrue(
            $roleHelper->part('something_role')->checkStateAny(
                true,
                null
            )->get()
        );
        $this->assertFalse(
            $roleHelper->part('something_role')->checkStateAny(
                null,
            )->get()
        );
    }

    public function testPartCapabilities()
    {
        // un existed
        $roleHelper = vcapp('VisualComposer\Helpers\Access\Role');
        $roleHelper->who('administrator');
        $this->assertTrue(
            $roleHelper->part('testPartCapabilities_something_role')->can()->get()
        );

        $this->assertTrue(
            $roleHelper->part('testPartCapabilities_something_role')->can('something_role')->get()
        );

        $roleHelper->part('testPartCapabilities_something_role')->setState(false);

        // For admins it always true anyway
        $this->assertTrue(
            $roleHelper->part('testPartCapabilities_something_role')->can()->get()
        );

        $this->assertTrue(
            $roleHelper->part('testPartCapabilities_something_role')->can('something_role')->get()
        );
    }

    public function testCustomRolePartCapabilities()
    {
        // un existed
        $roleHelper = vcapp('VisualComposer\Helpers\Access\Role');
        $roleHelper->who($this->roleKey);
        $this->assertFalse(
            $roleHelper->part('testCustomRolePartCapabilities_something_role')->can()->get()
        );

        $this->assertFalse(
            $roleHelper->part('testCustomRolePartCapabilities_something_role')->can('something_role')->get()
        );

        $roleHelper->part('testCustomRolePartCapabilities_something_role')->setState(false);

        $this->assertFalse(
            $roleHelper->part('testCustomRolePartCapabilities_something_role')->can()->get()
        );

        $this->assertFalse(
            $roleHelper->part('testCustomRolePartCapabilities_something_role')->can('something_role')->get()
        );

        $roleHelper->part('testCustomRolePartCapabilities_something_role')->setState(true);

        $this->assertTrue(
            $roleHelper->part('testCustomRolePartCapabilities_something_role')->can()->get()
        );

        $this->assertTrue(
            $roleHelper->part('testCustomRolePartCapabilities_something_role')->can('something_role')->get()
        );

        $roleHelper->part('testCustomRolePartCapabilities_something_role_no_state')->setCapRule('custom_cap', true);

        $this->assertTrue(
            $roleHelper->part('testCustomRolePartCapabilities_something_role_no_state')->can('custom_cap')->get()
        );

        $this->assertTrue(
            $roleHelper->part('testCustomRolePartCapabilities_something_role_no_state')->can('custom_cap')->get()
        );
        $this->assertFalse(
            $roleHelper->part('testCustomRolePartCapabilities_something_role_no_state')->can(
                'custom_cap_not-exists'
            )->get()
        );
    }

    public function testPartCapabilitiesForEmptyCanCananyCanall()
    {
        // un existed
        $roleHelper = vcapp('VisualComposer\Helpers\Access\Role');
        $roleHelper->who($this->roleKey2);
        $this->assertFalse(
            $roleHelper->part('something_role')->can()->get()
        );
        $this->assertFalse(
            $roleHelper->part('something_role')->can(
                'something_role'
            )->get()
        );

        $this->assertFalse(
            $roleHelper->part('something_role')->canAny(
                'something_role'
            )->get()
        );
        $this->assertFalse(
            $roleHelper->part('something_role')->canAny(
                'something_role',
                'something_role2'
            )->get()
        );

        $this->assertFalse(
            $roleHelper->part('something_role')->canAll(
                'something_role'
            )->get()
        );
        $this->assertFalse(
            $roleHelper->part('something_role')->canAll(
                'something_role',
                'something_role2'
            )->get()
        );

        // for state=null any cap is true
        $roleHelper->part('something_role')->setCapRule(
            'something_role',
            true
        );
        $this->assertTrue(
            $roleHelper->part('something_role')->can(
                'something_role'
            )->get()
        );
        $this->assertTrue(
            $roleHelper->part('something_role')->canAny(
                'something_role'
            )->get()
        );
        $this->assertTrue(
            $roleHelper->part('something_role')->canAll(
                'something_role'
            )->get()
        );

        // for state=null any cap is true
        $roleHelper->part('something_role')->setCapRule(
            'something_role',
            false
        );
        $this->assertFalse(
            $roleHelper->part('something_role')->can(
                'something_role'
            )->get()
        );
        $this->assertFalse(
            $roleHelper->part('something_role')->canAny(
                'something_role'
            )->get()
        );
        $this->assertFalse(
            $roleHelper->part('something_role')->canAll(
                'something_role'
            )->get()
        );
    }

    public function testPartCapabilitiesForDisabledCanCananyCanall()
    {
        $roleHelper = vcapp('VisualComposer\Helpers\Access\Role');
        $roleHelper->who($this->roleKey2);
        $roleHelper->part('testPartCapabilitiesForDisabledCanCananyCanall')->setState(false);
        // always false..
        $this->assertFalse(
            $roleHelper->part('testPartCapabilitiesForDisabledCanCananyCanall')->can()->get()
        );
        $this->assertFalse(
            $roleHelper->part('testPartCapabilitiesForDisabledCanCananyCanall')->can(
                'something_role'
            )->get()
        );

        $this->assertFalse(
            $roleHelper->part('testPartCapabilitiesForDisabledCanCananyCanall')->canAny(
                'something_role'
            )->get()
        );
        $this->assertFalse(
            $roleHelper->part('testPartCapabilitiesForDisabledCanCananyCanall')->canAny(
                'something_role',
                'something_role2'
            )->get()
        );

        $this->assertFalse(
            $roleHelper->part('testPartCapabilitiesForDisabledCanCananyCanall')->canAll(
                'something_role'
            )->get()
        );
        $this->assertFalse(
            $roleHelper->part('testPartCapabilitiesForDisabledCanCananyCanall')->canAll(
                'something_role',
                'something_role2'
            )->get()
        );

        // what if I try to add capability to false state? It must be false anyway!- cannot set capability for false state
        $roleHelper->part('testPartCapabilitiesForDisabledCanCananyCanall')->setCapRule(
            'something_role',
            true
        );
        $this->assertFalse(
            $roleHelper->part('testPartCapabilitiesForDisabledCanCananyCanall')->can(
                'something_role'
            )->get()
        );
        $this->assertFalse(
            $roleHelper->part('testPartCapabilitiesForDisabledCanCananyCanall')->canAny(
                'something_role'
            )->get()
        );
        $this->assertFalse(
            $roleHelper->part('testPartCapabilitiesForDisabledCanCananyCanall')->canAll(
                'something_role'
            )->get()
        );

        $roleHelper->part('testPartCapabilitiesForDisabledCanCananyCanall')->setCapRule(
            'something_role',
            false
        );
        $this->assertFalse(
            $roleHelper->part('testPartCapabilitiesForDisabledCanCananyCanall')->can(
                'something_role'
            )->get()
        );
        $this->assertFalse(
            $roleHelper->part('testPartCapabilitiesForDisabledCanCananyCanall')->canAny(
                'something_role'
            )->get()
        );
        $this->assertFalse(
            $roleHelper->part('testPartCapabilitiesForDisabledCanCananyCanall')->canAll(
                'something_role'
            )->get()
        );
    }

    public function testPartCapabilitiesForCustomCanCananyCanall()
    {
        $roleHelper = vcapp('VisualComposer\Helpers\Access\Role');
        $roleHelper->who($this->roleKey);

        $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->setState(true);

        $this->assertTrue(
            $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->can()->get()
        );
        $this->assertTrue(
            $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->can(
                'something_role'
            )->get()
        );

        $this->assertTrue(
            $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->canAny(
                'something_role'
            )->get()
        );
        $this->assertTrue(
            $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->canAny(
                'something_role',
                'something_role2'
            )->get()
        );

        $this->assertTrue(
            $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->canAll(
                'something_role'
            )->get()
        );
        $this->assertTrue(
            $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->canAll(
                'something_role',
                'something_role2'
            )->get()
        );

        $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->setState(null);
        // what if I try to add capability to false state? It must be false anyway!- cannot set capability for false state
        $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->setCapRule(
            'something_role',
            true
        );
        $this->assertTrue(
            $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->can(
                'something_role'
            )->get()
        );

        $this->assertTrue(
            $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->canAny(
                'something_role'
            )->get()
        );
        $this->assertTrue(
            $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->canAny(
                'something_role',
                'something_role2'
            )->get()
        );

        $this->assertTrue(
            $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->canAll(
                'something_role'
            )->get()
        );
        $this->assertFalse(
            $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->canAll(
                'something_role',
                'something_role2'
            )->get()
        );

        // For false
        $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->setCapRule(
            'something_role',
            false
        );
        $this->assertFalse(
            $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->can(
                'something_role'
            )->get()
        );

        $this->assertFalse(
            $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->canAny(
                'something_role'
            )->get()
        );
        $this->assertFalse(
            $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->canAny(
                'something_role',
                'something_role2'
            )->get()
        );

        $this->assertFalse(
            $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->canAll(
                'something_role'
            )->get()
        );
        $this->assertFalse(
            $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->canAll(
                'something_role2'
            )->get()
        );
        $this->assertFalse(
            $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->canAll(
                'something_role',
                'something_role2'
            )->get()
        );

        // For multiple
        $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->setCapRule(
            'something_role',
            true
        );
        $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->setCapRule(
            'something_role2',
            true
        );
        $this->assertTrue(
            $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->can(
                'something_role'
            )->get()
        );
        $this->assertTrue(
            $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->can(
                'something_role2'
            )->get()
        );

        $this->assertTrue(
            $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->canAny(
                'something_role'
            )->get()
        );
        $this->assertTrue(
            $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->canAny(
                'something_role2'
            )->get()
        );
        $this->assertTrue(
            $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->canAny(
                'something_role',
                'something_role2'
            )->get()
        );

        $this->assertTrue(
            $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->canAll(
                'something_role'
            )->get()
        );
        $this->assertTrue(
            $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->canAll(
                'something_role2'
            )->get()
        );
        $this->assertTrue(
            $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->canAll(
                'something_role',
                'something_role2'
            )->get()
        );

        // For multiple false
        $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->setCapRule(
            'something_role',
            false
        );
        $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->setCapRule(
            'something_role2',
            true
        );
        $this->assertFalse(
            $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->can(
                'something_role'
            )->get()
        );
        $this->assertTrue(
            $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->can(
                'something_role2'
            )->get()
        );

        $this->assertFalse(
            $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->canAny(
                'something_role'
            )->get()
        );
        $this->assertTrue(
            $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->canAny(
                'something_role2'
            )->get()
        );
        $this->assertTrue(
            $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->canAny(
                'something_role',
                'something_role2'
            )->get()
        );

        $this->assertFalse(
            $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->canAll(
                'something_role'
            )->get()
        );
        $this->assertTrue(
            $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->canAll(
                'something_role2'
            )->get()
        );
        $this->assertFalse(
            $roleHelper->part('testPartCapabilitiesForCustomCanCananyCanall')->canAll(
                'something_role',
                'something_role2'
            )->get()
        );
    }

    public function testPartValidation()
    {
        $roleHelper = vcapp('VisualComposer\Helpers\Access\Role');
        $roleHelper->who('administrator');
        $this->assertFalse(
            $roleHelper->setValidAccess(false)->part('something_role')->get()
        );
        $roleHelper->who($this->roleKey3);

        $roleHelper->part('testPartValidation')->setCapRule('something_role', true);
        $roleHelper->part('testPartValidation')->setCapRule('something_role2', true);
        wp_set_current_user($this->userId);
        wp_get_current_user()->add_role($this->roleKey3);
        $this->assertTrue(
            $roleHelper->checkAdminNonce(vcapp('NonceHelper')->admin())->get()
        );

        $this->assertTrue(
            $roleHelper->checkAdminNonce(vcapp('NonceHelper')->admin())
                ->checkPublicNonce(
                    vcapp('NonceHelper')->user()
                )->check(
                    [
                        $this,
                        '_check',
                    ],
                    true
                )->part('testPartValidation')->canAny('something_role')// in null it is always true
                ->canAny(
                    'something_role',
                    'something_role2'
                )// in null it is always true
                ->canAll(
                    'something_role'
                )// in null it is always true
                ->canAll(
                    'something_role',
                    'something_role2'
                )// in null it is always true
                ->checkState(null)->checkStateAny(true, null)->get()
        );
    }
}
