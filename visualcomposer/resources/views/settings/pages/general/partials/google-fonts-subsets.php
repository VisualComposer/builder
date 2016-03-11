<?php

if (!defined('ABSPATH')) {
    die('-1');
}

?>
<?php foreach ($subsets as $subset) : ?>
    <?php

    $attributes = [
        'name="' . VC_V_PREFIX . 'google_fonts_subsets[]"',
        'value="' . $subset['title'] . '"',
        ($subset['checked'] ? 'checked' : null),
    ];

    ?>
    <label>
        <input type="checkbox" <?php echo implode(' ', $attributes) ?> />
        <?php echo $subset['title'] ?>
    </label>
    <br/>
<?php endforeach ?>

<p class="description indicator-hint">
    <?php echo __('Select subsets for Google Fonts available to content elements.', 'vc5') ?>
</p>