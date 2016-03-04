<?php

namespace VisualComposer\Helpers\WordPress;

abstract class File {
	/**
	 * @param $filePath
	 *
	 * @return mixed
	 */
	public static function getContents( $filePath ) {
		return file_get_contents( $filePath );
	}

	/**
	 * @param $filePath
	 * @param $contents
	 *
	 * @return mixed
	 */
	public static function setContents( $filePath, $contents ) {
		return file_put_contents( $filePath, $contents );
	}
}