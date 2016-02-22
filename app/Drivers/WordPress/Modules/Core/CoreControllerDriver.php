<?php
namespace App\Drivers\WordPress\Modules\Core;

use Illuminate\Contracts\Events\Dispatcher;

/**
 * Class CoreControllerDriver
 * @package App\Drivers\WordPress\Modules\Core
 */
class CoreControllerDriver
{
    /**
     * @var \Illuminate\Contracts\Events\Dispatcher
     */
    protected $event;

    /**
     * CoreControllerDriver constructor.
     *
     * @param \Illuminate\Contracts\Events\Dispatcher $event
     */
    public function __construct(Dispatcher $event)
    {
        $this->event = $event;

        $event->listen('vc:core:load', [$this, 'addLoadHooks']);
        $event->listen('vc:core:init', [$this, 'addInitHooks']);

        add_action(
            'init',
            function () {
                $this->event->fire('driver:init');
            }
        );
        add_action(
            'admin_init',
            function () {
                $this->event->fire('driver:admin_init');
            }
        );
    }

    /**
     *
     */
    public function addLoadHooks()
    {
        register_activation_hook(
            VC_V_PLUGIN_FULL_PATH,
            function () {
                $this->event->fire('driver:activation_hook');
            }
        );
        register_deactivation_hook(
            VC_V_PLUGIN_FULL_PATH,
            function () {
                $this->event->fire('driver:deactivation_hook');
            }
        );
    }

    /**
     *
     */
    public function addInitHooks()
    {
        load_plugin_textdomain('vc5', false, VC_V_PLUGIN_DIRNAME.'/languages');
    }
}