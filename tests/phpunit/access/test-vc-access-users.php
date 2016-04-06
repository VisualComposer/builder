<?php

use VisualComposer\Helpers\Nonce;

class VcAccessUsersTest extends WP_UnitTestCase
{
    public function test_user_access_validate_die()
    {
        $this->assertEquals(
            vcapp('VisualComposer\Helpers\Access\Role')->who('administrator')->getRoleName(),
            vcapp('VisualComposer\Helpers\Access\Role')->getRoleName()
        );
        $user_access = vcapp('VisualComposer\Helpers\Access\CurrentUser');
        // validateDie and setValidAccess tests
        try {
            $user_access->setValidAccess(false)->validateDie('test message')->get();
        } catch (Exception $e) {
            $this->assertEquals(
                'test message',
                $e->getMessage(),
                'message should be applied to exception'
            );
            $this->assertTrue(true, 'exception must be triggered');
            $user_access->setValidAccess(true); // reset value
        }

        // in case of true no exception should be triggered
        try {
            $this->assertTrue(
                $user_access->setValidAccess(true)->validateDie()->get(true)
            );
        } catch (Exception $e) {
            $this->assertTrue(false, 'exception must not to be triggered');
        }
    }

    public function test_user_access_get()
    {
        $user_access = vcapp('VisualComposer\Helpers\Access\CurrentUser');

        // getValidAccess tests:
        $this->assertTrue($user_access->getValidAccess());
        $this->assertTrue(
            $user_access->setValidAccess(true)->getValidAccess()
        );
        $this->assertFalse(
            $user_access->setValidAccess(false)->getValidAccess()
        );

        // ->get() by defautls resets
        $this->assertFalse($user_access->setValidAccess(false)->get());
        // now access should be true
        $this->assertTrue($user_access->getValidAccess());
        $this->assertTrue($user_access->get());
    }

    public function test_check_admin_nonce()
    {
        $this->assertTrue(vcapp('NonceHelper')->verifyAdmin(vcapp('NonceHelper')->admin()));
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->checkAdminNonce(
                vcapp('NonceHelper')->admin()
            )->get(true)
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->checkAdminNonce(
                vcapp('NonceHelper')->admin()
            )->getValidAccess()
        );

