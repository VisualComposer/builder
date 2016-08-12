<?php
/** @var Url $url */
use VisualComposer\Helpers\Url;

$url = vchelper('Url');
$filter = vchelper('Filters');
$linkToTinymce = $url->to('public/tinymce/tinymce.js');
$elementsUrl = $url->to('public/dist/elements.css?' . uniqid())
?>
<script src="<?php echo $linkToTinymce; ?>"></script>
<script>
    (function () {
        function vcvLoadJsCssFile (filename, filetype) {
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
                document.getElementsByTagName('head')[ 0 ].appendChild(
                    fileRef);
            }
        }

        vcvLoadJsCssFile('<?php echo $elementsUrl; ?>', 'css');
    })();
</script>
<div id="vcv-editor">Loading...</div>