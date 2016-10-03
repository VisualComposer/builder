<?= '<?php' ?>

namespace PHPSTORM_META {

   /**
    * PhpStorm Meta file, to provide autocomplete information for PhpStorm
    * Generated on <?= date("d.m.Y") ?>.
    */
    $STATIC_METHOD_TYPES = [
<?php foreach($methods as $method): ?>
        <?= $method ?> => [
            '' == '@',
<?php foreach($bindings as $abstract => $class): ?>
            '<?= $abstract ?>' instanceof \<?= $class ?>,
<?php endforeach ?>        ],
<?php endforeach ?>
        <?= '\\vchelper(\'\')' ?> => [
            '' == '@',
<?php foreach($components['helpers'] as $abstract => $class): ?>
            '<?= str_replace('Helper', '', $abstract) ?>' instanceof \<?= $class['abstract'] ?>,
<?php endforeach ?>        ],
    ];
}