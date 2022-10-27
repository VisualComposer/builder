<?php

$location = __DIR__;

// command to run from main folder - php tools/elements/bulk-update-elements.php

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
        // $json['advancedTab']['value'][] = 'htmlAttributes'; // it will add additional key to array
        $json['advancedTab']['value'] = ['htmlAttributes', 'customCSS'];
        // make array unique
        $json['advancedTab']['value'] = array_values(array_unique($json['advancedTab']['value']));

        $json['customCSS'] = [
            "type" => "group",
            "access" => "public",
            "value" => [
                "styleEditor"
            ],
            "options" => [
                "label" => "Custom CSS",
                "tooltip" => "Add custom CSS to the element using the [element-id] placeholder.",
            ],
        ];

        $json['styleEditor'] = [
            "type" => "styleEditor",
            "access" => "public",
            "value" => [],
            "options" => [],
        ];

        // save pretty json
        $json = json_encode($json, JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES);
        $json = str_replace('    ', '  ', $json);
        file_put_contents($file . '/' . $name . '/settings.json', $json);
    }
}
