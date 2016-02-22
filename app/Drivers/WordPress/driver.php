<?php

namespace App\Drivers\WordPress;

/**
 * Class Driver
 * @package App\Drivers\WordPress
 */
class Driver
{

    /**
     * List of system connectors layer driver-module-system
     * @var array
     */
    protected $connectors = [
        'Options' => '\App\Drivers\WordPress\Connectors\Options',
        'File' => '\App\Drivers\WordPress\Connectors\File',
        'Locale' => '\App\Drivers\WordPress\Connectors\Locale',
    ];

    /**
     * List of available module drivers
     * @var array
     */
    protected $drivers = [
        'CoreControllerDriver' => '\App\Drivers\WordPress\Modules\Core\CoreControllerDriver',
        'PostAjaxControllerDriver' => '\App\Drivers\WordPress\Modules\PostAjax\PostAjaxControllerDriver',
        'AssetsManagerControllerDriver' => '\App\Drivers\WordPress\Modules\AssetsManager\AssetsManagerControllerDriver',
        'PageFrontControllerDriver' => '\App\Drivers\WordPress\Modules\PageFront\PageFrontControllerDriver',

    ];

    /**
     * List of system modules
     * @var array
     */
    protected $modules = [
        'CoreController' => '\App\Modules\Core\CoreController',
        'PostAjaxController' => '\App\Modules\PostAjax\PostAjaxController',
        'AssetsManagerController' => '\App\Modules\AssetsManager\AssetsManagerController',
        'PageFrontController' => '\App\Modules\PageFront\PageFrontController',
    ];

    /** @var \Laravel\Lumen\Application */
    protected $app;

    /**
     * Driver constructor.
     */
    public function __construct()
    {
        $this->app = app();
        $this->init($this->connectors);
        $this->init($this->drivers);
        $this->init($this->modules);
    }

    /**
     * @param array $list
     */
    protected function init(array $list)
    {
        foreach ($list as $name => $instance) {
            $this->app->singleton($instance);
            $this->app->make($name);
        }
    }
}