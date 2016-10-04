<?php
namespace ComposerHooks;

use ComposerHooks\Hooks\Autoload;
use ComposerHooks\Hooks\Meta;

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
        Autoload::call();
        Meta::call();
    }
}
