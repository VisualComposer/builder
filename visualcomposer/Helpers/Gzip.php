<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;
use VisualComposer\Framework\Container;

class Gzip extends Container implements Helper
{
    /**
     * Return true if gzip compression can be processed by a current environment.
     *
     * @return bool
     */
    public function isGzip()
    {
        return $this->isBrowserAcceptCompressedContent() && ! $this->isPhpGzCompressionInProcess();
    }

    /**
     * Return true if the browser can accept gzip encoding.
     *
     * @return bool
     */
    public function isBrowserAcceptCompressedContent()
    {
        if (strpos($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip') === false) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Return tru if php compression is already enabled.
     *
     * @return bool
     */
    public function isPhpGzCompressionInProcess()
    {
        if (in_array('ob_gzhandler', ob_list_handlers())) {
            return true;
        }

        if (extension_loaded('zlib')) {
            // phpcs:ignore
            @ini_set('zlib.output_compression_level', 1);

            if (ini_get('zlib.output_compression_level') === '1') {
                return true;
            }
        }

        return false;
    }
}
