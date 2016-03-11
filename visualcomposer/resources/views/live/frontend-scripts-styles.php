<?php

if (!defined('ABSPATH')) {
    die('-1');
}

?>
<script>
    function vcvLoadJsCssFile(filename, filetype) {
        var fileRef;
        filename = filename.replace(/\s/g, '%20');
        if ('js' === filetype) {
            fileRef = document.createElement('script');
            fileRef.setAttribute('type', 'text/javascript');
            fileRef.setAttribute('src', filename);
        } else if ('css' === filetype) {
            fileRef = document.createElement('link');
            if (filename.substr(-5, 5) === '.less') {
                fileRef.setAttribute('rel', 'stylesheet/less');
            } else {
                fileRef.setAttribute('rel', 'stylesheet');
            }
            fileRef.setAttribute('type', 'text/css');
            fileRef.setAttribute('href', filename);
        }
        if ('undefined' !== typeof fileRef) {
            document.getElementsByTagName('head')[0].appendChild(
                fileRef);
        }
    }

    function vcvLoadInline(element, id) {
        window.vcPostID = id;
        window.vcAjaxUrl = '<?php echo admin_url('admin-ajax.php') ?>';
        element.remove();
        <?php /* TODO: use assets folder */ ?>
        vcvLoadJsCssFile('<?php echo vcapp('urlHelper')->to('public/dist/wp.bundle.css?' . uniqid()) ?>', 'css');
        vcvLoadJsCssFile('<?php echo vcapp('urlHelper')->to('public/dist/wp.bundle.js?' . uniqid())  ?>', 'js');
    }
    <?php if ($scriptsBundle) : ?>
    vcvLoadJsCssFile('<?php echo $scriptsBundle  ?>', 'js');
    <?php
    endif;
    ?>
    <?php if ($stylesBundle) : ?>
    vcvLoadJsCssFile('<?php echo $stylesBundle  ?>', 'css');
    <?php
    endif;
    ?>
</script>