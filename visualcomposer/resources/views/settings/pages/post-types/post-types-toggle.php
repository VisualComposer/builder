<?php
/** @var array $enabledPostTypes */
?>

<div class="vcv-ui-form-switch-container">
    <label class="vcv-ui-form-switch">
        <input type="checkbox" value="<?php echo $postType['value']; ?>" name="vcv-post-types[]" <?php echo in_array(
            $postType['value'],
            $enabledPostTypes
        ) ? 'checked="checked"' : ''; ?> />
        <span class="vcv-ui-form-switch-indicator"></span>
        <span class="vcv-ui-form-switch-label" data-vc-switch-on="on"></span>
        <span class="vcv-ui-form-switch-label" data-vc-switch-off="off"></span>
    </label>
</div>
