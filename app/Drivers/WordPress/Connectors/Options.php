<?php

namespace App\Drivers\WordPress\Connectors;

use Illuminate\Contracts\Events\Dispatcher;

class Options {
	/** @var $app \Laravel\Lumen\Application */
	protected $app;

	/** @var $event \Illuminate\Events\Dispatcher */
	protected $event;

	public function __construct( Dispatcher $event ) {
		$this->app = app();
		$this->event = $event;

		$this->event->listen( 'driver:option:get', function ( $optionName, $default = false ) {
			return get_option( VC_V_PREFIX . $optionName, $default );
		} );

		$this->event->listen( 'driver:option:set', function ( $optionName, $value ) {
			update_option( VC_V_PREFIX . $optionName, $value );
		} );
	}
}