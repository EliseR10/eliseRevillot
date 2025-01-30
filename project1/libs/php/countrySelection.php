<?php
    header("Access-Control-Allow-Origin: *"); // Allow all origins
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allow specific methods
    header("Access-Control-Allow-Headers: Content-Type, Authorization, User-Agent"); // Allow specific headers

    $geoJsonFile = '../json/countryBorders.geo.json';
    $geoJson = file_get_contents($geoJsonFile);

    $geoJsonData = json_decode($geoJson, true);

    //Array to store the countrie's code and names
    $countries = [];

    foreach ($geoJsonData['features'] as $feature) {
        $countries[] = [
            'iso2' => $feature['properties']['iso_a2'],
            'name' => $feature['properties']['name']
        ];
    }

    // Sort the countries alphabetically by name
    usort($countries, function ($a, $b) {
        return strcmp($a['name'], $b['name']);
    });

    // Respond with the sorted list of countries
    header('Content-Type: application/json');
    echo json_encode($countries);
?>