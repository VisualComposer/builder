<?php

class VcAccessUsersTest extends WP_UnitTestCase
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
        vcevent('vcv:migration:enabledPostTypesMigration');


        $time = time();
        $this->userId = wp_create_user('vcwb-userroles_temp-' . $time, 'admin', 'vcwb-temp' . $time . '@dev.local');
        $user = wp_set_current_user($this->userId);
        $user->remove_all_caps();

        $this->roleKey = 'custom_userroles_vcwb_tests_' . time();
        $this->tempKey = 'custom_userroles_test' . time() . '_';

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

        $this->roleKey2 = 'custom_userroles_vcwb_tests2_' . time();
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
        $this->roleKey3 = 'custom_userroles_vcwb_tests3_' . time();
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
        $user->add_role($this->roleKey3);

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

    public function testUserAccessValidateDie()
    {
        $this->assertEquals(
            'administrator',
            vcapp('VisualComposer\Helpers\Access\Role')->who('administrator')->getRoleName(),
        );
        $currentUserAccessHelper = vcapp('VisualComposer\Helpers\Access\CurrentUser');
        // validateDie and setValidAccess tests
        try {
            $currentUserAccessHelper->setValidAccess(false)->validateDie('test message')->get();
        } catch (Exception $e) {
            $this->assertEquals(
                'test message',
                $e->getMessage(),
                'message should be applied to exception'
            );
            $this->assertTrue(true, 'exception must be triggered');
            $currentUserAccessHelper->setValidAccess(true); // reset value
        }

        // in case of true no exception should be triggered
        try {
            $this->assertTrue(
                $currentUserAccessHelper->setValidAccess(true)->validateDie()->get()
            );
        } catch (Exception $e) {
            $this->assertTrue(false, 'exception must not to be triggered');
        }
    }

    public function testUserAccessGet()
    {
        $currentUserAccessHelper = vcapp('VisualComposer\Helpers\Access\CurrentUser');

        // getValidAccess tests:
        $this->assertTrue($currentUserAccessHelper->getValidAccess());
        $this->assertTrue(
            $currentUserAccessHelper->setValidAccess(true)->getValidAccess()
        );
        $this->assertFalse(
            $currentUserAccessHelper->setValidAccess(false)->getValidAccess()
        );

        // ->get() by defautls resets
        $this->assertFalse($currentUserAccessHelper->setValidAccess(false)->get());
        // now access should be true
        $this->assertTrue($currentUserAccessHelper->getValidAccess());
        $this->assertTrue($currentUserAccessHelper->get());
    }

    public function testCheckAdminNonce()
    {
        wp_set_current_user($this->userId);
        $this->assertTrue(vcapp('NonceHelper')->verifyAdmin(vcapp('NonceHelper')->admin()));
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->checkAdminNonce(
                vcapp('NonceHelper')->admin()
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->checkAdminNonce(
                vcapp('NonceHelper')->admin()
            )->getValidAccess()
        );

        // negative tests
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->checkAdminNonce('abc')->getValidAccess()
        );
        //reset
        vcapp('VisualComposer\Helpers\Access\CurrentUser')->setValidAccess(true);
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->checkAdminNonce('abc')->get()
        );
    }

    public function testCheckPublicNonce()
    {
        wp_set_current_user(null);
        $this->assertTrue(vcapp('NonceHelper')->verifyUser(vcapp('NonceHelper')->user()));
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->checkPublicNonce(
                vcapp('NonceHelper')->user()
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->checkPublicNonce(
                vcapp('NonceHelper')->user()
            )->getValidAccess()
        );

        // negative tests
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->checkPublicNonce('abc')->getValidAccess()
        );
        //reset
        vcapp('VisualComposer\Helpers\Access\CurrentUser')->setValidAccess(true);
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->checkPublicNonce('abc')->get()
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
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->check(
                [
                    $this,
                    '_check',
                ],
                true
            )->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->check(
                [
                    $this,
                    '_check',
                ],
                false
            )->get()
        );

        // checkAny
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->checkAny(
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
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->checkAny(
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
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->checkAny(
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
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->checkAny(
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
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->checkAny(
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
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->checkAny(
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
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->checkAll(
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
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->checkAll(
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
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->checkAll(
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
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->checkAll(
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
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->checkAll(
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
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->checkAll(
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

    public function testCurrentUserAccess()
    {
        wp_set_current_user($this->userId);
        $user_access = vcapp('VisualComposer\Helpers\Access\CurrentUser');
        $this->assertTrue($user_access->wpAny('edit_posts')->get());
        $this->assertTrue($user_access->wpAny('edit_pages')->get());
        $this->assertFalse(
            $user_access->wpAny('non_exists_cap')->get()
        );

        $this->assertTrue(
            $user_access->wpAll('edit_posts', 'edit_pages')->get()
        );

        $this->assertTrue(
            $user_access->wpAny('edit_posts', 'edit_pages')->get()
        );

        $this->assertTrue(
            $user_access->wpAny(
                'edit_posts',
                'edit_pages',
                'non_exists_cap'
            )->get()
        );

        $this->assertFalse(
            $user_access->wpAll(
                'edit_posts',
                'edit_pages',
                'non_exists_cap'
            )->get()
        );
    }

    public function testStates()
    {
        wp_set_current_user($this->userId);
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something')->can()->get()
        );
        $this->assertNull(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something')->getState()
        );

        $this->assertNull(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('frontend_editor')->getState()
        );
        $this->assertNull(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('shortcodes')->getState()
        );

        // check can
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('frontend_editor')->can()->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('shortcodes')->can()->get()
        );

        // check nonce falses
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->checkAdminNonce()// no nonce exists
            ->part('shortcodes')->can()->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->checkPublicNonce()// no nonce exists
            ->part('shortcodes')->can()->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->checkAdminNonce()// no nonce exists
            ->checkPublicNonce()// no nonce exists
            ->part('shortcodes')->can()->get()
        );

        $this->assertTrue(vcapp('VisualComposer\Helpers\Access\CurrentUser')->getValidAccess());
        $this->assertTrue(vcapp('VisualComposer\Helpers\Access\CurrentUser')->get());
        $this->assertTrue(vcapp('VisualComposer\Helpers\Access\CurrentUser')->get());
        $this->assertTrue(vcapp('VisualComposer\Helpers\Access\CurrentUser')->get());
    }

    public function testWpAnyAll()
    {
        wp_set_current_user($this->userId);

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->wpAny('edit_posts')->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->wpAny('non_exists')->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->wpAll('edit_posts')->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->wpAll('non_exists')->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->wpAny(
                'edit_posts',
                'edit_pages'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->wpAny(
                'edit_posts',
                'edit_pages',
                'non_exists'
            )->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->wpAll(
                'edit_posts',
                'edit_pages'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->wpAll(
                'edit_posts',
                'edit_pages',
                'non_exists'
            )->get()
        );
    }

    public function testWpAnyAllInParts()
    {
        wp_set_current_user($this->userId);

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->wpAny('edit_posts')->part(
                'testWpAnyAllInParts'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->wpAny('non_exists')->part(
                'testWpAnyAllInParts'
            )->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->wpAll('edit_posts')->part(
                'testWpAnyAllInParts'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->wpAll('non_exists')->part(
                'testWpAnyAllInParts'
            )->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->wpAny(
                'edit_posts',
                'edit_pages'
            )->part(
                'testWpAnyAllInParts'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->wpAny(
                'edit_posts',
                'edit_pages',
                'non_exists'
            )->part('testWpAnyAllInParts')->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->wpAll(
                'edit_posts',
                'edit_pages'
            )->part(
                'testWpAnyAllInParts'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->wpAll(
                'edit_posts',
                'edit_pages',
                'non_exists'
            )->part('testWpAnyAllInParts')->get()
        );
    }

    public function testPartCheckState()
    {
        wp_set_current_user($this->userId);

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something')->checkState(
                null
            )->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something')->checkState(
                true
            )->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something')->checkStateAny(
                true,
                null
            )->get()
        );
    }

    public function testPartCapabilities()
    {
        wp_set_current_user($this->userId);

        // un existed
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testPartCapabilities')->can()->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testPartCapabilities')->can(
                'something'
            )->get()
        );

        vchelper('AccessRole')->who($this->roleKey)->part('testPartCapabilities')->setState(false);
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testPartCapabilities')->can()->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testPartCapabilities')->can(
                'something'
            )->get()
        );

        vchelper('AccessRole')->who($this->roleKey)->part('testPartCapabilities')->setState(
            true
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testPartCapabilities')->can()->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testPartCapabilities')->can(
                'something'
            )->get()
        );

        vchelper('AccessRole')->who($this->roleKey)->part('testPartCapabilities')->setState(
            null
        );
        vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testPartCapabilities')->setCapRule(
            'something',
            true
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testPartCapabilities')->can()->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('testPartCapabilities')->can(
                'something'
            )->get()
        );
    }

    public function testPartCapabilitiesForEmptyCanCananyCanall()
    {
        wp_set_current_user($this->userId);

        // un existed
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something')->can()->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something')->can(
                'something'
            )->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something')->canAny(
                'something'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something')->canAny(
                'something',
                'something2'
            )->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something')->canAll(
                'something'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something')->canAll(
                'something',
                'something2'
            )->get()
        );

        // for state=null any cap is true
        vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something')->setCapRule(
            'something',
            true
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something')->can(
                'something'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something')->canAny(
                'something'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something')->canAll(
                'something'
            )->get()
        );

        // for state=null any cap is true
        vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something')->setCapRule(
            'something',
            false
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something')->can(
                'something'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something')->canAny(
                'something'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('something')->canAll(
                'something'
            )->get()
        );
    }

    public function testPartCapabilitiesForDisabledCanCananyCanall()
    {
        wp_set_current_user($this->userId);

        vchelper('AccessRole')->who($this->roleKey)->part(
            'testPartCapabilitiesForDisabledCanCananyCanall'
        )->setState(false);
        // always false..
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForDisabledCanCananyCanall'
            )->can()->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForDisabledCanCananyCanall'
            )->can(
                'something'
            )->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForDisabledCanCananyCanall'
            )->canAny(
                'something'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForDisabledCanCananyCanall'
            )->canAny(
                'something',
                'something2'
            )->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForDisabledCanCananyCanall'
            )->canAll(
                'something'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForDisabledCanCananyCanall'
            )->canAll(
                'something',
                'something2'
            )->get()
        );

        // what if I try to add capability to false state? It must be false anyway!- cannot set capability for false state
        vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
            'testPartCapabilitiesForDisabledCanCananyCanall'
        )->setCapRule(
            'something',
            true
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForDisabledCanCananyCanall'
            )->can(
                'something'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForDisabledCanCananyCanall'
            )->canAny(
                'something'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForDisabledCanCananyCanall'
            )->canAll(
                'something'
            )->get()
        );

        vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
            'testPartCapabilitiesForDisabledCanCananyCanall'
        )->setCapRule(
            'something',
            false
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForDisabledCanCananyCanall'
            )->can(
                'something'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForDisabledCanCananyCanall'
            )->canAny(
                'something'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForDisabledCanCananyCanall'
            )->canAll(
                'something'
            )->get()
        );
    }

    public function testPartCapabilitiesForCustomCanCananyCanall()
    {
        wp_set_current_user($this->userId);

        vchelper('AccessRole')->who($this->roleKey)->part(
            'testPartCapabilitiesForCustomCanCananyCanall'
        )->setState(
            true
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanall'
            )->can()->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanall'
            )->can(
                'something'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanall'
            )->can(
                'something2'
            )->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanall'
            )->canAny(
                'something'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanall'
            )->canAny(
                'something',
                'something2'
            )->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanall'
            )->canAll(
                'something'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanall'
            )->canAll(
                'something',
                'something2'
            )->get()
        );

        vchelper('AccessRole')->who($this->roleKey)->part(
            'testPartCapabilitiesForCustomCanCananyCanall'
        )->setState(
            false
        );

        // what if I try to add capability to false state? It must be false anyway!- cannot set capability for false state
        vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
            'testPartCapabilitiesForCustomCanCananyCanall'
        )->setCapRule(
            'something',
            true
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanall'
            )->can(
                'something'
            )->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanall'
            )->canAny(
                'something'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanall'
            )->canAny(
                'something',
                'something2'
            )->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanall'
            )->canAll(
                'something'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanall'
            )->canAll(
                'something',
                'something2'
            )->get()
        );

        // For false
        vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
            'testPartCapabilitiesForCustomCanCananyCanall'
        )->setCapRule(
            'something',
            false
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanall'
            )->can(
                'something'
            )->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanall'
            )->canAny(
                'something'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanall'
            )->canAny(
                'something',
                'something2'
            )->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanall'
            )->canAll(
                'something'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanall'
            )->canAll(
                'something2'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanall'
            )->canAll(
                'something',
                'something2'
            )->get()
        );

        vchelper('AccessRole')->who($this->roleKey)->part(
            'testPartCapabilitiesForCustomCanCananyCanall'
        )->setState(
            null
        );
        // For multiple
        vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
            'testPartCapabilitiesForCustomCanCananyCanall'
        )->setCapRule(
            'something',
            true
        );
        vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
            'testPartCapabilitiesForCustomCanCananyCanall'
        )->setCapRule(
            'something2',
            true
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanall'
            )->can(
                'something'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanall'
            )->can(
                'something2'
            )->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanall'
            )->canAny(
                'something'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanall'
            )->canAny(
                'something2'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanall'
            )->canAny(
                'something',
                'something2'
            )->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanall'
            )->canAll(
                'something'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanall'
            )->canAll(
                'something2'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanall'
            )->canAll(
                'something',
                'something2'
            )->get()
        );

        // For multiple false
        vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
            'testPartCapabilitiesForCustomCanCananyCanall'
        )->setCapRule(
            'something',
            false
        );
        vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
            'testPartCapabilitiesForCustomCanCananyCanall'
        )->setCapRule(
            'something2',
            true
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanall'
            )->can(
                'something'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanall'
            )->can(
                'something2'
            )->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanall'
            )->canAny(
                'something'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanall'
            )->canAny(
                'something2'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanall'
            )->canAny(
                'something',
                'something2'
            )->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanall'
            )->canAll(
                'something'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanall'
            )->canAll(
                'something2'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part(
                'testPartCapabilitiesForCustomCanCananyCanall'
            )->canAll(
                'something',
                'something2'
            )->get()
        );
    }

    public function testPartValidation()
    {
        wp_set_current_user($this->userId);

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->setValidAccess(false)->part(
                'testPartValidation'
            )->get()
        );
        vchelper('AccessCurrentUser')->part('testPartValidation')->setCapRule('something', true);
        vchelper('AccessCurrentUser')->part('testPartValidation')->setCapRule('something2', true);

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->checkAdminNonce(
                vcapp('NonceHelper')->admin()
            )->checkPublicNonce(vcapp('NonceHelper')->user())->check(
                [
                    $this,
                    '_check',
                ],
                true
            )->wpAny('edit_posts', 'edit_pages')->wpAll('edit_posts', 'edit_pages')->part('testPartValidation')->canAny(
                'something'
            )// in null it is always true
            ->canAny(
                'something',
                'something2'
            )// in null it is always true
            ->canAll(
                'something'
            )// in null it is always true
            ->canAll(
                'something',
                'something2'
            )// in null it is always true
            ->checkState(null)->checkStateAny(
                true,
                null
            )->get()
        );
    }
}
