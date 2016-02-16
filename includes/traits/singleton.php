<?php

namespace VcV\Traits;

use VcV\Composer\Loader;

trait Singleton {
	/**
	 * Core singleton class
	 * @var self - pattern realization
	 */
	private static $_instance = null;

	/**
	 * Get a singleton instance of class Core
	 * @return $this
	 */
	public static function getInstance() {
		if ( ! ( self::$_instance instanceof self ) ) {
			self::$_instance = new self();
			// To avoid constructor recursive call getInstance must use after new self() used.
			self::$_instance->bootstrapSubModules();
			self::$_instance->initialize();
		}

		return self::$_instance;
	}

	/**
	 * Construct is private to make singleton
	 */
	private function __construct() {
	}

	/**
	 * Cloning is forbidden
	 */
	private function __clone() {
		_doing_it_wrong( __FUNCTION__, __( 'Core class is singleton, use Core::getInstance()', 'vc5' ), '0.1' );
	}

	/**
	 * Serialization disabled
	 */
	private function __sleep() {
		_doing_it_wrong( __FUNCTION__, __( 'Core class is singleton, use Core::getInstance()', 'vc5' ), '0.1' );
	}

	/**
	 * Deserialization instances of this class is forbidden
	 */
	private function __wakeup() {
		_doing_it_wrong( __FUNCTION__, __( 'Core class is singleton, use Core::getInstance()', 'vc5' ), '0.1' );
	}

	/*
	 * __construct for singleton
	 * Initializes a Core object with base hooks
	 */
	private function initialize() {
	}

	private function bootstrapSubModules() {
		$file = Loader::getLoader()
		              ->findFile( dirname( __CLASS__ ) . '/bootstrap' );
		if ( file_exists( $file ) ) {
			require_once( $file );
		}
	}
}