        // negative tests
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->checkAdminNonce('abc')
                                                                             ->getValidAccess()
        );
        //reset
        vcapp('VisualComposer\Helpers\Access\CurrentUser')->setValidAccess(true);
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->checkAdminNonce('abc')->get()
        );
    }

    public function test_check_public_nonce()
    {
        $this->assertTrue(vcapp('NonceHelper')->verifyUser(vcapp('NonceHelper')->user()));
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->checkPublicNonce(
                vcapp('NonceHelper')->user()
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->checkPublicNonce(
                vcapp('NonceHelper')->user()
            )->getValidAccess()
        );

        // negative tests
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->checkPublicNonce('abc')
                                                                             ->getValidAccess()
        );
        //reset
        vcapp('VisualComposer\Helpers\Access\CurrentUser')->setValidAccess(true);
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->checkPublicNonce('abc')->get()
        );
    }

    public function _check($value)
    {
        // used in next test
        return (bool)$value;
    }

    public function test_check_method()
    {
        // custom validators:
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->check(
                [
                    $this,
                    '_check',
                ],
                true
            )->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->check(
                [
                    $this,
                    '_check',
                ],
                false
            )->get()
        );

        // checkAny
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->checkAny(
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
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->checkAny(
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
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->checkAny(
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
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->checkAny(
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
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->checkAny(
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
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->checkAny(
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
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->checkAll(
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
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->checkAll(
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
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->checkAll(
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
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->checkAll(
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
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->checkAll(
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
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->checkAll(
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

    public function test_current_user_access()
    {
        wp_set_current_user(1);
        $user_access = vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset();
        $this->assertTrue($user_access->wpAny('edit_posts')->get(true));
        $this->assertTrue($user_access->wpAny('edit_pages')->get(true));
        $this->assertFalse(
            $user_access->wpAny('non_exists_cap')->get(true)
        );

        $this->assertTrue(
            $user_access->wpAll('edit_posts', 'edit_pages')->get(true)
        );

        $this->assertTrue(
            $user_access->wpAny('edit_posts', 'edit_pages')->get(true)
        );

        $this->assertTrue(
            $user_access->wpAny(
                'edit_posts',
                'edit_pages',
                'non_exists_cap'
            )->get(true)
        );

        $this->assertFalse(
            $user_access->wpAll(
                'edit_posts',
                'edit_pages',
                'non_exists_cap'
            )->get(true)
        );

        $this->assertEquals(
            'administrator',
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('any')->getRole()->name
        );
        $this->assertEquals(
            'administrator',
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->part('any')->getRoleName()
        );
    }

    public function test_states()
    {
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->can()->get()
        );
        $this->assertNull(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->getState()
        );

        // now assert "real" parts in "clean" vc-state should be null
        wp_set_current_user(1);
        $this->assertNull(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('frontend_editor')
                                                                             ->getState()
        );
        $this->assertNull(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('backend_editor')
                                                                             ->getState()
        );
        $this->assertNull(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('shortcodes')->getState()
        );

        // check can
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('frontend_editor')->can()
                                                                             ->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('backend_editor')->can()
                                                                             ->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('shortcodes')->can()->get()
        );

        // check nonce falses
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->checkAdminNonce(
            )// no nonce exists
                                                                             ->part('shortcodes')->can()->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->checkPublicNonce(
            )// no nonce exists
                                                                             ->part('shortcodes')->can()->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->checkAdminNonce(
            )// no nonce exists
                                                                             ->checkPublicNonce()// no nonce exists
                                                                             ->part('shortcodes')->can()->get()
        );

        $this->assertTrue(vcapp('VisualComposer\Helpers\Access\CurrentUser')->getValidAccess());
        $this->assertTrue(vcapp('VisualComposer\Helpers\Access\CurrentUser')->get());
        $this->assertTrue(vcapp('VisualComposer\Helpers\Access\CurrentUser')->get(true));
        $this->assertTrue(vcapp('VisualComposer\Helpers\Access\CurrentUser')->get());

    }

    public function test_wp_any_all()
    {
        wp_set_current_user(1);

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->wpAny('edit_posts')->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->wpAny('non_exists')->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->wpAll('edit_posts')->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->wpAll('non_exists')->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->wpAny(
                'edit_posts',
                'edit_pages'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->wpAny(
                'edit_posts',
                'edit_pages',
                'non_exists'
            )->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->wpAll(
                'edit_posts',
                'edit_pages'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->wpAll(
                'edit_posts',
                'edit_pages',
                'non_exists'
            )->get()
        );
    }

    public function test_wp_any_all_in_parts()
    {
        wp_set_current_user(1);

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->wpAny('edit_posts')->part(
                'something'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->wpAny('non_exists')->part(
                'something'
            )->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->wpAll('edit_posts')->part(
                'something'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->wpAll('non_exists')->part(
                'something'
            )->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->wpAny(
                'edit_posts',
                'edit_pages'
            )->part(
                'something'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->wpAny(
                'edit_posts',
                'edit_pages',
                'non_exists'
            )->part('something')->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->wpAll(
                'edit_posts',
                'edit_pages'
            )->part(
                'something'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->wpAll(
                'edit_posts',
                'edit_pages',
                'non_exists'
            )->part('something')->get()
        );
    }

    public function test_part_check_state()
    {
        wp_set_current_user(1);

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->checkState(
                null
            )->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->checkState(
                true
            )->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')
                                                                             ->checkStateAny(
                                                                                 true,
                                                                                 'custom',
                                                                                 null
                                                                             )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')
                                                                             ->checkStateAny(
                                                                                 true,
                                                                                 'custom'
                                                                             )->get()
        );
    }

    public function test_part_capabilities()
    {
        wp_set_current_user(1);

        // un existed
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->can()->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->can(
                'something'
            )->get()
        );

        vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->setState(false);
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->can()->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->can(
                'something'
            )->get()
        );

        vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->setState(
            'custom'
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->can()->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->can(
                'something'
            )->get()
        );

        // reset:
        vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->setState(null);

    }

    public function test_part_capabilities_for_empty_can_canany_canall()
    {
        wp_set_current_user(1);

        // un existed
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->can()->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->can(
                'something'
            )->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAny(
                'something'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAny(
                'something',
                'something2'
            )->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAll(
                'something'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAll(
                'something',
                'something2'
            )->get()
        );

        // for state=null any cap is true
        vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->setCapRule(
            'something',
            true
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->can(
                'something'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAny(
                'something'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAll(
                'something'
            )->get()
        );

        // for state=null any cap is true
        vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->setCapRule(
            'something',
            false
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->can(
                'something'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAny(
                'something'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAll(
                'something'
            )->get()
        );
    }

    public function test_part_capabilities_for_disabled_can_canany_canall()
    {
        wp_set_current_user(1);

        vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->setState(false);
        // always false..
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->can()->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->can(
                'something'
            )->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAny(
                'something'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAny(
                'something',
                'something2'
            )->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAll(
                'something'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAll(
                'something',
                'something2'
            )->get()
        );

        // what if I try to add capability to false state? It must be false anyway!- cannot set capability for false state
        vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->setCapRule(
            'something',
            true
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->can(
                'something'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAny(
                'something'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAll(
                'something'
            )->get()
        );

        vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->setCapRule(
            'something',
            false
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->can(
                'something'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAny(
                'something'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAll(
                'something'
            )->get()
        );
    }

    public function test_part_capabilities_for_custom_can_canany_canall()
    {
        wp_set_current_user(1);

        vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->setState(
            'custom'
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->can()->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->can(
                'something'
            )->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAny(
                'something'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAny(
                'something',
                'something2'
            )->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAll(
                'something'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAll(
                'something',
                'something2'
            )->get()
        );

        // what if I try to add capability to false state? It must be false anyway!- cannot set capability for false state
        vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->setCapRule(
            'something',
            true
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->can(
                'something'
            )->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAny(
                'something'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAny(
                'something',
                'something2'
            )->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAll(
                'something'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAll(
                'something',
                'something2'
            )->get()
        );

        // For false
        vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->setCapRule(
            'something',
            false
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->can(
                'something'
            )->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAny(
                'something'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAny(
                'something',
                'something2'
            )->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAll(
                'something'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAll(
                'something2'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAll(
                'something',
                'something2'
            )->get()
        );

        // For multiple
        vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->setCapRule(
            'something',
            true
        );
        vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->setCapRule(
            'something2',
            true
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->can(
                'something'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->can(
                'something2'
            )->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAny(
                'something'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAny(
                'something2'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAny(
                'something',
                'something2'
            )->get()
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAll(
                'something'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAll(
                'something2'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAll(
                'something',
                'something2'
            )->get()
        );

        // For multiple false
        vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->setCapRule(
            'something',
            false
        );
        vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->setCapRule(
            'something2',
            true
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->can(
                'something'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->can(
                'something2'
            )->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAny(
                'something'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAny(
                'something2'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAny(
                'something',
                'something2'
            )->get()
        );

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAll(
                'something'
            )->get()
        );
        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAll(
                'something2'
            )->get()
        );
        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->canAll(
                'something',
                'something2'
            )->get()
        );
        //reset
        vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->part('something')->setState(null);
    }

    public function test_part_validation()
    {
        wp_set_current_user(1);

        $this->assertFalse(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->setValidAccess(false)->part(
                'something'
            )->get(true)
        );

        $this->assertTrue(
            vcapp('VisualComposer\Helpers\Access\CurrentUser')->reset()->checkAdminNonce(
                vcapp('NonceHelper')->admin()
            )->checkPublicNonce(vcapp('NonceHelper')->user())->check(
                [
                    $this,
                    '_check',
                ],
                true
            )->wpAny('edit_posts', 'edit_pages')->wpAll('edit_posts', 'edit_pages')->part('something')->can()->canAny(
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
                'custom',
                null
            )->get(true)
        );
    }
}