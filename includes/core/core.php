<?php

namespace VcV\Core;

use VcV\Traits\Singleton;

final class Core {
	use Singleton;

	/*
	 * __construct for singleton
	 * @overwrite Singleton::initialize
	 *
	 * Initializes a Core object with base hooks
	 */
	private function initialize() {
		register_activation_hook( VC_V_PLUGIN_FULL_PATH, [
			$this,
			'activationHook',
		] );
		register_deactivation_hook( VC_V_PLUGIN_FULL_PATH, [
			$this,
			'deactivationHook',
		] );

		add_action( 'init', [ $this, 'initHook' ] );
		add_action( 'admin_init', [ $this, 'adminInitHook' ] );
		/**
		 * Core action on initialized initialize
		 */
		do_action( 'vc:v:core:load' );
	}

	/**
	 * Core action for activation plugin
	 */
	public function activationHook() {
		$this->checkForUpdate();
		$this->setVersion();
		/**
		 * Action for activation process
		 */
		do_action( 'vc:v:core:activation' );
	}

	/**
	 * Core action for deactivation plugin
	 */
	public function deactivationHook() {
		/**
		 * Action for deactivation process
		 */
		do_action( 'vc:v:core:deactivation' );
	}

	/**
	 * WordPress callback function on "init" action
	 * Loads plugin text domain
	 */
	public function initHook() {
		load_plugin_textdomain( 'vc_v_composer', false, VC_V_PLUGIN_DIRNAME . '/languages' );

		/**
		 * Action when wordpress 'init' called and plugins loaded
		 */
		do_action( 'vc:v:core:init' );
	}

	public function adminInitHook() {
		/**
		 * Action when wordpress 'init' called and plugins loaded
		 */
		do_action( 'vc:v:core:admin_init' );
	}

	/**
	 * Update database saved plugin version
	 */
	public function setVersion() {
		update_option( 'vc_v_version', VC_V_VERSION );
	}

	/**
	 * Get saved in database plugin version
	 *
	 * @return string|false
	 */
	public function getVersion() {
		return get_option( 'vc_v_version' );
	}

	/**
	 * Core function on activation for check a database stored version
	 * Used in updates for database/rebuild settings and bc
	 */
	public function checkForUpdate() {
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
		do_action( 'vc:v:core:check_for_update', $state, $oldVersion, VC_V_VERSION );
	}
}



