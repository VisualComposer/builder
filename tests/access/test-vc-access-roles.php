<?php

use VisualComposer\Helpers\WordPress\Nonce;

class VcAccessRolesTest extends WP_UnitTestCase {

	public function testRoleAccess() {
		$this->assertTrue( is_object( app( 'VisualComposer\Modules\Access\CurrentUser\Access' ) ) );
		$this->assertTrue( is_object( app( 'VisualComposer\Modules\Access\Role\Access' ) ) );
	}

	public function test_role_access_get() {
		$role_access = app( 'VisualComposer\Modules\Access\Role\Access' );

		// getValidAccess tests:
		$this->assertTrue( $role_access->getValidAccess() );
		$this->assertTrue( $role_access->setValidAccess( true )
		                               ->getValidAccess() );
		$this->assertFalse( $role_access->setValidAccess( false )
		                                ->getValidAccess() );

		// ->get()
		$this->assertFalse( $role_access->setValidAccess( false )->get() );
		// now access should be again true
		$this->assertFalse( $role_access->getValidAccess() );
		$this->assertFalse( $role_access->get() );

		// ->get(true) will reset
		$this->assertFalse( $role_access->get( true ) );
		// now access should be again true
		$this->assertTrue( $role_access->getValidAccess() );
		$this->assertTrue( $role_access->get() );
	}

	public function test_role_access_validate_die() {
		$role_access = app( 'VisualComposer\Modules\Access\Role\Access' );
		// validateDie and setValidAccess tests
		try {
			$role_access->setValidAccess( false )
			            ->validateDie( 'test message' )
			            ->get();
		} catch ( Exception $e ) {
			$this->assertEquals( 'test message',
				$e->getMessage(),
				'message should be applied to exception' );
			$this->assertTrue( true, 'exception must be triggered' );
			$role_access->setValidAccess( true ); // reset value
		}

		// in case of true no exception should be triggered
		try {
			$this->assertTrue( $role_access->setValidAccess( true )
			                               ->validateDie()
			                               ->get() );
		} catch ( Exception $e ) {
			$this->assertTrue( false, 'exception must not to be triggered' );
		}
	}

