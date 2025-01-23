<?php
    $geoJsonFile = 'http://127.0.0.1:5500/project1/libs/json/countryBorders.geo.json'; // Replace with your file path
    $geoJson = file_get_contents($geoJsonFile);

    $geoJsonData = json_decode($geoJson, true);

    $country = $_GET['country'] ?? null;

    //Check if country is provided
    if (!$country) {
        http_response_code(400);
        echo json_encode([
            "status" => [
                "code" => 400,
                "name" => "error",
                "description" => "Country parameter is required."
            ]
        ]);
        exit;
    }

    //Find the country by `name` or `iso_a2` in the GeoJSON
    $countryGeometry = null;
    foreach ($geoJsonData['features'] as $feature) {
        if ($feature['properties']['iso_a2'] === $country || $feature['properties']['name'] === $country) {
            $countryGeometry = $feature['geometry'];
            break;
        }
    }

    if (!$countryGeometry) {
        http_response_code(404);
        echo json_encode(["error" => "Country not found in the GeoJSON file."]);
        exit;
    }

    // Respond with the country's geometry
    header('Content-Type: application/json');
    echo json_encode([
        "status" => "success",
        "country" => $country,
        "geometry" => $countryGeometry
    ]);
?>