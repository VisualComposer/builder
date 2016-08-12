<?php
/**
 * Small script to get color palette colors for colorpicker
 */

function hexcolor($c)
{
    $r = ($c >> 16) & 0xFF;
    $g = ($c >> 8) & 0xFF;
    $b = $c & 0xFF;

    return '#' . str_pad(dechex($r), 2, '0', STR_PAD_LEFT) . str_pad(dechex($g), 2, '0', STR_PAD_LEFT) . str_pad(
        dechex($b),
        2,
        '0',
        STR_PAD_LEFT
    );
}

$im = imagecreatefrompng("Color_Palette.png");
$size = getimagesize("Color_Palette.png");
$colors = [];
if ($size) {
    $y = 0;
    $prev = false;
    for ($y = 0; $y < $size[1]; $y++) {
        $current = imagecolorat($im, 0, $y);
        if ($prev !== $current) {
            $colors[] = hexcolor($current);
        }
        $prev = $current;
    }
}

echo json_encode($colors);
