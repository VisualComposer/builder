<?php

namespace VisualComposer\Modules\Access;

class CurrentUserAccess extends RoleAccess {

	/**
	 * @param $part
	 *
	 * @return CurrentUserAccessController
	 */
	public function part( $part ) {
		if ( ! isset( $this->parts[ $part ] ) ) {
			$this->parts[ $part ] = new CurrentUserAccessController( $part );
		}

		/**
		 * @var CurrentUserAccessController
		 */
		$userAccessController = $this->parts[ $part ];

		// we also check for user "logged_in" status
		$isUserLoggedIn = function_exists( 'is_user_logged_in' ) && is_user_logged_in(); // @todo fix this issue: this should never happen. add action plugins_loaded pluggable.php!!
		$userAccessController->setValidAccess( $isUserLoggedIn && $this->getValidAccess() ); // send current status to upper level
		$this->setValidAccess( true ); // reset

		return $userAccessController;
	}

	public function wpMulti( $callback, $valid, $argsList ) {
		if ( $this->getValidAccess() ) {
			$access = ! $valid;
			foreach ( $argsList as &$args ) {
				if ( ! is_array( $args ) ) {
					$args = [ $args ];
				}
				array_unshift( $args, 'current_user_can' );
				$this->setValidAccess( true );
				call_user_func_array( $callback, $args );
				if ( $valid === $this->getValidAccess() ) {
					$access = $valid;
					break;
				}
			}
			$this->setValidAccess( $access );
		}

		return $this;
	}

	/**
	 * Check Wordpress capability. Should be valid one cap at least
	 *
	 * @return CurrentUserAccess
	 */
	public function wpAny() {
		if ( $this->getValidAccess() ) {
			$args = func_get_args();
			$this->wpMulti( [ $this, 'check' ], true, $args );
		}

		return $this;
	}

	/**
	 * Check Wordpress capability. Should be valid all caps
	 *
	 * @return CurrentUserAccess
	 */
	public function wpAll() {
		if ( $this->getValidAccess() ) {
			$args = func_get_args();
			$this->wpMulti( [ $this, 'check' ], false, $args );
		}

		return $this;
	}
}
