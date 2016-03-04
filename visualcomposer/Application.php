<?php

namespace VisualComposer;

class Application extends \Laravel\Lumen\Application {
	public $modules = [
		// system modules & submodules
		'VisualComposer\Modules\System\Activation\ActivationController',
		'VisualComposer\Modules\System\Activation\ActivationListener',
		'VisualComposer\Modules\System\TextDomain\TextDomainController',

		// Editors modules & submodules
		'VisualComposer\Modules\Editors\AssetsManager\AssetsManagerController',
		'VisualComposer\Modules\Editors\DataAjax\DataAjaxController',
		'VisualComposer\Modules\Front\FrontController',

		// Elements
		'VisualComposer\Modules\Elements\AjaxShortcodeRender\AjaxShortcodeRenderController',

		// License
		'VisualComposer\Modules\License\LicenseController',

		// Settings
		'VisualComposer\Modules\Settings\SettingsController',
		'VisualComposer\Modules\Settings\Pages\General',
		'VisualComposer\Modules\Settings\Pages\License',
		'VisualComposer\Modules\Settings\Pages\Roles',
		'VisualComposer\Modules\Settings\Pages\About',

		// Access
		'VisualComposer\Modules\Access\CurrentUserAccess',
		'VisualComposer\Modules\Access\RoleAccess',

		'VisualComposer\Modules\Editors\Frontend\Frontend',
		'VisualComposer\Modules\Editors\Frontend\PageEditable',

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
		do_action( 'vc:v:load' );
	}

	public function boot() {
		foreach ( $this->modules as $module ) {
			$this->singleton( $module, $module );
			$this->make( $module );
		}
		do_action( 'vc:v:init' );
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

	/**
	 * Register the core container aliases.
	 *
	 * @return void
	 */
	protected function registerContainerAliases() {
		$this->aliases = [
				'Illuminate\Contracts\Foundation\Application' => 'app',
				'Illuminate\Contracts\Auth\Guard' => 'auth.driver',
				'Illuminate\Contracts\Auth\PasswordBroker' => 'auth.password',
				'Illuminate\Contracts\Cache\Factory' => 'cache',
				'Illuminate\Contracts\Cache\Repository' => 'cache.store',
				'Illuminate\Container\Container' => 'app',
				'Illuminate\Contracts\Container\Container' => 'app',
				'Illuminate\Contracts\Cookie\Factory' => 'cookie',
				'Illuminate\Contracts\Cookie\QueueingFactory' => 'cookie',
				'Illuminate\Contracts\Encryption\Encrypter' => 'encrypter',
				'Illuminate\Contracts\Events\Dispatcher' => 'events',
				'Illuminate\Contracts\Filesystem\Factory' => 'filesystem',
				'Illuminate\Contracts\Hashing\Hasher' => 'hash',
				'log' => 'Psr\Log\LoggerInterface',
				'Illuminate\Contracts\Mail\Mailer' => 'mailer',
				'Illuminate\Contracts\Queue\Queue' => 'queue.connection',
				'Illuminate\Redis\Database' => 'redis',
				'Illuminate\Contracts\Redis\Database' => 'redis',
				'request' => 'Illuminate\Http\Request',
				'Illuminate\Session\SessionManager' => 'session',
				'Illuminate\Contracts\View\Factory' => 'view',
			] + $this->modules;
	}
}