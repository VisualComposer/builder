<?php

namespace VisualComposer\Helpers\WordPress;

class Nonce
{
    public function user()
    {
        return wp_create_nonce('vc:v:nonce');
    }

    public function admin()
    {
        return wp_create_nonce('vc:v:nonce:admin');
    }

    public function verifyUser($nonce)
    {
        return !empty($nonce) && wp_verify_nonce($nonce, 'vc:v:nonce');
    }

    public function verifyAdmin($nonce)
    {
        return !empty($nonce) && wp_verify_nonce($nonce, 'vc:v:nonce:admin');
    }
}
