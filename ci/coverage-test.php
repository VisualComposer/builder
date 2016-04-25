<?php
$minCoverage = getenv('CI_MIN_COVERAGE');
if (empty($minCoverage)) {
    $minCoverage = 0.7;
}
define('CI_MIN_COVERAGE', $minCoverage);
$exit = 0;
$filePath = __DIR__ . '/../test.coverage';
if (file_exists($filePath)) {
    $xml = simplexml_load_file($filePath);
    $projects = [];
    $packages = [];
    $files = [];
    $microPath = realpath(__DIR__ . '/../');
    echo PHP_EOL;
    foreach ($xml->project as $project) {
        /** @var $projects SimpleXMLElement */
        $projects[] = (string)$project->attributes()->timestamp;
        foreach ($project->package as $package) {
            $packages[] = (string)$package->attributes()->name;
            foreach ($package->file as $file) {
                $total = (float)$file->metrics->attributes()->elements;
                if ($total > 0) {
                    $covered = (float)$file->metrics->attributes()->coveredelements;
                    $coveredCoeff = $covered / $total;
                    if ($coveredCoeff < CI_MIN_COVERAGE) {
                        echo PHP_EOL;
                        $fileName = (string)$file->attributes()->name;
                        echo 'File: (' . str_replace($microPath, '', $fileName) . ') coverage(' . (round(
                                $coveredCoeff * 100,
                                3
                            )) . ' %), atleast required ' . (CI_MIN_COVERAGE * 100) . '%' . PHP_EOL;
                        $exit = 1;
                    }
                }
                $files[] = (string)$file->attributes()->name;
            }
        }
    }

} else {
    echo 'File: ' . $filePath . ' doesnt exists!';
    $exit = 2;
}

exit($exit);