<?php

namespace VcV\Api\Helpers;

class RequestFactory {
	// Factory
	public static function request( $param, $default = null ) {
		return isset( $_REQUEST[ $param ] ) ? $_REQUEST[ $param ] : $default;
	}

	public static function get( $param, $default = null ) {
		return isset( $_GET[ $param ] ) ? $_GET[ $param ] : $default;
	}

	public static function post( $param, $default = null ) {
		return isset( $_POST[ $param ] ) ? $_POST[ $param ] : $default;
	}
}

class Request extends RequestFactory {

	public static function action() {
		$action = self::request( 'vc_v_action' ) || self::get( 'vc_v_action' ) || self::post( 'vc_v_action' );

		return $action;
	}
}