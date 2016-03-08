<?php

namespace VisualComposer\Helpers\Generic;

/**
 * Helper API methods related to make Url for plugin directory
 */
abstract class Url {
	/**
	 * Helper method assetUrl for plugin assets folder
	 *
	 * @param $path
	 *
	 * @return string
	 */
	public static function assetUrl( $path ) {
		return self::to( 'visualcomposer/resources/' . ltrim( $path, '\//' ) );
	}

	/**
	 * Url to whole plugin folder
	 *
	 * @param $path
	 *
	 * @return string
	 */
	public static function to( $path ) {
		return VC_V_PLUGIN_URL . ltrim( $path, '\//' );
	}

	/**
	 * Url to whole plugin folder
	 *
	 * @param $query
	 *
	 * @return string
	 */
	public static function ajax( $query = [ ] ) {
		return self::to( sprintf( 'visualcomposer/Modules/System/Loader.php?%s', http_build_query( $query ) ) );
	}
}