<?php

namespace VcV\Composer;
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

require 'loaderHelper.php';

class Loader {
	private static $loader;

	public static function getLoader() {
		if ( null !== self::$loader ) {
			return self::$loader;
		}
		self::$loader = $loader = new LoaderHelper();
		$loader->register( true );

		return $loader;
	}
}

return Loader::getLoader();