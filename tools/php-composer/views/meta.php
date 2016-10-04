<?= '<?php' ?>

namespace PHPSTORM_META {

    // this is legacy format for 2016.1 and EARLIER
    // This file is not a CODE, it makes no sense and won't run or validate
    // Its AST serves IDE as DATA source to make advanced type inference decisions.

    $STATIC_METHOD_TYPES = [
<?php foreach($methods as $method): ?>
        <?= $method ?> => [
            'App' instanceof \VisualComposer\Application,
<?php foreach($bindings as $abstract => $class): ?>
            '<?= $abstract ?>' instanceof \<?= $class ?>,
<?php endforeach ?>        ],
<?php endforeach ?>
        <?= '\\vchelper(\'\')' ?> => [
<?php foreach($components['helpers'] as $abstract => $class): ?>
            '<?= str_replace('Helper', '', $abstract) ?>' instanceof \<?= $class['abstract'] ?>,
<?php endforeach ?>        ],
    ];
}