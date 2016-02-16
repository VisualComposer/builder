<?php

namespace VcV\Api\Helpers;

class Url {
	public static function assetURL( $path ) {
		return self::url( 'assets/' . ltrim( $path, '\//' ) );
	}

	public static function url( $path ) {
		return VC_V_PLUGIN_URL . ltrim( $path, '\//' );
	}
}