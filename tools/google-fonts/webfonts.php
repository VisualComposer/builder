<?php

$contents = file_get_contents(__DIR__ . '/webfonts.json');

$data = json_decode($contents, true);
$expectedFonts = <<<STR
Space Mono
Concert One
Work Sans
Neuton
Rubik One
Rubik
Bungee
Gentium Basic
Libre Baskerville
Cormorant Garamond
Lora
Bitter
Arvo
Copse
Cutive
Trocchi
Slabo 27px
Vesper Libre
Roboto
Roboto Slab
Roboto Condensed
Montserrat
Lato
Amiko
Mogra
Farsan
Suez One
Open Sans
Open Sans Condensed
Oswald
Source Sans Pro
Raleway
PT Sans
PT Sans Narrow
PT Serif
Merriweather
Proza Libre
Ubuntu
Droid Serif
Playfair Display
Muli
Lobster
Anton
Pacifico
Varela Round
Karla
Quicksand
Rokkitt
Shadows Into Light
Dancing Script
Abril Fatface
Vollkorn
Sanchez
Domine
Covered By Your Grace
Josefin Slab
Comfortaa
Chewy
Yellowtail
Kaushan Script
Satisfy
Istok Web
Kreon
Source Serif Pro
Noticia Text
Courgette
Arapey
Philosopher
Quattrocento
Kalam
Fredoka One
Vidaloka
Nothing You Could Do
Rasa
Scada
Scope One
Prata
STR;

$fonts = explode("\n", $expectedFonts);
sort($fonts, SORT_NATURAL | SORT_FLAG_CASE);

$output = [];
foreach ($data['items'] as $item) {
    $family = $item['family'];
    if (in_array($family, $fonts)) {
        $output[] = [
            'family' => $family,
            'variants' => $item['variants'],
        ];
    }
}

usort(
    $output,
    function ($a, $b) use ($fonts) {
        return array_search($a['family'], $fonts) > array_search($b['family'], $fonts);
    }
);

echo json_encode($output);
