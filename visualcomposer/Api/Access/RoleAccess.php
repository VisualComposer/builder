<?php

namespace VisualComposer\Api\Access;

use VisualComposer\Modules\Access\RoleAccess as RoleAccessFactory;

class RoleAccess {
	/**
	 * @return RoleAccessFactory
	 */
	public static function getInstance() {
		return RoleAccessFactory::getInstance();
	}
}