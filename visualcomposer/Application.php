<?php

namespace VisualComposer;

class Application extends \Laravel\Lumen\Application {
	public $modules = [
		// system modules & submodules
		'VisualComposer\Modules\System\Activation\Controller',
		'VisualComposer\Modules\System\Activation\Listener',
		'VisualComposer\Modules\System\TextDomain\Controller',

		// Editors modules & submodules
		'VisualComposer\Modules\Editors\AssetsManager\Controller',
		'VisualComposer\Modules\Editors\DataAjax\Controller',
		'VisualComposer\Modules\Front\Controller',

		// Elements
		'VisualComposer\Modules\Elements\AjaxShortcodeRender\Controller',

		// License
		'VisualComposer\Modules\License\Controller',

		// Settings
		'VisualComposer\Modules\Settings\Controller',
		'VisualComposer\Modules\Settings\Pages\General',
		'VisualComposer\Modules\Settings\Pages\License',
		'VisualComposer\Modules\Settings\Pages\Roles',
		'VisualComposer\Modules\Settings\Pages\About',

		// Access
		'VisualComposer\Modules\Access\CurrentUser\Access',
		'VisualComposer\Modules\Access\Role\Access',

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
		do_action( 'vc:v:load', $this );
	}

	public function boot() {
		foreach ( $this->modules as $module ) {
			$this->singleton( $module, $module );
			$this->make( $module );
		}
		do_action( 'vc:v:boot', $this );
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