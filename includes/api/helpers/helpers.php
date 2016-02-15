<?php

namespace VcV\Api\Helpers;

class Helpers {
	public static function filePutContents( $filename, $data, $flags = 0, $context = null ) {
		$filename = str_replace( '\\', '/', $filename );
		$chunks = explode( '/', $filename );
		$file = array_pop( $chunks );
		$dir = [ ];
		// Recursively make folders
		foreach ( $chunks as $part ) {
			$dir[] = $part;
			$path = implode( '/', $dir );
			if ( ! is_dir( $path ) ) {
				mkdir( $path );
			}
		}
		$path = implode( '/', $dir );

		return file_put_contents( $path . '/' . $file, $data, $flags, $context );
	}
}