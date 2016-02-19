<?php

namespace App\Api;

/**
 * Helper API methods related to make Url for plugin directory
 *
 * Class Url
 * @package App\Api
 */
class Url {
	/**
	 * Helper method assetUrl for plugin assets folder
	 *
	 * @param $path
	 *
	 * @return string
	 */
	public static function assetURL( $path ) {
		return self::url( 'assets/' . ltrim( $path, '\//' ) );
	}

	/**
	 * Url to whole plugin folder
	 *
	 * @param $path
	 *
	 * @return string
	 */
	public static function url( $path ) {
		return VC_V_PLUGIN_URL . ltrim( $path, '\//' );
	}
}