<?php

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

		// ->get() should reset valid access, let's test this:
		$this->assertFalse( $role_access->setValidAccess( false )
		                                ->get() );
		// now access should be again true
		$this->assertTrue( $role_access->getValidAccess() );
		$this->assertTrue( $role_access->get() );
	}

	public function test_role_access_validate_die() {
		$role_access = app( 'VisualComposer\Modules\Access\Role\Access' );
		// validateDie and setValidAccess tests
		try {
			$role_access->setValidAccess( false )
			            ->validateDie( 'test message' )->get();
		} catch ( Exception $e ) {
			$this->assertEquals( 'test message', $e->getMessage(), 'message should be applied to exception' );
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
		$this->assertTrue( vc_verify_admin_nonce( vc_generate_nonce( 'vc-admin-nonce' ) ) );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkAdminNonce( vc_generate_nonce( 'vc-admin-nonce' ) )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkAdminNonce( vc_generate_nonce( 'vc-admin-nonce' ) )
			->getValidAccess() );

		// negative tests
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkAdminNonce( 'abc' )
			->getValidAccess() );
		//reset
		app( 'VisualComposer\Modules\Access\Role\Access' )->setValidAccess( true );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkAdminNonce( 'abc' )
			->get() );
	}

	public function test_check_public_nonce() {
		$this->assertTrue( vc_verify_public_nonce( vc_generate_nonce( 'vc-public-nonce' ) ) );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkPublicNonce( vc_generate_nonce( 'vc-public-nonce' ) )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkPublicNonce( vc_generate_nonce( 'vc-public-nonce' ) )
			->getValidAccess() );

		// negative tests
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkPublicNonce( 'abc' )
			->getValidAccess() );
		//reset
		app( 'VisualComposer\Modules\Access\Role\Access' )->setValidAccess( true );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkPublicNonce( 'abc' )
			->get() );
	}

	public function _check( $value ) {
		// used in next test
		return (bool) $value;
	}

	public function test_check_method() {
		// custom validators:
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )->check(
			array(
				$this,
				'_check'
			), true )->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )->check(
			array(
				$this,
				'_check'
			), false )->get() );

		// checkAny
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )->checkAny(
			array(
				array(
					$this,
					'_check'
				),
				true
			) )->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )->checkAny(
			array(
				array(
					$this,
					'_check'
				),
				false
			)
		)->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )->checkAny(
			array(
				array(
					$this,
					'_check'
				),
				false
			),
			array(
				array(
					$this,
					'_check'
				),
				true
			)
		)->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )->checkAny(
			array(
				array(
					$this,
					'_check'
				),
				true
			),
			array(
				array(
					$this,
					'_check'
				),
				false
			)
		)->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )->checkAny(
			array(
				array(
					$this,
					'_check'
				),
				true
			),
			array(
				array(
					$this,
					'_check'
				),
				true
			)
		)->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )->checkAny(
			array(
				array(
					$this,
					'_check'
				),
				false
			),
			array(
				array(
					$this,
					'_check'
				),
				false
			)
		)->get() );

		//checkAll
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )->checkAll(
			array(
				array(
					$this,
					'_check'
				),
				false
			)
		)->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )->checkAll(
			array(
				array(
					$this,
					'_check'
				),
				true
			),
			array(
				array(
					$this,
					'_check'
				),
				false
			)
		)->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )->checkAll(
			array(
				array(
					$this,
					'_check'
				),
				false
			),
			array(
				array(
					$this,
					'_check'
				),
				false
			)
		)->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )->checkAll(
			array(
				array(
					$this,
					'_check'
				),
				false
			),
			array(
				array(
					$this,
					'_check'
				),
				true
			)
		)->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )->checkAll(
			array(
				array(
					$this,
					'_check'
				),
				true
			)
		)->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )->checkAll(
			array(
				array(
					$this,
					'_check'
				),
				true
			), array(
				array(
					$this,
					'_check'
				),
				true
			)
		)->get() );
	}

	public function test_current_role_access() {
		$this->assertEquals( 'administrator', app( 'VisualComposer\Modules\Access\Role\Access' )
			->who( 'administrator' )
			->part( 'any' )
			->getRole()->name );
		$this->assertEquals( 'administrator', app( 'VisualComposer\Modules\Access\Role\Access' )
			->who( 'administrator' )
			->part( 'any' )
			->getRoleName() );
	}

	public function test_states() {
		$this->assertNull( app( 'VisualComposer\Modules\Access\Role\Access' )->part( 'something_role' )->getState() );

		// now assert "real" parts in "clean" vc-state should be null
		wp_set_current_user( 1 );
		// check bc ( if never saved frontend/backend it is true by default in BC )
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'frontend_editor' )
			->getState() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'backend_editor' )
			->getState() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'shortcodes' )
			->getState() );

		// check can
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'frontend_editor' )
			->can()
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'backend_editor' )
			->can()
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'shortcodes' )
			->can()
			->get() );

		// check nonce falses
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkAdminNonce()// no nonce exists
			->part( 'shortcodes' )
			->can()
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkPublicNonce()// no nonce exists
			->part( 'shortcodes' )
			->can()
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkAdminNonce()// no nonce exists
			->checkPublicNonce()// no nonce exists
			->part( 'shortcodes' )
			->can()
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )->getValidAccess() );

	}

	public function test_part_check_state() {
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->checkState( null )
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->checkState( true )
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->checkStateAny( true, 'custom', null )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->checkStateAny( true, 'custom' )
			->get() );
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

		app( 'VisualComposer\Modules\Access\Role\Access' )->part( 'something_role' )->setState( false );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->can()
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->can( 'something_role' )
			->get() );


		app( 'VisualComposer\Modules\Access\Role\Access' )->part( 'something_role' )->setState( 'custom' );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->can()
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->can( 'something_role' )
			->get() );

		// reset:
		app( 'VisualComposer\Modules\Access\Role\Access' )->part( 'something_role' )->setState( null );

	}


	public function test_part_capabilities_for_empty_can_canany_canall() {
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

		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAny( 'something_role' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAny( 'something_role', 'something_role2' )
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAll( 'something_role' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAll( 'something_role', 'something_role2' )
			->get() );

		// for state=null any cap is true
		app( 'VisualComposer\Modules\Access\Role\Access' )->part( 'something_role' )->setCapRule( 'something_role', true );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->can( 'something_role' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAny( 'something_role' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAll( 'something_role' )
			->get() );

		// for state=null any cap is true
		app( 'VisualComposer\Modules\Access\Role\Access' )->part( 'something_role' )->setCapRule( 'something_role', false );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->can( 'something_role' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAny( 'something_role' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAll( 'something_role' )
			->get() );
	}

	public function test_part_capabilities_for_disabled_can_canany_canall() {
		wp_set_current_user( 1 );

		app( 'VisualComposer\Modules\Access\Role\Access' )->part( 'something_role' )->setState( false );
		// always false..
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->can()
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->can( 'something_role' )
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAny( 'something_role' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAny( 'something_role', 'something_role2' )
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAll( 'something_role' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAll( 'something_role', 'something_role2' )
			->get() );

		// what if I try to add capability to false state? It must be false anyway!- cannot set capability for false state
		app( 'VisualComposer\Modules\Access\Role\Access' )->part( 'something_role' )->setCapRule( 'something_role', true );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->can( 'something_role' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAny( 'something_role' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAll( 'something_role' )
			->get() );

		app( 'VisualComposer\Modules\Access\Role\Access' )->part( 'something_role' )->setCapRule( 'something_role', false );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->can( 'something_role' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAny( 'something_role' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAll( 'something_role' )
			->get() );
	}

	public function test_part_capabilities_for_custom_can_canany_canall() {
		wp_set_current_user( 1 );

		app( 'VisualComposer\Modules\Access\Role\Access' )->part( 'something_role' )->setState( 'custom' );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->can()
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->can( 'something_role' )
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAny( 'something_role' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAny( 'something_role', 'something_role2' )
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAll( 'something_role' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAll( 'something_role', 'something_role2' )
			->get() );

		// what if I try to add capability to false state? It must be false anyway!- cannot set capability for false state
		app( 'VisualComposer\Modules\Access\Role\Access' )->part( 'something_role' )->setCapRule( 'something_role', true );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->can( 'something_role' )
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAny( 'something_role' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAny( 'something_role', 'something_role2' )
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAll( 'something_role' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAll( 'something_role', 'something_role2' )
			->get() );

		// For false
		app( 'VisualComposer\Modules\Access\Role\Access' )->part( 'something_role' )->setCapRule( 'something_role', false );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->can( 'something_role' )
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAny( 'something_role' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAny( 'something_role', 'something_role2' )
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAll( 'something_role' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAll( 'something_role2' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAll( 'something_role', 'something_role2' )
			->get() );


		// For multiple
		app( 'VisualComposer\Modules\Access\Role\Access' )->part( 'something_role' )->setCapRule( 'something_role', true );
		app( 'VisualComposer\Modules\Access\Role\Access' )->part( 'something_role' )->setCapRule( 'something_role2', true );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->can( 'something_role' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->can( 'something_role2' )
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAny( 'something_role' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAny( 'something_role2' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAny( 'something_role', 'something_role2' )
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAll( 'something_role' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAll( 'something_role2' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAll( 'something_role', 'something_role2' )
			->get() );

		// For multiple false
		app( 'VisualComposer\Modules\Access\Role\Access' )->part( 'something_role' )->setCapRule( 'something_role', false );
		app( 'VisualComposer\Modules\Access\Role\Access' )->part( 'something_role' )->setCapRule( 'something_role2', true );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->can( 'something_role' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->can( 'something_role2' )
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAny( 'something_role' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAny( 'something_role2' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAny( 'something_role', 'something_role2' )
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAll( 'something_role' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAll( 'something_role2' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->part( 'something_role' )
			->canAll( 'something_role', 'something_role2' )
			->get() );
		//reset
		app( 'VisualComposer\Modules\Access\Role\Access' )->part( 'something_role' )->setState( null );
	}

	public function test_part_validation() {
		wp_set_current_user( 1 );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\Role\Access' )
			->setValidAccess( false )
			->part( 'something_role' )
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\Role\Access' )
			->checkAdminNonce( vc_generate_nonce( 'vc-admin-nonce' ) )
			->checkPublicNonce( vc_generate_nonce( 'vc-public-nonce' ) )
			->check(
				array(
					$this,
					'_check'
				), true )
			->part( 'something_role' )
			->can()
			->canAny( 'something_role' )// in null it is always true
			->canAny( 'something_role', 'something_role2' )// in null it is always true
			->canAll( 'something_role' )// in null it is always true
			->canAll( 'something_role', 'something_role2' )// in null it is always true
			->checkState( null )
			->checkStateAny( 'custom', null )
			->get() );

	}
}