<?php

class VCV_Helpers {

	/**
	 * Same as built-in file_put_contents(), but creates directory if it doesn't exist
	 *
	 * @link http://php.net/manual/en/function.file-put-contents.php
	 *
	 * @param string $filename
	 * @param mixed $data
	 * @param int $flags
	 * @param resource $context
	 *
	 * @return int|bool
	 */
	public static function filePutContents( $filename, $data, $flags = 0, $context = null ) {
		$chunks = explode( '/', $filename );
		$file = array_pop( $chunks );
		$dir = '';
		foreach ( $chunks as $part ) {
			if ( ! is_dir( $dir .= '/' . $part ) ) {
				mkdir( $dir );
			}
		}

		return file_put_contents( $dir . '/' . $file, $data, $flags, $context );
	}

}
