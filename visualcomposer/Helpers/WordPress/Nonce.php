<?php

namespace VisualComposer\Helpers\WordPress;

abstract class Nonce
{
    public static function user()
    {
        return wp_create_nonce('vc:v:nonce');
    }

    public static function admin()
    {
        return wp_create_nonce('vc:v:nonce:admin');
    }

    public static function verifyUser($nonce)
    {
        return wp_verify_nonce($nonce, 'vc:v:nonce');
    }

    public static function verifyAdmin($nonce)
    {
        return wp_verify_nonce($nonce, 'vc:v:nonce:admin');
    }
}