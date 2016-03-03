<?php

namespace VisualComposer\Modules\Settings\Pages;

use VisualComposer\Helpers\Generic\Templates;
use VisualComposer\Helpers\Generic\Todo;
use VisualComposer\Helpers\WordPress\Options;
use VisualComposer\Modules\Settings\SettingsController;
use VisualComposer\Modules\System\Container;

class General extends Container {

	/**
	 * @var string
	 */
	private $pageSlug = 'vc-v-general';

	/**
	 * @var array
	 */
	private $googleFontsSubsetsExcluded = [ ];

	/**
	 * @var array
	 */
	private $googleFontsSubsets = [
		'latin',
		'vietnamese',
		'cyrillic',
		'latin-ext',
		'greek',
		'cyrillic-ext',
		'greek-ext',
	];

	/**
	 * General constructor.
	 */
	public function __construct() {
		add_filter( 'vc:v:settings:get_pages', function () {
			$args = func_get_args();

			return $this->call( 'addPage', $args );
		} );

		add_action( 'vc:v:settings:page_render:' . $this->pageSlug, function () {
			$args = func_get_args();
			$this->call( 'renderPage', $args );
		} );

		add_action( 'vc:v:settings:init_admin:page:' . $this->pageSlug, function () {
			$args = func_get_args();
			$this->call( 'buildPage', $args );
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
			'title' => __( 'General Settings', 'vc5' )
		];

		return $pages;
	}

	/**
	 * Page: General Settings
	 *
	 * @param SettingsController $SettingsController
	 */
	public function buildPage( SettingsController $SettingsController ) {
		$page = $this->pageSlug;

		$SettingsController->addSection( $page );

		// Disable responsive content elements

		$fieldCallback = function () {
			$args = func_get_args();
			$this->call( 'disableResponsiveFieldCallback', $args );
		};

		$SettingsController->addField( $page, __( 'Disable responsive content elements', 'vc5' ), 'not_responsive_css', null, $fieldCallback );

		// Google fonts subsets

		$sanitizeCallback = function () {
			$args = func_get_args();
			$this->call( 'sanitizeGoogleFontsSubsetsFieldCallback', $args );
		};

		$fieldCallback = function () {
			$args = func_get_args();
			$this->call( 'googleFontsSubsetsFieldCallback', $args );
		};

		$SettingsController->addField( $page, __( 'Google fonts subsets', 'vc5' ), 'google_fonts_subsets', $sanitizeCallback, $fieldCallback );

		// Guide tours

		$fieldCallback = function () {
			$args = func_get_args();
			$this->call( 'guideToursFieldCallback', $args );
		};

		$SettingsController->addField( $page, __( 'Guide tours', 'vc5' ), 'reset_guide_tours', null, $fieldCallback );
	}

	/**
	 * Render page
	 */
	public function renderPage() {
		$page = new Page();

		$page->setSlug( $this->pageSlug )
		     ->setTemplatePath( 'pages/general/index' )
		     ->render();
	}

	/**
	 * @return array
	 */
	public function getGoogleFontsSubsetsExcluded() {
		return $this->googleFontsSubsetsExcluded;
	}

	/**
	 * @param $excluded
	 *
	 * @return bool
	 */
	public function setGoogleFontsSubsetsExcluded( $excluded ) {
		if ( is_array( $excluded ) ) {
			$this->googleFontsSubsetsExcluded = $excluded;

			return true;
		}

		return false;
	}

	/**
	 * @return array
	 */
	public function getGoogleFontsSubsets() {
		return $this->googleFontsSubsets;
	}

	/**
	 * Not responsive checkbox callback function
	 */
	public function disableResponsiveFieldCallback() {
		$checked = Options::get( 'not_responsive_css', false );

		Templates::render( 'pages/general/partials/disable-responsive', [
			'checked' => $checked
		] );
	}

	/**
	 * @param array $subsetsToSanitize
	 *
	 * @return array
	 */
	public function sanitizeGoogleFontsSubsetsFieldCallback( $subsetsToSanitize ) {
		$sanitized = [ ];

		if ( isset( $subsetsToSanitize ) && is_array( $subsetsToSanitize ) ) {
			$excluded = $this->getGoogleFontsSubsetsExcluded();
			$subsets = $this->getGoogleFontsSubsets();

			foreach ( $subsetsToSanitize as $subset ) {
				if ( ! in_array( $subset, $excluded ) && in_array( $subset, $subsets ) ) {
					$sanitized[] = $subset;
				}
			}
		}

		return $sanitized;
	}

	/**
	 * Google fonts subsets callback
	 */
	public function googleFontsSubsetsFieldCallback() {
		$checkedSubsets = Options::get( 'google_fonts_subsets', $this->getGoogleFontsSubsets() );

		$excluded = $this->getGoogleFontsSubsetsExcluded();
		$subsets = [ ];

		foreach ( $this->getGoogleFontsSubsets() as $subset ) {
			if ( in_array( $subset, $excluded ) ) {
				continue;
			}

			$subsets[] = [
				'title' => $subset,
				'checked' => in_array( $subset, $checkedSubsets )
			];
		}

		Templates::render( 'pages/general/partials/google-fonts-subsets', [
			'subsets' => $subsets
		] );
	}

	/**
	 * Guide tours callback
	 */
	public function guideToursFieldCallback() {
		if ( ! Todo::pointersAreDismissed() ) {
			return;
		}

		Templates::render( 'pages/general/partials/guide-tours' );
	}

}