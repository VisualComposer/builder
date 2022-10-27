<?php

$location = __DIR__;

// find all directories in the ../../elements directory
$path = realpath($location . '/../../elements');
$files = glob($path . '/*', GLOB_ONLYDIR);

var_dump($files);
// loop through the directories
foreach ($files as $file) {
    // get the name of the directory
    $name = basename($file);

    // check if the directory contains a file called index.php
    if (file_exists($file . '/' . $name . '/settings.json')) {
        // read contents of json
        $json = file_get_contents($file . '/' . $name . '/settings.json');
        $json = json_decode($json, true);
        // modify the json
        $json['advancedTab']['value'][] = 'styleEditor';
        // make array unique
        $json['advancedTab']['value'] = array_values(array_unique($json['advancedTab']['value']));

        $json['styleEditor'] = [
            "type" => "styleEditor",
            "access" => "public",
            "value" => [],
            "options" => [
                "label" => "Custom element CSS",
            ],
        ];

        // save pretty json
        $json = json_encode($json, JSON_PRETTY_PRINT);
        file_put_contents($file . '/' . $name . '/settings.json', $json);
    }
}