	public function test_check_admin_nonce() {
		$this->assertTrue( Nonce::verifyAdmin( Nonce::admin() ) );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkAdminNonce( Nonce::admin() )
			->get( true ) );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkAdminNonce( Nonce::admin() )
			->getValidAccess() );

		// negative tests
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkAdminNonce( 'abc' )
			->getValidAccess() );
		//reset
		app( 'VisualComposer\Modules\Access\Role\Access' )->setValidAccess( true );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkAdminNonce( 'abc' )
			->get( true ) );
	}

	public function test_check_public_nonce() {
		$this->assertTrue( Nonce::verifyUser( Nonce::user() ) );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->reset()
			->checkPublicNonce( Nonce::user() )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkPublicNonce( Nonce::user() )
			->getValidAccess() );

		// negative tests
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkPublicNonce( 'abc' )
			->getValidAccess() );
		//reset
		app( 'VisualComposer\Modules\Access\Role\Access' )->setValidAccess( true );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkPublicNonce( 'abc' )
			->get( true ) );
	}

	public function _check( $value ) {
		// used in next test
		return (bool) $value;
	}

	public function test_check_method() {
		// custom validators:
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->reset()
			->check([
				$this,
				'_check',
                    ],
                    true )
			->get( true ) );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->check([
				$this,
				'_check',
                    ],
                    false )
			->get( true ) );

		// checkAny
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkAny([
				[
					$this,
					'_check',
                ],
				true,
                       ]
            )
			->get( true ) );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkAny([
				[
					$this,
					'_check',
                ],
				false,
                       ]
            )
			->get( true ) );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkAny([
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
            )
			->get( true ) );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkAny([
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
            )
			->get( true ) );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkAny([
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
            )
			->get( true ) );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkAny([
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
            )
			->get( true ) );

		//checkAll
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkAll([
				[
					$this,
					'_check',
                ],
				false,
                       ]
            )
			->get( true ) );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkAll([
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
            )
			->get( true ) );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkAll([
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
            )
			->get( true ) );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkAll([
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
            )
			->get( true ) );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkAll([
				[
					$this,
					'_check',
                ],
				true,
                       ]
            )
			->get( true ) );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkAll([
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
            )
			->get( true ) );
	}

	public function test_current_role_access() {
		$this->assertEquals( 'administrator',
			app( 'VisualComposer\Modules\Access\Role\Access' )
				->who( 'administrator' )
				->part( 'any', true )
				->getRole()->name );
		$this->assertEquals( 'administrator',
			app( 'VisualComposer\Modules\Access\Role\Access' )
				->who( 'administrator' )
				->part( 'any', true )
				->getRoleName() );
	}

	public function test_states() {
		$this->assertNull( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->getState() );

		// now assert "real" parts in "clean" vc-state should be null
		wp_set_current_user( 1 );
		$this->assertNull( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'frontend_editor', true )
			->getState() );
		$this->assertNull( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'backend_editor', true )
			->getState() );
		$this->assertNull( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'shortcodes', true )
			->getState() );

		// check can
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'frontend_editor', true )
			->can()
			->get( true ) );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'backend_editor' )
			->can()
			->get( true ) );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'shortcodes' )
			->can()
			->get( true ) );

		// check nonce falses
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkAdminNonce()// no nonce exists
			->part( 'shortcodes' )
			->can()
			->get( true ) );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkPublicNonce()// no nonce exists
			->part( 'shortcodes' )
			->can()
			->get( true ) );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkAdminNonce()// no nonce exists
			->checkPublicNonce()// no nonce exists
			->part( 'shortcodes' )
			->can()
			->get( true ) );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )->getValidAccess() );

	}

	public function test_part_check_state() {
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->checkState( null )
			->get( true ) );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->checkState( true )
			->get( true ) );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->checkStateAny( true, 'custom', null )
			->get( true ) );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->checkStateAny( true, 'custom' )
			->get( true ) );
	}

	public function test_part_capabilities() {
		wp_set_current_user( 1 );

		// un existed
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->can()
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->can( 'something_role' )
			->get() );

		app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->setState( false );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->can()
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->can( 'something_role' )
			->get( true ) );

		app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->setState( 'custom' );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->can()
			->get( true ) );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->can( 'something_role' )
			->get( true ) );

		// reset:
		app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->setState( null );

	}

	public function test_part_capabilities_for_empty_can_canany_canall() {
		wp_set_current_user( 1 );

		// un existed
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->can()
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->can( 'something_role' )
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAny( 'something_role' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAny( 'something_role', 'something_role2' )
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAll( 'something_role' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAll( 'something_role', 'something_role2' )
			->get() );

		// for state=null any cap is true
		app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->setCapRule( 'something_role', true );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->can( 'something_role' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAny( 'something_role' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAll( 'something_role' )
			->get() );

		// for state=null any cap is true
		app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->setCapRule( 'something_role', false );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->can( 'something_role' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAny( 'something_role' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAll( 'something_role' )
			->get() );
	}

	public function test_part_capabilities_for_disabled_can_canany_canall() {
		wp_set_current_user( 1 );

		app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->setState( false );
		// always false..
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->can()
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->can( 'something_role' )
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAny( 'something_role' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAny( 'something_role', 'something_role2' )
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAll( 'something_role' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAll( 'something_role', 'something_role2' )
			->get() );

		// what if I try to add capability to false state? It must be false anyway!- cannot set capability for false state
		app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->setCapRule( 'something_role', true );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->can( 'something_role' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAny( 'something_role' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAll( 'something_role' )
			->get() );

		app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->setCapRule( 'something_role', false );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->can( 'something_role' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAny( 'something_role' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAll( 'something_role' )
			->get() );
	}

	public function test_part_capabilities_for_custom_can_canany_canall() {
		wp_set_current_user( 1 );

		app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->setState( 'custom' );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->can()
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->can( 'something_role' )
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAny( 'something_role' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAny( 'something_role', 'something_role2' )
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAll( 'something_role' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAll( 'something_role', 'something_role2' )
			->get() );

		// what if I try to add capability to false state? It must be false anyway!- cannot set capability for false state
		app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->setCapRule( 'something_role', true );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->can( 'something_role' )
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAny( 'something_role' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAny( 'something_role', 'something_role2' )
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAll( 'something_role' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAll( 'something_role', 'something_role2' )
			->get() );

		// For false
		app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->setCapRule( 'something_role', false );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->can( 'something_role' )
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAny( 'something_role' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAny( 'something_role', 'something_role2' )
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAll( 'something_role' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAll( 'something_role2' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAll( 'something_role', 'something_role2' )
			->get() );

		// For multiple
		app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->setCapRule( 'something_role', true );
		app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->setCapRule( 'something_role2', true );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->can( 'something_role' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->can( 'something_role2' )
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAny( 'something_role' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAny( 'something_role2' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAny( 'something_role', 'something_role2' )
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAll( 'something_role' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAll( 'something_role2' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAll( 'something_role', 'something_role2' )
			->get() );

		// For multiple false
		app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->setCapRule( 'something_role', false );
		app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->setCapRule( 'something_role2', true );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->can( 'something_role' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->can( 'something_role2' )
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAny( 'something_role' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAny( 'something_role2' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAny( 'something_role', 'something_role2' )
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAll( 'something_role' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAll( 'something_role2' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->canAll( 'something_role', 'something_role2' )
			->get() );
		//reset
		app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role', true )
			->setState( null );
	}

	public function test_part_validation() {
		wp_set_current_user( 1 );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->setValidAccess( false )
			->part( 'something_role' )
			->get( true ) );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkAdminNonce( Nonce::admin() )
			->checkPublicNonce( Nonce::user() )
			->check([
				$this,
				'_check',
                    ],
                    true )
			->part( 'something_role' )
			->can()
			->canAny( 'something_role' )// in null it is always true
			->canAny( 'something_role',
				'something_role2' )// in null it is always true
			->canAll( 'something_role' )// in null it is always true
			->canAll( 'something_role',
				'something_role2' )// in null it is always true
			->checkState( null )
			->checkStateAny( 'custom', null )
			->get( true ) );

	}
}