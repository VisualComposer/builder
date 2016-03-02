<?php

namespace VisualComposer\Modules\Settings;

use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Http\Request;
use VisualComposer\Helpers\Generic\Templates;
use VisualComposer\Helpers\Generic\Url;
use VisualComposer\Helpers\WordPress\Actions;
use VisualComposer\Modules\System\Container;

class SettingsController extends Container {

	private $pages = null;
	private $fieldPrefix = 'vc_v_';
	private $optionGroup = 'vc_v_composer_settings';
	private $pageSlug = 'vc-v-settings';

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
	 * SettingsController constructor.
	 *
	 * @param Dispatcher $event
	 */
	public function __construct( Dispatcher $event ) {
		Actions::add( 'admin_init', function () {
			$args = func_get_args();
			$this->call( 'initAdmin', $args );
		} );

		Actions::add( 'admin_menu', function () {
			$args = func_get_args();

			return $this->call( 'addMenuPage', $args );
		} );

		Actions::add( 'network_admin_menu', function () {
			$args = func_get_args();

			return $this->call( 'addMenuPage', $args );
		} );

		Actions::add( 'vc:v:settings:main_page:menu_page_build', function () {
			$args = func_get_args();
			$this->call( 'addSubmenuPages', $args );
		} );

		do_action( 'vc:v:settings:initialize' );
	}


	/**
	 * Get main page slug
	 *
	 * This determines what page is opened when user clicks 'Visual Composer' in settings menu
	 *
	 * If user user has administrator privileges, 'General' page is opened, if not, 'About' is opened
	 *
	 * @return string
	 */
	public function getMainPageSlug() {
		$hasAccess = ! app( 'CurrentUserAccess' )
				->wpAny( 'manage_options' )
				->part( 'settings' )
				->can( app( 'GeneralPage' )->getPageSlug() )
				->get() || ( is_multisite() && ! is_main_site() );

		if ( $hasAccess ) {
			return app( 'AboutPage' )->getPageSlug();
		} else {
			return app( 'GeneralPage' )->getPageSlug();
		}
	}

	public function addMenuPage() {
		$slug = $this->getMainPageSlug();
		$title = __( 'Visual Composer ', 'vc5' );

		$icon_url = Url::assetUrl( 'images/logo/16x16.png' );

		add_menu_page( $title, $title, 'exist', $slug, null, $icon_url, 76 );

		do_action( 'vc:v:settings:main_page:menu_page_build', $slug );
	}

	public function addSubmenuPages() {
		if ( ! app( 'CurrentUserAccess' )->wpAny( 'manage_options' )->get() ) {
			return;
		}

		$pages = $this->getPages();
		$parentSlug = $this->getMainPageSlug();

		foreach ( $pages as $page ) {
			$hasAccess = app( 'CurrentUserAccess' )
				->part( 'settings' )
				->can( $page['slug'] . '-tab' )
				->get();

			if ( $hasAccess ) {
				add_submenu_page( $parentSlug, $page['title'], $page['title'], 'manage_options', $page['slug'], function () {
					$args = func_get_args();
					$this->call( 'renderPage', $args );
				} );
			}
		}

		do_action( 'vc:v:settings:page_settings_build' );
	}

	/**
	 * @param Request $request
	 */
	public function renderPage( Request $request ) {
		$page = $request->input( 'page' );

		ob_start();
		do_action( 'vc:v:settings:page_render:' . $page, $page );
		$content = ob_get_clean();

		Templates::render( 'layout', [
			'content' => $content,
			'tabs' => $this->getPages(),
			'activeSlug' => $page
		] );
	}

	/**
	 * Init settings page
	 */
	public function initAdmin() {
		foreach ( $this->getPages() as $page ) {
			do_action( 'vc:v:settings:init_admin:page:' . $page['slug'] );
		}

		do_action( 'vc:v:settings:init_admin' );
	}

	/**
	 * @return mixed
	 */
	public function getPages() {
		if ( is_null( $this->pages ) ) {
			$this->pages = apply_filters( 'vc:v:settings:get_pages', [ ] );
		}

		return $this->pages;
	}

	/**
	 * @param $page
	 * @param $title
	 * @param $callback
	 */
	public function addSection( $page, $title = null, $callback = null ) {
		add_settings_section( $this->getOptionGroup() . '_' . $page, $title, ( null !== $callback ? $callback : function () {
			$args = func_get_args();
			$this->call( 'settingSectionCallbackFunction', $args );
		} ), $this->getPageSlug() . '_' . $page );
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
	public function addField( $page, $title, $fieldName, $sanitizeCallback, $fieldCallback, $args = [ ] ) {
		register_setting( $this->getOptionGroup() . '_' . $page, $this->fieldPrefix . $fieldName, $sanitizeCallback );
		add_settings_field( $this->fieldPrefix . $fieldName, $title, $fieldCallback, $this->getPageSlug() . '_' . $page, $this->getOptionGroup() . '_' . $page, $args );

		return $this;
	}

	/**
	 * Callback function for settings section
	 *
	 * @param string $page
	 */
	public function settingSectionCallbackFunction( $page ) {
	}


}
