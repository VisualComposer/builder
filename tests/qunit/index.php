<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <title>QUnit Tests</title>
    <link type="text/css" rel="stylesheet" href="../../node_modules/qunitjs/qunit/qunit.css"/>
    <script src="//code.jquery.com/jquery-1.12.1.js"
        integrity="sha256-VuhDpmsr9xiKwvTIHfYWCIQ84US9WqZsLfR4P7qF6O8=" crossorigin="anonymous"></script>
</head>
<body>
<div id="qunit"></div>
<div id="qunit-fixture"></div>
<script src="../../node_modules/qunitjs/qunit/qunit.js"></script>
<script src="../../resources/assets/js/dist/framework.min.js"></script>
<?php
$data = glob('tests/test-*.js');
foreach ($data as $file) {
    echo '<script src="' . $file . '"></script>';
}
?>
</body>
</html>