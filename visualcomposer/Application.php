<?php

namespace VisualComposer;

class Application extends \Laravel\Lumen\Application {
	public $modules = [
		// system modules & submodules
		'ActivationController' => 'VisualComposer\Modules\System\Activation\ActivationController',
		'ActivationListener' => 'VisualComposer\Modules\System\Activation\ActivationListener',
		'TextDomainController' => 'VisualComposer\Modules\System\TextDomain\TextDomainController',
		'WPBMap' => 'VisualComposer\Modules\WPBMap',

		// Editors modules & submodules
		'AssetsManagerController' => 'VisualComposer\Modules\Editors\AssetsManager\AssetsManagerController',
		'DataAjaxController' => 'VisualComposer\Modules\Editors\DataAjax\DataAjaxController',
		'FrontController' => 'VisualComposer\Modules\Editors\Front\FrontController',
		'FrontendEditor' => 'VisualComposer\Modules\Editors\Front\FrontendEditor',

		// Editor elements
		'AjaxShortcodeRenderController' => 'VisualComposer\Modules\Editors\Elements\AjaxShortcodeRender\AjaxShortcodeRenderController',

		// License
		'LicenseController' => 'VisualComposer\Modules\License\LicenseController',

		// Settings
		'SettingsController' => 'VisualComposer\Modules\Settings\SettingsController',
		'Page' => 'VisualComposer\Modules\Settings\Pages\Page',
		'GeneralPage' => 'VisualComposer\Modules\Settings\Pages\General',
		'LicensePage' => 'VisualComposer\Modules\Settings\Pages\License',
		'RolesPage' => 'VisualComposer\Modules\Settings\Pages\Roles',
		'AboutPage' => 'VisualComposer\Modules\Settings\Pages\About',

		// Access
		'CurrentUserAccess' => 'VisualComposer\Modules\Access\CurrentUserAccess',
		'UserAccess' => 'VisualComposer\Api\Access\UserAccess',
		'RoleAccess' => 'VisualComposer\Modules\Access\RoleAccess',
	];

	/**
	 * Create a new Lumen application instance.
	 *
	 * @overrides parent::__construct()
	 *
	 * @param  string|null $basePath
	 */
	public function __construct( $basePath = null ) {
		$this->basePath = $basePath;
		$this->bootstrapContainer();
		do_action( 'vc:v:init' );
	}

	public function boot() {
		foreach ( $this->modules as $moduleName => $module ) {
			$this->singleton( $moduleName, $module );
			$this->make( $moduleName );
		}
	}

	/**
	 * Get the version number of the application.
	 *
	 * @return string
	 */
	public function version() {
		return VC_V_VERSION;
	}

	/**
	 * Get the HTML from the welcome screen.
	 *
	 * @return string
	 */
	public function welcome() {
		return 'Visual Composer';
	}
}