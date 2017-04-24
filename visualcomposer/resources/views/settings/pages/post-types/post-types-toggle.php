<?php
/** @var array $postTypes */

$postTypesHelper = vchelper('PostType');
$availablePostTypes = $postTypesHelper->getPostTypes(['attachment']);
?>
    <p>
        <?php echo __('Specify post types where you want to use Visual Composer Website Builder.', 'vc5'); ?>
    </p>
<?php
foreach ($availablePostTypes as $postType) :
    ?>
    <label><span><?php echo $postType['label']; ?></span>
        <input type="checkbox" name="vcv-post-types[]" value="<?php echo $postType['value']; ?>"
            <?php echo in_array(
                $postType['value'],
                $postTypes
            ) ? 'checked="checked"' : ''; ?>
        />
    </label>
    <?php
endforeach;
