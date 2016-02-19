<?php

namespace App\Drivers\WordPress\Connectors;

use Illuminate\Contracts\Events\Dispatcher;

/**
 * Class File
 * @package App\Drivers\WordPress\Connectors
 */
class File {
	/**
	 * @var \Illuminate\Contracts\Events\Dispatcher
	 */
	protected $event;

	/**
	 * File constructor.
	 *
	 * @param \Illuminate\Contracts\Events\Dispatcher $event
	 */
	public function __construct( Dispatcher $event ) {
		$this->event = $event;

		$this->event->listen( 'driver:file:get_contents', function ( $filePath ) {
			return file_get_contents( $filePath );
		} );

		$this->event->listen( 'driver:file:set_contents', function ( $filePath, $contents ) {
			return file_put_contents( $filePath, $contents );
		} );
	}
}