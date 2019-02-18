<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}
/** @var string $sourceId */
?>

<?php vchelper('Frontend')->renderContent($sourceId); ?>

<?php wp_footer(); ?>

</body>
</html>
