<?php
/**
 * @var int $sourceId
 * @var string $hookSuffix
 * @var object $outputHelper
 * @var array $extraOutput
 */

wp_print_footer_scripts();
do_action('admin_footer', '');
do_action('admin_print_footer_scripts-' . $hookSuffix);
do_action('admin_print_footer_scripts');
do_action('admin_footer-' . $hookSuffix);
if (is_array($extraOutput)) {
    foreach ($extraOutput as $output) {
        $outputHelper->printNotEscaped($output);
    }
    unset($output);
}
?>
</body>
</html>
