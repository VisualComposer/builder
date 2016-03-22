<?php
if (!defined('ABSPATH')) {
    die('-1');
}

vcview('settings/partials/admin-nonce');
?>
<div class="wrap vc_settings">
    <h2><?php echo __('Visual Composer Settings', 'vc5') ?></h2>
    <?php
    vcview(
        'settings/partials/tabs',
        [
            'activeSlug' => $activeSlug,
            'tabs' => $tabs,
        ]
    );
    echo $content;
    ?>

</div>