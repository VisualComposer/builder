<?php

namespace VisualComposer\Modules\Access;

abstract class Access {

	/**
	 * @var bool
	 */
	protected $validAccess = true;

	public function getValidAccess() {
		return $this->validAccess;
	}

	/**
	 * @param mixed $validAccess
	 *
	 * @return self
	 */
	public function setValidAccess( $validAccess ) {
		$this->validAccess = $validAccess;

		return $this;
	}

	/**
	 * Check multi access settings by method inside class object
	 *
	 * @param $callback callable
	 * @param $valid
	 * @param $argsList
	 *
	 * @return self
	 */
	public function checkMulti( $callback, $valid, $argsList ) {
		if ( $this->getValidAccess() ) {
			$access = ! $valid;
			foreach ( $argsList as $args ) {
				if ( ! is_array( $args ) ) {
					$args = [ $args ];
				}
				$this->setValidAccess( true );
				app()->call( $callback, $args );
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
	 * Get current validation state and reset it to true. ( should be never called twice )
	 *
	 * @return bool
	 */
	public function get() {
		$result = $this->getValidAccess();
		$this->setValidAccess( true );

		return $result;
	}

	/**
	 * Call die() function with message if access is invalid
	 *
	 * @param string $message
	 *
	 * @return self
	 * @throws \Exception
	 */
	public function validateDie( $message = '' ) {
		$result = $this->getValidAccess();
		$this->setValidAccess( true );
		if ( ! $result ) {
			if ( defined( 'VC_V_DIE_EXCEPTION' ) && VC_V_DIE_EXCEPTION ) {
				throw new \Exception( $message );
			} else {
				die( $message );
			}
		}

		return $this;
	}

	/**
	 * @param $func
	 *
	 * @return self
	 */
	public function check( $func ) {
		if ( $this->getValidAccess() ) {
			$args = func_get_args();
			$args = array_slice( $args, 1 );
			$this->setValidAccess( call_user_func_array( $func, $args ) );
		}

		return $this;
	}

	/**
	 * Any of provided rules should be valid
	 * Usage: checkAny(
	 *      'vc_verify_admin_nonce',
	 *      [ 'current_user_can', 'edit_post', 12 ],
	 *      [ 'current_user_can', 'edit_posts' ],
	 * )
	 *
	 * @return self
	 */
	public function checkAny() {
		if ( $this->getValidAccess() ) {
			$args = func_get_args();
			$this->checkMulti( [ $this, 'check' ], true, $args );
		}

		return $this;
	}

	/**
	 * All provided rules should be valid
	 * Usage: checkAll(
	 *      'vc_verify_admin_nonce',
	 *      [ 'current_user_can', 'edit_post', 12 ],
	 *      [ 'current_user_can', 'edit_posts' ],
	 * )
	 * @return self
	 */
	public function checkAll() {
		if ( $this->getValidAccess() ) {
			$args = func_get_args();
			$this->checkMulti( [ $this, 'check' ], false, $args );
		}

		return $this;
	}

	/**
	 * @param string $nonce
	 *
	 * @return $this
	 */
	public function checkAdminNonce( $nonce = '' ) {
		return $this->check( [ 'Nonce', 'verifyAdmin' ], $nonce );
	}

	/**
	 * @param string $nonce
	 *
	 * @return $this
	 */
	public function checkPublicNonce( $nonce = '' ) {
		return $this->check( [ 'Nonce', 'verifyUser' ], $nonce );
	}
}
