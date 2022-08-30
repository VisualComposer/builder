<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/** @var array $enabledOptions */
/** @var string $value */
/** @var string $name */
/** @var string $class */
/** @var string $emptyTitle */
/** @var string $dataTitle */
$outputHelper = vchelper('Output');
?>

<div class="vcv-ui-form-group<?php echo isset($description) ? ' vcv-ui-form-switch-container-has-description' : ''; ?>" <?php
echo isset($dataTitle) ? 'data-title="' . esc_attr($dataTitle) . '"' : ''; ?>>
    <?php $createUrlAttribute = isset($createUrl) ? 'data-create-url="' . esc_url($createUrl) . '"' : ''; ?>
    <select class="vcv-ui-form-dropdown<?php echo isset($class) ? ' ' . esc_attr($class) : ''; ?>" <?php $outputHelper->printNotEscaped($createUrlAttribute); ?> id="<?php echo esc_attr(
        $name
    ); ?>" name="<?php echo esc_attr($name); ?>">
        <?php if (isset($emptyTitle)) : ?>
            <option value=""><?php echo esc_html($emptyTitle); ?></option>
        <?php endif; ?>
        <?php if (!empty($enabledOptions)) : ?>
            <?php foreach ($enabledOptions as $option) : ?>
                <?php $selected = ($option['id'] === $value) ? 'selected' : ''; ?>
                <?php $url = isset($option['url']) ? 'data-url="' . esc_url($option['url']) . '"' : ''; ?>
                <option value="<?php echo esc_attr($option['id']); ?>" <?php $outputHelper->printNotEscaped($url) ?> <?php $outputHelper->printNotEscaped($selected); ?>><?php echo esc_html($option['title']); ?></option>
            <?php endforeach; ?>
        <?php endif; ?>
    </select>

    <?php if (isset($description)) { ?>
        <p class="description"><?php esc_html($description); ?></p>
    <?php } ?>
</div>
