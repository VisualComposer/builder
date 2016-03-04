<?php

namespace VisualComposer\Modules\Settings;

use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Http\Request;
use VisualComposer\Helpers\Generic\Data;
use VisualComposer\Helpers\Generic\Templates;
use VisualComposer\Helpers\Generic\Url;
use VisualComposer\Modules\Access\CurrentUserAccess;
use VisualComposer\Modules\Settings\Pages\About;
use VisualComposer\Modules\Settings\Pages\General;
use VisualComposer\Modules\System\Container;

class SettingsController extends Container {

	private $pages = null;
	private $optionGroup = 'vc-v-settings';
	private $pageSlug = 'vc-v-settings';
	private $layout = 'default';

	/**
	 * SettingsController constructor.
	 *
	 * @param Dispatcher $event
	 */
	public function __construct( Dispatcher $event ) {
		add_action( 'admin_init', function () {
			$args = func_get_args();
			$this->call( 'initAdmin', $args );
		} );

		add_action( 'admin_menu', function () {
			$args = func_get_args();

			return $this->call( 'addMenuPage', $args );
		} );

		add_action( 'network_admin_menu', function () {
			$args = func_get_args();

			return $this->call( 'addMenuPage', $args );
		} );

		add_action( 'vc:v:settings:mainPage:menuPageBuild', function () {
			$args = func_get_args();
			$this->call( 'addSubmenuPages', $args );
		} );

		do_action( 'vc:v:settings:initialize' );
	}

	/**
	 * @return string
	 */
	public function getPageSlug() {
		return $this->pageSlug;
	}

	/**
	 * @return string
	 */
	public function getOptionGroup() {
		return $this->optionGroup;
	}

	/**
	 * @param string $layout
	 */
	public function setLayout( $layout ) {
		$this->layout = $layout;
	}

	/**
	 * Get main page slug
	 * This determines what page is opened when user clicks 'Visual Composer' in settings menu
	 * If user user has administrator privileges, 'General' page is opened, if not, 'About' is opened
	 *
	 * @return string
	 */
	public function getMainPageSlug( Request $request, CurrentUserAccess $currentUserAccess, About $aboutPage, General $generalPage ) {
		$hasAccess = ! $currentUserAccess->wpAny( 'manage_options' )->part( 'settings' )->can( $generalPage->getPageSlug() )->get()
		             || ( is_multisite()
		                  && ! is_main_site() );

		if ( $hasAccess ) {
			return $aboutPage->getPageSlug();
		} else {
			return $generalPage->getPageSlug();
		}
	}

	public function addMenuPage() {
		$slug = $this->call( 'getMainPageSlug' );
		$title = __( 'Visual Composer ', 'vc5' );

		$iconUrl = Url::assetUrl( 'images/logo/16x16.png' );

		add_menu_page( $title, $title, 'exist', $slug, null, $iconUrl, 76 );

		do_action( 'vc:v:settings:mainPage:menuPageBuild', $slug );
	}

	public function addSubmenuPages( CurrentUserAccess $currentUserAccess ) {
		if ( ! $currentUserAccess->wpAny( 'manage_options' )->get() ) {
			return;
		}

		$pages = $this->getPages();
		$parentSlug = $this->call( 'getMainPageSlug' );

		foreach ( $pages as $page ) {
			$hasAccess = $currentUserAccess->part( 'settings' )->can( $page['slug'] . '-tab' )->get();

			if ( $hasAccess ) {
				add_submenu_page( $parentSlug, $page['title'], $page['title'], 'manage_options', $page['slug'], function () {
					$args = func_get_args();
					$this->call( 'renderPage', $args );
				} );
			}
		}

		do_action( 'vc:v:settings:pageSettingsBuild' );
	}

	/**
	 * @param Request $request
	 */
	public function renderPage( Request $request ) {
		$pageSlug = $request->input( 'page' );

		ob_start();
		do_action( 'vc:v:settings:pageRender:' . $pageSlug, $pageSlug );
		$content = ob_get_clean();

		$layout = $this->layout;

		// pages can define different layout, by setting 'layout' key/value
		$pages = $this->getPages();
		$key = Data::arraySearch( $pages, 'slug', $pageSlug );
		if ( $key !== false && isset( $pages[ $key ]['layout'] ) ) {
			$layout = $pages[ $key ]['layout'];
		}

		Templates::render( 'settings/layouts/' . $layout, [
			'content' => $content,
			'tabs' => $this->getPages(),
			'activeSlug' => $pageSlug,
		] );
	}

	/**
	 * Init settings page
	 */
	public function initAdmin() {
		wp_register_script( VC_V_PREFIX . 'scripts-settings', Url::assetUrl( 'scripts/dist/settings.min.js' ), [ ], VC_V_VERSION, true );
		wp_enqueue_style( VC_V_PREFIX . 'styles-settings', Url::assetUrl( 'styles/dist/settings.min.css' ), false, VC_V_VERSION, false );
		wp_enqueue_script( VC_V_PREFIX . 'scripts-settings' );

		foreach ( $this->getPages() as $page ) {
			do_action( 'vc:v:settings:initAdmin:page:' . $page['slug'] );
		}

		do_action( 'vc:v:settings:initAdmin' );
	}

	/**
	 * @return mixed
	 */
	public function getPages() {
		if ( is_null( $this->pages ) ) {
			$this->pages = apply_filters( 'vc:v:settings:getPages', [ ] );
		}

		return $this->pages;
	}

	/**
	 * @param $page
	 * @param $title
	 * @param $callback
	 */
	public function addSection( $page, $title = null, $callback = null ) {
		if ( ! $callback ) {
			$callback = function () {
				$args = func_get_args();

				return $this->call( 'settingSectionCallbackFunction', $args );
			};
		}

		add_settings_section( $this->getOptionGroup() . '_' . $page, $title, $callback, $this->getPageSlug() . '_' . $page );
	}

	/**
	 * Create field in section.
	 *
	 * @param $page
	 * @param $title
	 * @param $fieldName
	 * @param $sanitizeCallback
	 * @param $fieldCallback
	 * @param array $args
	 *
	 * @return self
	 */
	public function addField( $page, $title, $fieldName, $sanitizeCallback = null, $fieldCallback = null, $args = [ ] ) {
		if ( ! $sanitizeCallback ) {
			$sanitizeCallback = function () {
				$args = func_get_args();

				return $this->call( 'addFieldSanitizeCallback', $args );
			};
		}

		if ( ! $fieldCallback ) {
			$fieldCallback = function () {
				$args = func_get_args();

				return $this->call( 'addFieldFieldCallback', $args );
			};
		}

		register_setting( $this->getOptionGroup() . '_' . $page, VC_V_PREFIX . $fieldName, $sanitizeCallback );
		add_settings_field( VC_V_PREFIX . $fieldName, $title, $fieldCallback, $this->getPageSlug() . '_' . $page, $this->getOptionGroup() . '_' . $page, $args );

		return $this;
	}

	/**
	 * Callback function for settings section
	 *
	 * @param string $section
	 *
	 * @return string
	 */
	public function settingSectionCallbackFunction( $section ) {
		return $section;
	}

	/**
	 * Callback function for addField sanitize
	 *
	 * @param mixed $value
	 *
	 * @return mixed
	 */
	public function addFieldSanitizeCallback( $value ) {
		return $value;
	}

	/**
	 * Callback function for addField field
	 *
	 * @param mixed $value
	 *
	 * @return mixed
	 */
	public function addFieldFieldCallback( $value ) {
		return $value;
	}

}
