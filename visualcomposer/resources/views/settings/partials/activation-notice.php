<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

?>
<div class="updated vcv-license activation notice">
    <p>
        <?php echo sprintf(
            __(
                'Hola! Please <a href="%s">activate your copy</a> of Visual Composer to receive automatic updates.',
                'vcwb'
            ),
            $redirectUrl
        ) ?>
    </p>
</div>