<?php

namespace VisualComposer\Modules\Access;

class RoleAccess extends Access {

	/**
	 * @var bool
	 */
	protected $roleName = false;

	/**
	 * @var array
	 */
	protected $parts = [];

	/**
	 * @param $part
	 *
	 * @return RoleAccessController
	 * @throws \Exception
	 */
	public function part( $part ) {
		$roleName = $this->getRoleName();

		if ( ! $roleName ) {
			throw new \Exception( 'roleName for vc_role_access is not set, please use ->who(roleName) method to set!' );
		}

		$key = $part . '_' . $roleName;

		if ( ! isset( $this->parts[ $key ] ) ) {
			$this->parts[ $key ] = new RoleAccessController( $part );
		}

		$roleAccessController = $this->parts[ $key ];
		$roleAccessController->setValidAccess( $this->getValidAccess() ); // send current status to upper level
		$this->setValidAccess( true ); // reset

		return $roleAccessController;
	}

	/**
	 * Set role to get access to data
	 *
	 * @param $roleName
	 *
	 * @return self
	 */
	public function who( $roleName ) {
		$this->roleName = $roleName;

		return $this;
	}

	/**
	 * @return null|string
	 */
	public function getRoleName() {
		return $this->roleName;
	}
}
