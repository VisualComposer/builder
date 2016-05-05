<?php
if (!defined('ABSPATH')) {
    die('-1');
}

echo vcview('settings/partials/admin-nonce');
?>
<div class="wrap vcv-settings">
    <h2><?php echo __('Visual Composer Settings', 'vc5') ?></h2>
    <?php
    echo vcview(
        'settings/partials/tabs',
        [
            'activeSlug' => $activeSlug,
            'tabs' => $tabs,
        ]
    );
    echo $content;
    ?>

</div>