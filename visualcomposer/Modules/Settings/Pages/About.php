<?php

namespace VisualComposer\Modules\Settings\Pages;

use Illuminate\Http\Request;
use VisualComposer\Helpers\WordPress\Actions;
use VisualComposer\Helpers\WordPress\Filters;
use VisualComposer\Modules\System\Container;

class About extends Container {

	/**
	 * @var string
	 */
	private $pageSlug = 'vc-v-about';

	/**
	 * @var string
	 */
	private $defaultTabSlug = 'vc-v-main';

	/**
	 * @var array
	 */
	private $tabs;

	/**
	 * About constructor.
	 */
	public function __construct() {
		Filters::add( 'vc:v:settings:get_pages', function () {
			$args = func_get_args();

			return $this->call( 'addPage', $args );
		} );

		Actions::add( 'vc:v:settings:page_render:' . $this->getPageSlug(), function () {
			$args = func_get_args();
			$this->call( 'renderPage', $args );
		} );

		$this->tabs = apply_filters( 'vc:v:settings:page:about:tabs', [
			[
				'slug' => 'vc-v-main',
				'title' => __( 'What\'s New', 'vc5' ),
				'view' => 'pages/about/partials/main'
			],
			[
				'slug' => 'vc-v-faq',
				'title' => __( 'FAQ', 'vc5' ),
				'view' => 'pages/about/partials/faq'
			],
			[
				'slug' => 'vc-v-resources',
				'title' => __( 'Resources', 'vc5' ),
				'view' => 'pages/about/partials/resources'
			]
		] );
	}

	/**
	 * @return string
	 */
	public function getPageSlug() {
		return $this->pageSlug;
	}

	/**
	 * @return array
	 */
	public function getTabs() {
		return $this->tabs;
	}

	/**
	 * @param array $pages
	 *
	 * @return array
	 */
	public function addPage( $pages ) {
		$pages[] = [
			'slug' => $this->getPageSlug(),
			'title' => __( 'About', 'vc5' )
		];

		return $pages;
	}

	/**
	 * Render page
	 *
	 * @param Request $request
	 */
	public function renderPage( Request $request ) {
		$args = [
			'tabs' => $this->getTabs(),
			'pageSlug' => $this->getPageSlug(),
			'activeSlug' => $request->input( 'tab', $this->defaultTabSlug )
		];

		$page = new Page();

		$page->setSlug( $this->getPageSlug() )
			   ->setTemplatePath( 'pages/about/index' )
		     ->setTemplateArgs( $args )
		     ->render();
	}

}