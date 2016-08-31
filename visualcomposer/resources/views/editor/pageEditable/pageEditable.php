<?php
/** @var Url $url */
use VisualComposer\Helpers\Url;

$url = vchelper('Url');
$filter = vchelper('Filters');
$bundleCssUrl = $url->to('public/dist/pe.bundle.css?' . uniqid());
$bundleJsUrl = $url->to('public/dist/pe.bundle.js?' . uniqid());
?>
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
        vcvLoadJsCssFile('<?php  echo $bundleCssUrl ?>', 'css');
        vcvLoadJsCssFile('<?php  echo $bundleJsUrl ?>', 'js');
    })();
</script>
<div id="vcv-editor">Loading...</div>