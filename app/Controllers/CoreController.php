<?php

namespace App\Controllers;

use Illuminate\Contracts\Events\Dispatcher;

/**
 * Class CoreController
 * @package App\Controllers
 */
class CoreController {
	/**
	 * @var \Illuminate\Contracts\Events\Dispatcher
	 */
	protected $event;

	/**
	 * CoreController constructor.
	 *
	 * @param \Illuminate\Contracts\Events\Dispatcher $event
	 */
	public function __construct( Dispatcher $event ) {
		$this->event = $event;

		$this->event->listen( 'driver:init', [ $this, 'initHook' ] );
		$this->event->listen( 'driver:admin_init', [ $this, 'initHook' ] );
		$this->event->listen( 'driver:activation_hook', [
			$this,
			'activationHook',
		] );
		$this->event->listen( 'driver:deactivation_hook', [
			$this,
			'deactivationHook',
		] );

		$this->event->fire( 'vc:core:load' );
	}

	/**
	 * Core action for activation plugin
	 */
	public function activationHook() {
		$this->checkForUpdate();
		$this->setVersion();
		$this->event->fire( 'vc:core:activation' );
	}

	/**
	 * Core action for deactivation plugin
	 */
	public function deactivationHook() {
		$this->event->fire( 'vc:core:deactivation' );
	}

	/**
	 * Callback function on "init" action
	 * Loads plugin text domain
	 */
	public function initHook() {
		$this->event->fire( 'vc:core:init' );
	}

	/**
	 * Trigger system action admin_init
	 */
	public function adminInitHook() {
		$this->event->fire( 'vc:core:admin_init' );
	}

	/**
	 * Update database saved plugin version
	 */
	protected function setVersion() {
		$this->event->fire( 'driver:option:set', [ 'version', VC_V_VERSION ] );
	}

	/**
	 * Get saved in database plugin version
	 *
	 * @return string|false
	 */
	public function getVersion() {
		$responses = $this->event->fire( 'driver:option:get', [ 'version' ] );

		return last( $responses );
	}

	/**
	 * Core function on activation for check a database stored version
	 * Used in updates for database/rebuild settings and bc
	 */
	protected function checkForUpdate() {
		$oldVersion = $this->getVersion();
		$state = 0; // nothing needed
		if ( ! is_string( $oldVersion ) ) {
			// new installation
			$state = 1;
		} else if ( version_compare( $oldVersion, VC_V_VERSION ) !== 0 ) {
			// update/rebuild needed
			$state = 2;
		}
		/**
		 * Action for update db/files triggering
		 *
		 * @param $state - [0-version not changed, 1-new installation(no previous version found), 2-update]
		 * @param $oldVersion - old version in database
		 */
		$this->event->fire( 'vc:core:check_for_update', [
			$state,
			$oldVersion,
			VC_V_VERSION,
		] );
	}
}



