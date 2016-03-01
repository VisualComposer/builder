<?php

namespace VisualComposer\Modules\Access;

class CurrentUserAccessController extends RoleAccessController {

	/**
	 * Get capability for current user
	 *
	 * @param $rule
	 *
	 * @return bool
	 */
	public function getCapRule( $rule ) {
		$roleRule = $this->getStateKey() . '/' . $rule;

		return current_user_can( $roleRule );
	}

	/**
	 * Add capability to role
	 *
	 * @param $rule
	 * @param bool $value
	 */
	public function setCapRule( $rule, $value = true ) {
		$roleRule = $this->getStateKey() . '/' . $rule;

		wp_get_current_user()->add_cap( $roleRule, $value );
	}

	/**
	 * @return mixed
	 */
	public function getRole() {
		if ( ! $this->roleName && function_exists( 'wp_get_current_user' ) ) {
			$user = wp_get_current_user();
			$userRoles = array_intersect( array_values( $user->roles ), array_keys( get_editable_roles() ) );
			$this->roleName = reset( $userRoles );
			$this->role = get_role( $this->roleName );
		}

		return $this->role;
	}
}
