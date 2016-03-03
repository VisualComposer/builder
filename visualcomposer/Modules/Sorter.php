<?php

namespace VisualComposer\Modules;

if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

/**
 * Sort array values by key, default key is 'weight'
 * Used in uasort() function.
 * For fix equal weight problem used $this->data array_search
 */
class Sorter {

	/**
	 * @var array $data - sorting data
	 */
	protected $data = [];

	/**
	 * @var string $key - key for search
	 */
	protected $key = 'weight';

	/**
	 * @param array $data Data to sort
	 */
	public function __construct( $data ) {
		$this->data = $data;
	}

	/**
	 * Used to change/set data to sort
	 *
	 * @param array $data
	 */
	public function setData( $data ) {
		$this->data = $data;
	}

	/**
	 * Sort $this->data by user key, used in class-vc-mapper.
	 * If keys are equals it SAVES a position in array (index).
	 *
	 *
	 * @param string $key
	 *
	 * @return array Sorted array
	 */
	public function sortByKey( $key = 'weight' ) {
		$this->key = $key;

		uasort( $this->data, array( &$this, '_key' ) );

		return $this->data;
	}

	/**
	 * Sorting by key callable for usort function
	 *
	 * @param mixed $a Compare value
	 * @param mixed $b Compare value
	 *
	 * @return int
	 */
	private function _key( $a, $b ) {
		$aWeight = isset( $a[ $this->key ] ) ? (int) $a[ $this->key ] : 0;
		$bWeight = isset( $b[ $this->key ] ) ? (int) $b[ $this->key ] : 0;
		// To save real-ordering
		if ( $aWeight == $bWeight ) {
			$cmpA = array_search( $a, $this->data );
			$cmpB = array_search( $b, $this->data );

			return $cmpA - $cmpB;
		}

		return $bWeight - $aWeight;
	}

	/**
	 * @return array Sorting data
	 */
	public function getData() {
		return $this->data;
	}
}
