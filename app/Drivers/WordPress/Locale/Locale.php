<?php

namespace App\Drivers\WordPress\Locale;

use Illuminate\Contracts\Events\Dispatcher;

class Locale {
	protected $locale;
	protected $event;

	public function __construct( Dispatcher $event ) {
		$this->locale = [
			'edit_with_vc' => __( 'Edit with VC 5', 'vc5' ),
		];

		$this->event = $event;
		$this->event->listen( 'driver:locale:get', [ $this, 'get' ] );
	}

	public function get( $key ) {
		return $this->locale[ $key ] ?: false;
	}
}