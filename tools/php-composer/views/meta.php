<?php echo '<?php' . PHP_EOL; ?>
<?php
/** @var $methods array */
/** @var $bindings array */
/** @var $components array */
?>
namespace PHPSTORM_META {

    // this is legacy format for 2016.1 and EARLIER
    // This file is not a CODE, it makes no sense and won't run or validate
    // Its AST serves IDE as DATA source to make advanced type inference decisions.

    $STATIC_METHOD_TYPES = [
<?php foreach($methods as $method): ?>
        <?php echo $method; ?> => [
            'App' instanceof \VisualComposer\Application,
<?php foreach($bindings as $abstract => $class): ?>
            '<?php echo $abstract; ?>' instanceof \<?php echo $class; ?>,
<?php endforeach; ?>        ],
<?php endforeach; ?>
        <?php echo '\\vchelper(\'\')'; ?> => [
<?php foreach($components['helpers'] as $abstract => $class): ?>
            '<?php echo str_replace('Helper', '', $abstract); ?>' instanceof \<?php echo $class['abstract']; ?>,
<?php endforeach; ?>        ],
    ];
}