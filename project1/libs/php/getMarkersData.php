<?php
    header("Access-Control-Allow-Origin: *"); // Allow all origins
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allow specific methods
    header("Access-Control-Allow-Headers: Content-Type, Authorization, User-Agent"); // Allow specific headers
    header('Content-Type: application/json; charset=UTF-8'); 

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);

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

    /*Response
	$output['status']['code'] = "200"; 
	$output['status']['name'] = "ok"; 
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = [];*/

    $cityMarkers = [];
    $airportMarkers = [];

    // Base URLs for Geonames API
    $geoUsername = "flightltd"; // Replace with your Geonames username
    $citiesUrl = "http://api.geonames.org/searchJSON?formatted=true&q=city&country=$country&maxRows=25&lang=en&username=$geoUsername&style=full";
    $airportsUrl = "http://api.geonames.org/searchJSON?formatted=true&q=airport&country=$country&maxRows=25&lang=en&username=$geoUsername&style=full";

    /*GET CITIES
    $citiesUrl = "http://api.geonames.org/searchJSON?formatted=true&q=city&maxRows=195&lang=en&username=flightltd&style=full&country=";
    $citiesResponse = file_get_contents($citiesUrl); // Get city data
    $citiesData = json_decode($citiesResponse, true);*/
    
    // Fetch and process cities data
    $citiesResponse = @file_get_contents($citiesUrl); // Suppress warnings with @
    if ($citiesResponse) {
        $citiesData = json_decode($citiesResponse, true);
        if (isset($citiesData['geonames']) && count($citiesData['geonames']) > 0) {
            foreach ($citiesData['geonames'] as $city) {
                $cityMarkers[] = [
                    "name" => $city['name'] ?? 'Unknown',
                    "lat" => $city['lat'] ?? 0,
                    "lng" => $city['lng'] ?? 0,
                    "type" => 'City',
                    "countryCode" => $city['countryCode'] ?? 'Unknown'
                ];
            }
        }
    } else {
        error_log("Error fetching cities data for country: $country");
    }

    // Fetch and process airports data
    $airportsResponse = @file_get_contents($airportsUrl); // Suppress warnings with @
    if ($airportsResponse) {
        $airportsData = json_decode($airportsResponse, true);
        if (isset($airportsData['geonames']) && count($airportsData['geonames']) > 0) {
            foreach ($airportsData['geonames'] as $airport) {
                $airportMarkers[] = [
                    "name" => $airport['name'] ?? 'Unknown',
                    "lat" => $airport['lat'] ?? 0,
                    "lng" => $airport['lng'] ?? 0,
                    "type" => 'Airport',
                    "countryCode" => $airport['countryCode'] ?? 'Unknown'
                ];
            }
        }
    } else {
        error_log("Error fetching airports data for country: $country");
    }

    // Limit the number of markers to 50 (25 cities + 25 airports)
    $filteredCities = array_slice($cityMarkers, 0, 25); // Get up to 25 cities
    $filteredAirports = array_slice($airportMarkers, 0, 25); // Get up to 25 airports

    // Prepare final response
    $output = [
        "status" => [
            "code" => "200",
            "name" => "ok",
            "description" => "success",
            "returnedIn" => intval((microtime(true) - $executionStartTime) * 1000) . " ms"
        ],
        "data" => [
            "cities" => $filteredCities,
            "airports" => $filteredAirports
        ]
    ];
	
	
	echo json_encode($output);
?>