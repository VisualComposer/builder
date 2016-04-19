<?php
$exit = 0;
$filePath = realpath(__DIR__ . '/../test.coverage');
if (file_exists($filePath)) {
    $xml = simplexml_load_file($filePath);
    $packageFiles = $xml->project->package->file;
    $microPath = realpath(__DIR__ . '/../');
    echo PHP_EOL;
    foreach ($packageFiles as $file) {
        /** @var SimpleXMLElement $file */
        $total = (float)$file->metrics->attributes()->elements;
        if ($total > 0) {
            $covered = (float)$file->metrics->attributes()->coveredelements;
            $coveredCoeff = $covered / $total;
            if ($coveredCoeff < 0.5) {
                $fileName = (string)$file->attributes()->name;
                echo 'File: (' . str_replace($microPath, '', $fileName) . ') coverage(' . (round(
                        $coveredCoeff * 100,
                        3
                    )) . ' %), atleast required 50%' . PHP_EOL;
                $exit = 1;
            }
        }
    }

} else {
    echo 'File: ' . $filePath . ' doesnt exists!';
    $exit = 2;
}

exit($exit);