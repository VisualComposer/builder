<?php
if (!defined('ABSPATH')) {
    die('-1');
}

vcapp('VisualComposer\Helpers\Generic\Templates')->render('settings/partials/admin-nonce');
?>
<div class="wrap vc_settings">
    <h2><?php echo __('Visual Composer Settings', 'vc5') ?></h2>
    <?php
    vcapp('VisualComposer\Helpers\Generic\Templates')->render(
        'settings/partials/tabs',
        [
            'activeSlug' => $activeSlug,
            'tabs' => $tabs,
        ]
    );
    echo $content;
    ?>

</div>