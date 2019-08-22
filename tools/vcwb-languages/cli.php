<?php

// Should be executed in /visualcomposer/ folder like:
// php tools/vcwb-languages/cli.php

$cwd = rtrim(getcwd(), '\\/');

$paths = [
    '/languages' => is_dir($cwd . '/languages'),
    '/../languages' => is_dir($cwd . '/../languages'),
    '/../../languages' => is_dir($cwd . '/../../languages'),
];
$paths = array_filter($paths);
if (empty($paths)) {
    echo 'Failed to found languages directory. Make sure script called in plugin root' . PHP_EOL;
    exit(1);
}
function downloadUrlToFile($url, $outFileName)
{
    $options = [
        CURLOPT_FILE => fopen($outFileName, 'w'),
        CURLOPT_TIMEOUT => 120,
        CURLOPT_URL => $url,
    ];

    $ch = curl_init();
    curl_setopt_array($ch, $options);
    $res = curl_exec($ch);
    curl_close($ch);

    return $res;
}

$outFileName = '/tmp/temp-languages-' . time() . '-file.zip';
echo 'Downloading Translations' . PHP_EOL;
$result = downloadUrlToFile('https://translate.visualcomposer.com/?vcwb-download&path=vcwb', $outFileName);
if ($result) {
    $zip = new ZipArchive;
    if ($zip->open($outFileName) === true) {
        $zip->extractTo($cwd . key($paths));
        $zip->close();
    } else {
        echo 'Wrong ZIP downloaded' . PHP_EOL;
        exit(1);
    }
    unlink($outFileName);
    echo 'Download Finished' . PHP_EOL;
    exit(0);
}

echo 'Failed to download translations' . PHP_EOL;
exit(1);
