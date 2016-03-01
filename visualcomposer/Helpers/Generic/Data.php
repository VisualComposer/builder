<?php

namespace VisualComposer\Helpers\Generic;

/**
 * Helper methods related to data manipulation
 */
abstract class Data {
	/**
	 * @todo Doctype
	 */
	public static function arraySearch( $array, $column, $value ) {
		if ( function_exists( 'array_column' ) ) {
			// PHP 5.5
			return array_search( $value, array_column( $array, $column ) );
		}
		if ( ! is_array( $array ) ) {
			return false;
		}
		foreach ( $array as $key => $value ) {
			$exists = isset( $array[ $key ][ $column ] ) && $array[ $key ][ $column ] == $value;
			if ( $exists ) {
				return $key;
			}
		}

		return false;
	}

	/**
	 * @todo Doctype
	 */
	public static function arraySearchKey( $array, $column ) {
		if ( ! is_array( $array ) ) {
			return false;
		}
		foreach ( $array as $key => $value ) {
			$exists = isset( $array[ $key ][ $column ] );
			if ( $exists ) {
				return $exists;
			}
		}

		return false;
	}
}