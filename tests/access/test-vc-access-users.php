<?php

class VcAccessUsersTest extends WP_UnitTestCase {

	public function testUserAccess() {
		$this->assertTrue( is_object( vc_manager()->getCurrentUserAccess() ) );
		$this->assertTrue( is_object( app( 'VisualComposer\Modules\Access\CurrentUser\Access' ) ) );
	}

	public function test_user_access_validate_die() {
		$user_access = app( 'VisualComposer\Modules\Access\CurrentUser\Access' );
		// validateDie and setValidAccess tests
		try {
			$user_access->setValidAccess( false )
			            ->validateDie( 'test message' )->get();
		} catch ( Exception $e ) {
			$this->assertEquals( 'test message', $e->getMessage(), 'message should be applied to exception' );
			$this->assertTrue( true, 'exception must be triggered' );
			$user_access->setValidAccess( true ); // reset value
		}

		// in case of true no exception should be triggered
		try {
			$this->assertTrue( $user_access->setValidAccess( true )
			                               ->validateDie()
			                               ->get() );
		} catch ( Exception $e ) {
			$this->assertTrue( false, 'exception must not to be triggered' );
		}
	}

	public function test_user_access_get() {
		$user_access = app( 'VisualComposer\Modules\Access\CurrentUser\Access' );

		// getValidAccess tests:
		$this->assertTrue( $user_access->getValidAccess() );
		$this->assertTrue( $user_access->setValidAccess( true )
		                               ->getValidAccess() );
		$this->assertFalse( $user_access->setValidAccess( false )
		                                ->getValidAccess() );

		// ->get() should reset valid access, let's test this:
		$this->assertFalse( $user_access->setValidAccess( false )
		                                ->get() );
		// now access should be again true
		$this->assertTrue( $user_access->getValidAccess() );
		$this->assertTrue( $user_access->get() );
	}

	public function test_check_admin_nonce() {
		$this->assertTrue( vc_verify_admin_nonce( vc_generate_nonce( 'vc-admin-nonce' ) ) );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->checkAdminNonce( vc_generate_nonce( 'vc-admin-nonce' ) )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->checkAdminNonce( vc_generate_nonce( 'vc-admin-nonce' ) )
			->getValidAccess() );

