<?php

$contents = file_get_contents(__DIR__ . '/webfonts.json');

$data = json_decode($contents, true);

$output = [];
foreach ($data['items'] as $item) {
    $family = $item['family'];
    $output[] = [
        'id' => $family,
        'title' => $family,
        'variants' => $item['variants'],
        'subsets' => implode(',', $item['subsets']),
    ];
}

echo json_encode($output); // saved to public/sources/attributes/googleFonts/lib/google-fonts-set.json
