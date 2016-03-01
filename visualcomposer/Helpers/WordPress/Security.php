<?php

namespace VisualComposer\Helpers\WordPress;

abstract class Security {
	/**
	 * Get param value from $_REQUEST if exists.
	 *
	 * @todo Use Lumen's Request instead
	 *
	 * @param string $param
	 * @param mixed $default
	 *
	 * @return null|string - null for undefined param.
	 */
	public static function requestParam( $param, $default = null ) {
		return isset( $_REQUEST[ $param ] ) ? $_REQUEST[ $param ] : $default;
	}

	/**
	 * If data is array, convert it to string
	 *
	 * @param mixed $data
	 *
	 * @return string
	 */
	private static function flattenData( $data ) {
		return is_array( $data ) ? implode( '|', $data ) : $data;
	}

	/**
	 * @param mixed $data
	 *
	 * @return string
	 */
	public static function generateNonce( $data ) {
		return wp_create_nonce( 'vc-nonce-' . self::flattenData( $data ) );
	}

	/**
	 * @param string $nonce
	 * @param mixed $data
	 *
	 * @return bool
	 */
	public static function verifyNonce( $nonce, $data ) {
		return (bool) wp_verify_nonce( $nonce, 'vc-nonce-' . self::flattenData( $data ) );
	}

	/**
	 * @param $nonce
	 *
	 * @return bool
	 */
	public static function verifyAdminNonce( $nonce = '' ) {
		$nonce = $nonce ? self::flattenData( $nonce ) : self::requestParam( '_vcnonce' );

		return (bool) vc_verify_nonce( $nonce, 'vc-admin-nonce' );
	}

	/**
	 * @param $nonce
	 *
	 * @return bool
	 */
	public static function verifyPublicNonce( $nonce = '' ) {
		$nonce = $nonce ? self::flattenData( $nonce ) : self::requestParam( '_vcnonce' );

		return (bool) vc_verify_nonce( $nonce, 'vc-public-nonce' );
	}
}