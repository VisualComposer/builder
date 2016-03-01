<?php

namespace VisualComposer\Modules\Settings\Pages;

use VisualComposer\Helpers\WordPress\Actions;
use VisualComposer\Helpers\WordPress\Filters;
use VisualComposer\Modules\System\Container;

class License extends Container {

	/**
	 * @var string
	 */
	protected $pageSlug = 'vc-v-license';

	/**
	 * License constructor.
	 */
	public function __construct() {
		Filters::add( 'vc:v:settings:get_pages', function () {
			$args = func_get_args();

			return $this->call( 'addPage', $args );
		} );

		Actions::add( 'vc:v:settings:page_render:' . $this->pageSlug, function () {
			$args = func_get_args();
			$this->call( 'renderPage', $args );
		} );
	}

	/**
	 * @return string
	 */
	public function getPageSlug() {
		return $this->pageSlug;
	}

	/**
	 * @param array $pages
	 *
	 * @return array
	 */
	public function addPage( $pages ) {
		$pages[] = [
			'slug' => $this->pageSlug,
			'title' => __( 'Product License', 'vc5' )
		];

		return $pages;
	}

	public function renderPage() {
		$page = new Page();

		$page->setSlug( $this->pageSlug )
		     ->setTemplatePath( 'pages/license/index' )
		     ->render();
	}

}