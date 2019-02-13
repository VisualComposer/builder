<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/** @var array $enabledOptions */
/** @var string $value */
/** @var string $name */
/** @var string $emptyOptionTitle */
?>

<div class="vcv-ui-form-switch-container">
    <label class="vcv-ui-form-dropdown">
        <select id="<?php echo $name; ?>" name="<?php echo $name; ?>">
            <option value=""><?php echo $emptyOptionTitle; ?></option>
            <?php if (!empty($enabledOptions)) : ?>
                <?php foreach ($enabledOptions as $option) : ?>
                    <?php $selected = ($option['id'] === $value) ? 'selected' : ''; ?>
                    <option value="<?php echo $option['id']; ?>" <?php echo $selected; ?>><?php echo $option['title']; ?></option>
                <?php endforeach; ?>
            <?php endif; ?>
        </select>
    </label>
</div>
