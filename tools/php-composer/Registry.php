<?php
namespace ComposerHooks;

class Registry
{
    public static $hooks = [];

    static public function postInstallCmd($event)
    {
        self::callHooks();
    }

    static public function postUpdateCmd($event)
    {
        self::callHooks();
    }

    static public function addHook($hook)
    {
        self::$hooks[] = $hook;
    }

    static public function callHooks()
    {
        foreach (self::$hooks as $hook) {
            call_user_func_array([$hook, 'call'], []);
        }
    }
}

// Register hooks
Registry::addHook('\\ComposerHooks\\Hooks\\Autoload');
Registry::addHook('\\ComposerHooks\\Hooks\\Meta');
