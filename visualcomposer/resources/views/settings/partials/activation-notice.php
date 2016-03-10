<?php

if (!defined('ABSPATH')) {
    die('-1');
}

?>
<div class="updated vc_license activation notice">
    <p>
        <?php echo sprintf(
            __(
                'Hola! Please <a href="%s">activate your copy</a> of Visual Composer to receive automatic updates.',
                'vc5'
            ),
            $redirectUrl
        ) ?>
    </p>
</div>