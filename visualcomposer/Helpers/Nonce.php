<?php

namespace VisualComposer\Helpers;

use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Class Nonce.
 */
class Nonce implements Helper
{
    /**
     * @return mixed
     */
    public function user()
    {
        return wp_create_nonce('vcv:nonce');
    }

    /**
     * @return mixed
     */
    public function admin()
    {
        return wp_create_nonce('vcv:nonce:admin');
    }

    /**
     * @param $nonce
     *
     * @return bool
     */
    public function verifyUser($nonce)
    {
        return !empty($nonce) && wp_verify_nonce($nonce, 'vcv:nonce');
    }

    /**
     * @param $nonce
     *
     * @return bool
     */
    public function verifyAdmin($nonce)
    {
        return !empty($nonce) && wp_verify_nonce($nonce, 'vcv:nonce:admin');
    }
}
