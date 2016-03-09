<?php

if (!defined('ABSPATH')) {
    die('-1');
}

?>
<a href="#"
    class="button vc_pointers-reset-button"
    id="vc_settings-vc-pointers-reset"
    data-vc-done-txt="<?= __('Done', 'vc5') ?>">
    <?= __('Reset', 'vc5') ?>
</a>

<p class="description indicator-hint">
    <?= __(
        'Guide tours are shown in VC editors to help you to start working with editors. You can see them again by clicking button above.',
        'vc5'
    ) ?>
</p>