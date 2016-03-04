<?php

namespace VisualComposer\Modules\Settings\Pages;

use VisualComposer\Modules\System\Container;

class License extends Container {
	use Page;
	/**
	 * @var string
	 */
	protected $pageSlug = 'vc-v-license';

	/**
	 * License constructor.
	 */
	public function __construct() {
		add_filter( 'vc:v:settings:getPages', function () {
			$args = func_get_args();

			return $this->call( 'addPage', $args );
		} );

		add_action( 'vc:v:settings:pageRender:' . $this->pageSlug, function () {
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
			'title' => __( 'Product License', 'vc5' ),
		];

		return $pages;
	}

	public function renderPage() {
		$this->setSlug( $this->pageSlug )->setTemplatePath( 'settings/pages/license/index' )->render();
	}

}