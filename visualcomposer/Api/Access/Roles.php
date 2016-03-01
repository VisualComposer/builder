<?php

namespace VisualComposer\Api\Access;

use VisualComposer\Modules\Access\Roles as RolesFactory;

class Roles {

	/**
	 * @todo Doctype
	 */
	public static function getAll() {
		$roles = RolesFactory::getInstance();
		$capabilities = [];
		foreach ( $roles->getParts() as $part ) {
			$partObj = UserAccess::getInstance()->part( $part );
			$capabilities[ $part ] = [
				'state' => $partObj->getState(),
				'state_key' => $partObj->getStateKey(),
				'capabilities' => $partObj->getAllCaps(),
			];
		}

		return $capabilities;
	}

}