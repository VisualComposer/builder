<?php

class VcAccessRolesUsersTest extends WP_UnitTestCase {

	public function _check( $value ) {
		// used in next test
		return (bool) $value;
	}

	public function test_part_capabilities() {
		wp_set_current_user( 1 );

		// un existed
		// same for user_access
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->can()
			->get() );

		// exact capability. un existed. same for users
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->can( 'something_role_users' )
			->get() );

		// false state = disabled
		app( 'VisualComposer\Modules\Access\Role\Access' )
			->who( 'administrator' )
			->part( 'something_role_users' )
			->setState( false );
		// false also for users ( because role contains users )
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->can()
			->get( true ) );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users', true )
			->can( 'something_role_users' )
			->get() );

		app( 'VisualComposer\Modules\Access\Role\Access' )
			->who( 'administrator' )
			->part( 'something_role_users', true )
			->setState( 'custom' );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users', true )
			->can()
			->get( true ) );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->can( 'something_role_users' )
			->get( true ) );

		// reset:
		app( 'VisualComposer\Modules\Access\Role\Access' )
			->who( 'administrator' )
			->part( 'something_role_users' )
			->setState( null );

	}

	public function test_part_capabilities_for_empty_can_canany_canall() {
		wp_set_current_user( 1 );

		// for state=null any cap is true
		app( 'VisualComposer\Modules\Access\Role\Access' )
			->who( 'administrator' )
			->part( 'something_role_users' )
			->setCapRule( 'something_role_users', true );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->can( 'something_role_users' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->canAny( 'something_role_users' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->canAny( 'something_role_users', 'something_role_users2' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->canAll( 'something_role_users' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->canAll( 'something_role_users', 'something_role_users2' )
			->get() );

		// for state=null any cap is true
		app( 'VisualComposer\Modules\Access\Role\Access' )
			->who( 'administrator' )
			->part( 'something_role_users' )
			->setCapRule( 'something_role_users', false );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->can( 'something_role_users' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->canAny( 'something_role_users' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->canAny( 'something_role_users', 'something_role_users2' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->canAll( 'something_role_users' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->canAll( 'something_role_users', 'something_role_users2' )
			->get() );
	}

	public function test_part_capabilities_for_disabled_can_canany_canall() {
		wp_set_current_user( 1 );

		app( 'VisualComposer\Modules\Access\Role\Access' )
			->who( 'administrator' )
			->part( 'something_role_users' )
			->setState( false );
		// always false..
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->can()
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->can( 'something_role_users' )
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->canAny( 'something_role_users' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->canAny( 'something_role_users', 'something_role_users2' )
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->canAll( 'something_role_users' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->canAll( 'something_role_users', 'something_role_users2' )
			->get() );

		// what if I try to add capability to false state? It must be false anyway!- cannot set capability for false state
		app( 'VisualComposer\Modules\Access\Role\Access' )
			->who( 'administrator' )
			->part( 'something_role_users' )
			->setCapRule( 'something_role_users', true );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->can( 'something_role_users' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->canAny( 'something_role_users' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->canAny( 'something_role_users', 'something_role_users2' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->canAll( 'something_role_users' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->canAll( 'something_role_users', 'something_role_users2' )
			->get() );

		app( 'VisualComposer\Modules\Access\Role\Access' )
			->who( 'administrator' )
			->part( 'something_role_users' )
			->setCapRule( 'something_role_users', false );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->can( 'something_role_users' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->canAny( 'something_role_users' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->canAny( 'something_role_users', 'something_role_users2' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->canAll( 'something_role_users' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->canAll( 'something_role_users', 'something_role_users2' )
			->get() );
	}

	public function test_part_capabilities_for_custom_can_canany_canall() {
		wp_set_current_user( 1 );
		app( 'VisualComposer\Modules\Access\Role\Access' )
			->who( 'administrator' )
			->part( 'something_role_users' )
			->setState( 'custom' );

		$this->assertEquals( 'custom',
			app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
				->part( 'something_role_users', true )
				->getState() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users', true )
			->can()
			->get( true ) );

		wp_set_current_user( null );
		wp_set_current_user( 1 ); // this will reset user capabilities and get latests from user role
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->can( 'something_role_users' )
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->canAny( 'something_role_users' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->canAny( 'something_role_users', 'something_role_users2' )
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->canAll( 'something_role_users' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users' )
			->canAll( 'something_role_users', 'something_role_users2' )
			->get() );

		// what if I try to add capability to false state? It must be false anyway!- cannot set capability for false state
		app( 'VisualComposer\Modules\Access\Role\Access' )
			->who( 'administrator' )
			->part( 'something_role_users' )
			->setCapRule( 'something_role_users', true );

		wp_set_current_user( null );
		wp_set_current_user( 1 ); // this will reset user capabilities and get latests from user role
		$this->assertEquals( 'administrator',
			app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
				->part( 'something_role_users', true )
				->getRoleName() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users', true )
			->can( 'something_role_users' )
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users', true )
			->canAny( 'something_role_users' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users', true )
			->canAny( 'something_role_users', 'something_role_users2' )
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users', true )
			->canAll( 'something_role_users' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users', true )
			->canAll( 'something_role_users', 'something_role_users2' )
			->get() );

		// For false
		app( 'VisualComposer\Modules\Access\Role\Access' )
			->who( 'administrator' )
			->part( 'something_role_users', true )
			->setCapRule( 'something_role_users', false );

		wp_set_current_user( null );
		wp_set_current_user( 1 ); // this will reset user capabilities and get latests from user role
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users', true )
			->can( 'something_role_users' )
			->get( true ) );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users', true )
			->canAny( 'something_role_users' )
			->get( true ) );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users', true )
			->canAny( 'something_role_users', 'something_role_users2' )
			->get( true ) );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users', true )
			->canAll( 'something_role_users' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users', true )
			->canAll( 'something_role_users2' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users', true )
			->canAll( 'something_role_users', 'something_role_users2' )
			->get() );

		// For multiple
		app( 'VisualComposer\Modules\Access\Role\Access' )
			->who( 'administrator' )
			->part( 'something_role_users', true )
			->setCapRule( 'something_role_users', true );
		app( 'VisualComposer\Modules\Access\Role\Access' )
			->who( 'administrator' )
			->part( 'something_role_users', true )
			->setCapRule( 'something_role_users2', true );

		wp_set_current_user( null );
		wp_set_current_user( 1 ); // this will reset user capabilities and get latests from user role
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users', true )
			->can( 'something_role_users' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users', true )
			->can( 'something_role_users2' )
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users', true )
			->canAny( 'something_role_users' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users', true )
			->canAny( 'something_role_users2' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users', true )
			->canAny( 'something_role_users', 'something_role_users2' )
			->get() );

		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users', true )
			->canAll( 'something_role_users' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users', true )
			->canAll( 'something_role_users2' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users', true )
			->canAll( 'something_role_users', 'something_role_users2' )
			->get() );

		// For multiple false
		app( 'VisualComposer\Modules\Access\Role\Access' )
			->who( 'administrator' )
			->part( 'something_role_users', true )
			->setCapRule( 'something_role_users', false );
		app( 'VisualComposer\Modules\Access\Role\Access' )
			->who( 'administrator' )
			->part( 'something_role_users', true )
			->setCapRule( 'something_role_users2', true );

		wp_set_current_user( null );
		wp_set_current_user( 1 ); // this will reset user capabilities and get latests from user role
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users', true )
			->can( 'something_role_users' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users', true )
			->can( 'something_role_users2' )
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users', true )
			->canAny( 'something_role_users' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users', true )
			->canAny( 'something_role_users2' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users', true )
			->canAny( 'something_role_users', 'something_role_users2' )
			->get() );

		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users', true )
			->canAll( 'something_role_users' )
			->get() );
		$this->assertTrue( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users', true )
			->canAll( 'something_role_users2' )
			->get() );
		$this->assertFalse( app( 'VisualComposer\Modules\Access\CurrentUser\Access' )
			->part( 'something_role_users', true )
			->canAll( 'something_role_users', 'something_role_users2' )
			->get() );
		//reset
		app( 'VisualComposer\Modules\Access\Role\Access' )
			->who( 'administrator' )
			->part( 'something_role_users', true )
			->setState( null );
	}

}