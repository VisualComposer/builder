<?php

namespace App\Drivers\WordPress\Controllers;

use Illuminate\Contracts\Events\Dispatcher;

class PageFrontControllerDriver {

	protected $event;

	public function __construct( Dispatcher $event ) {
		$this->event = $event;

		add_action( 'wp_head', function () {
			$this->event->fire( 'driver:head' );
		} );

		add_action( 'wp_enqueue_scripts', function () {
			wp_enqueue_script( 'jquery' );
		} );

		add_filter( 'edit_post_link', function ( $link ) {
			$result = last( $this->event->fire( 'driver:edit_post_link', [ $link, get_the_ID() ] ) );

			return $result ?: $link;
		} );

		$this->event->listen('vc:page_front:output_scripts:get_ajax_url',function(){
			return admin_url( 'admin-ajax.php', 'relative' );
		});
	}

}