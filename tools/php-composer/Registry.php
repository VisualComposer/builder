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

    static public function callHooks()
    {
        call_user_func_array(['\\ComposerHooks\\Hooks\\Autoload', 'call'], []);
        call_user_func_array(['\\ComposerHooks\\Hooks\\Meta', 'call'], []);
    }
}
