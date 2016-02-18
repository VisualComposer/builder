<?php

namespace App\Drivers\WordPress\Connectors;

use Illuminate\Contracts\Events\Dispatcher;

class File {
	/** @var $app \Laravel\Lumen\Application */
	protected $app;

	/** @var $event \Illuminate\Events\Dispatcher */
	protected $event;

	public function __construct( Dispatcher $event ) {
		$this->app = app();
		$this->event = $event;

		$this->event->listen( 'driver:file:get_contents', function ( $filePath ) {
			return file_get_contents( $filePath );
		} );

		$this->event->listen( 'driver:file:set_contents', function ( $filePath, $contents ) {
			return file_put_contents( $filePath, $contents );
		} );
	}

}