		// negative tests
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->checkAdminNonce( 'abc' )
			->getValidAccess() );
		//reset
		app( 'VisualComposer\Modules\Access\CurrentUser\Access' )->setValidAccess( true );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->checkAdminNonce( 'abc' )
			->get() );
	}

	public function test_check_public_nonce() {
		$this->assertTrue( vc_verify_public_nonce( vc_generate_nonce( 'vc-public-nonce' ) ) );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->checkPublicNonce( vc_generate_nonce( 'vc-public-nonce' ) )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->checkPublicNonce( vc_generate_nonce( 'vc-public-nonce' ) )
			->getValidAccess() );

		// negative tests
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->checkPublicNonce( 'abc' )
			->getValidAccess() );
		//reset
		app( 'VisualComposer\Modules\Access\CurrentUser\Access' )->setValidAccess( true );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->checkPublicNonce( 'abc' )
			->get() );
	}

	public function _check( $value ) {
		// used in next test
		return (bool) $value;
	}

	public function test_check_method() {
		// custom validators:
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )->check(
			array(
				&$this,
				'_check'
			), true )->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )->check(
			array(
				&$this,
				'_check'
			), false )->get() );

		// checkAny
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )->checkAny(
			array(
				array(
					&$this,
					'_check'
				),
				true
			) )->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )->checkAny(
			array(
				array(
					&$this,
					'_check'
				),
				false
			)
		)->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )->checkAny(
			array(
				array(
					&$this,
					'_check'
				),
				false
			),
			array(
				array(
					&$this,
					'_check'
				),
				true
			)
		)->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )->checkAny(
			array(
				array(
					&$this,
					'_check'
				),
				true
			),
			array(
				array(
					&$this,
					'_check'
				),
				false
			)
		)->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )->checkAny(
			array(
				array(
					&$this,
					'_check'
				),
				true
			),
			array(
				array(
					&$this,
					'_check'
				),
				true
			)
		)->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )->checkAny(
			array(
				array(
					&$this,
					'_check'
				),
				false
			),
			array(
				array(
					&$this,
					'_check'
				),
				false
			)
		)->get() );

		//checkAll
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )->checkAll(
			array(
				array(
					&$this,
					'_check'
				),
				false
			)
		)->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )->checkAll(
			array(
				array(
					&$this,
					'_check'
				),
				true
			),
			array(
				array(
					&$this,
					'_check'
				),
				false
			)
		)->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )->checkAll(
			array(
				array(
					&$this,
					'_check'
				),
				false
			),
			array(
				array(
					&$this,
					'_check'
				),
				false
			)
		)->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )->checkAll(
			array(
				array(
					&$this,
					'_check'
				),
				false
			),
			array(
				array(
					&$this,
					'_check'
				),
				true
			)
		)->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )->checkAll(
			array(
				array(
					&$this,
					'_check'
				),
				true
			)
		)->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )->checkAll(
			array(
				array(
					&$this,
					'_check'
				),
				true
			), array(
				array(
					&$this,
					'_check'
				),
				true
			)
		)->get() );
	}

	public function test_current_user_access() {
		wp_set_current_user( 1 );
		$user_access = app( 'VisualComposer\Modules\Access\CurrentUser\Access' );
		$this->assertTrue( $user_access->wpAny( 'edit_posts' )->get() );
		$this->assertTrue( $user_access->wpAny( 'edit_pages' )->get() );
		$this->assertFalse( $user_access->wpAny( 'non_exists_cap' )->get() );

		$this->assertTrue( $user_access->wpAll( 'edit_posts', 'edit_pages' )
		                               ->get() );

		$this->assertTrue( $user_access->wpAny( 'edit_posts', 'edit_pages' )
		                               ->get() );

		$this->assertTrue( $user_access->wpAny( 'edit_posts', 'edit_pages', 'non_exists_cap' )
		                               ->get() );

		$this->assertFalse( $user_access->wpAll( 'edit_posts', 'edit_pages', 'non_exists_cap' )
		                                ->get() );

		$this->assertEquals( 'administrator', app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'any' )
			->getRole()->name );
		$this->assertEquals( 'administrator', app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'any' )
			->getRoleName() );
	}

	public function test_states() {
		$this->assertNull( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )->part( 'something' )->getState() );

		// now assert "real" parts in "clean" vc-state should be null
		wp_set_current_user( 1 );
		// check bc ( if never saved frontend/backend it is true by default in BC )
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'frontend_editor' )
			->getState() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'backend_editor' )
			->getState() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'shortcodes' )
			->getState() );

		// check can
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'frontend_editor' )
			->can()
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'backend_editor' )
			->can()
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'shortcodes' )
			->can()
			->get() );

		// check nonce falses
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->checkAdminNonce()// no nonce exists
			->part( 'shortcodes' )
			->can()
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->checkPublicNonce()// no nonce exists
			->part( 'shortcodes' )
			->can()
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->checkAdminNonce()// no nonce exists
			->checkPublicNonce()// no nonce exists
			->part( 'shortcodes' )
			->can()
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )->getValidAccess() );

	}

	public function test_wp_any_all() {
		wp_set_current_user( 1 );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->wpAny( 'edit_posts' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->wpAny( 'non_exists' )
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->wpAll( 'edit_posts' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->wpAll( 'non_exists' )
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->wpAny( 'edit_posts', 'edit_pages' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->wpAny( 'edit_posts', 'edit_pages', 'non_exists' )
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->wpAll( 'edit_posts', 'edit_pages' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->wpAll( 'edit_posts', 'edit_pages', 'non_exists' )
			->get() );
	}

	public function test_wp_any_all_in_parts() {
		wp_set_current_user( 1 );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->wpAny( 'edit_posts' )
			->part( 'something' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->wpAny( 'non_exists' )
			->part( 'something' )
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->wpAll( 'edit_posts' )
			->part( 'something' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->wpAll( 'non_exists' )
			->part( 'something' )
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->wpAny( 'edit_posts', 'edit_pages' )
			->part( 'something' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->wpAny( 'edit_posts', 'edit_pages', 'non_exists' )
			->part( 'something' )
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->wpAll( 'edit_posts', 'edit_pages' )
			->part( 'something' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->wpAll( 'edit_posts', 'edit_pages', 'non_exists' )
			->part( 'something' )
			->get() );
	}

	public function test_part_check_state() {
		wp_set_current_user( 1 );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->checkState( null )
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->checkState( true )
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->checkStateAny( true, 'custom', null )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->checkStateAny( true, 'custom' )
			->get() );
	}

	public function test_part_capabilities() {
		wp_set_current_user( 1 );

		// un existed
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->can()
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->can( 'something' )
			->get() );

		app( 'VisualComposer\Modules\Access\CurrentUser\Access' )->part( 'something' )->setState( false );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->can()
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->can( 'something' )
			->get() );


		app( 'VisualComposer\Modules\Access\CurrentUser\Access' )->part( 'something' )->setState( 'custom' );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->can()
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->can( 'something' )
			->get() );

		// reset:
		app( 'VisualComposer\Modules\Access\CurrentUser\Access' )->part( 'something' )->setState( null );

	}


	public function test_part_capabilities_for_empty_can_canany_canall() {
		wp_set_current_user( 1 );

		// un existed
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->can()
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->can( 'something' )
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAny( 'something' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAny( 'something', 'something2' )
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAll( 'something' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAll( 'something', 'something2' )
			->get() );

		// for state=null any cap is true
		app( 'VisualComposer\Modules\Access\CurrentUser\Access' )->part( 'something' )->setCapRule( 'something', true );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->can( 'something' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAny( 'something' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAll( 'something' )
			->get() );

		// for state=null any cap is true
		app( 'VisualComposer\Modules\Access\CurrentUser\Access' )->part( 'something' )->setCapRule( 'something', false );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->can( 'something' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAny( 'something' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAll( 'something' )
			->get() );
	}

	public function test_part_capabilities_for_disabled_can_canany_canall() {
		wp_set_current_user( 1 );

		app( 'VisualComposer\Modules\Access\CurrentUser\Access' )->part( 'something' )->setState( false );
		// always false..
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->can()
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->can( 'something' )
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAny( 'something' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAny( 'something', 'something2' )
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAll( 'something' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAll( 'something', 'something2' )
			->get() );

		// what if I try to add capability to false state? It must be false anyway!- cannot set capability for false state
		app( 'VisualComposer\Modules\Access\CurrentUser\Access' )->part( 'something' )->setCapRule( 'something', true );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->can( 'something' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAny( 'something' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAll( 'something' )
			->get() );

		app( 'VisualComposer\Modules\Access\CurrentUser\Access' )->part( 'something' )->setCapRule( 'something', false );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->can( 'something' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAny( 'something' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAll( 'something' )
			->get() );
	}

	public function test_part_capabilities_for_custom_can_canany_canall() {
		wp_set_current_user( 1 );

		app( 'VisualComposer\Modules\Access\CurrentUser\Access' )->part( 'something' )->setState( 'custom' );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->can()
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->can( 'something' )
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAny( 'something' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAny( 'something', 'something2' )
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAll( 'something' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAll( 'something', 'something2' )
			->get() );

		// what if I try to add capability to false state? It must be false anyway!- cannot set capability for false state
		app( 'VisualComposer\Modules\Access\CurrentUser\Access' )->part( 'something' )->setCapRule( 'something', true );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->can( 'something' )
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAny( 'something' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAny( 'something', 'something2' )
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAll( 'something' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAll( 'something', 'something2' )
			->get() );

		// For false
		app( 'VisualComposer\Modules\Access\CurrentUser\Access' )->part( 'something' )->setCapRule( 'something', false );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->can( 'something' )
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAny( 'something' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAny( 'something', 'something2' )
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAll( 'something' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAll( 'something2' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAll( 'something', 'something2' )
			->get() );


		// For multiple
		app( 'VisualComposer\Modules\Access\CurrentUser\Access' )->part( 'something' )->setCapRule( 'something', true );
		app( 'VisualComposer\Modules\Access\CurrentUser\Access' )->part( 'something' )->setCapRule( 'something2', true );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->can( 'something' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->can( 'something2' )
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAny( 'something' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAny( 'something2' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAny( 'something', 'something2' )
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAll( 'something' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAll( 'something2' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAll( 'something', 'something2' )
			->get() );

		// For multiple false
		app( 'VisualComposer\Modules\Access\CurrentUser\Access' )->part( 'something' )->setCapRule( 'something', false );
		app( 'VisualComposer\Modules\Access\CurrentUser\Access' )->part( 'something' )->setCapRule( 'something2', true );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->can( 'something' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->can( 'something2' )
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAny( 'something' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAny( 'something2' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAny( 'something', 'something2' )
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAll( 'something' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAll( 'something2' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something' )
			->canAll( 'something', 'something2' )
			->get() );
		//reset
		app( 'VisualComposer\Modules\Access\CurrentUser\Access' )->part( 'something' )->setState( null );
	}

	public function test_part_validation() {
		wp_set_current_user( 1 );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->setValidAccess( false )
			->part( 'something' )
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->checkAdminNonce( vc_generate_nonce( 'vc-admin-nonce' ) )
			->checkPublicNonce( vc_generate_nonce( 'vc-public-nonce' ) )
			->check(
				array(
					&$this,
					'_check'
				), true )
			->wpAny( 'edit_posts', 'edit_pages' )
			->wpAll( 'edit_posts', 'edit_pages' )
			->part( 'something' )
			->can()
			->canAny( 'something' )// in null it is always true
			->canAny( 'something', 'something2' )// in null it is always true
			->canAll( 'something' )// in null it is always true
			->canAll( 'something', 'something2' )// in null it is always true
			->checkState( null )
			->checkStateAny( 'custom', null )
			->get() );
	}

	public function test_shortcodes_capabilities() {
		wp_set_current_user( null );
		// user that not authorized must never can capabilities.
		$this->assertFalse( vc_user_access_check_shortcode_all( 'vc_row' ) );
		$this->assertFalse( vc_user_access_check_shortcode_all( 'vc_cta' ) );

		$this->assertFalse( vc_user_access_check_shortcode_edit( 'vc_row' ) );
		$this->assertFalse( vc_user_access_check_shortcode_edit( 'vc_cta' ) );

		
	}
}