<?php
    header("Access-Control-Allow-Origin: *"); // Allow all origins
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allow specific methods
    header("Access-Control-Allow-Headers: Content-Type, Authorization, User-Agent"); // Allow specific headers

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

    //Response
	$output['status']['code'] = "200"; 
	$output['status']['name'] = "ok"; 
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = [];

    $cityMarkers = [];
    $airportMarkers = [];

    /*GET CITIES*/
    $citiesUrl = "http://api.geonames.org/searchJSON?formatted=true&q=city&maxRows=195&lang=en&username=flightltd&style=full&country=";
    $citiesResponse = file_get_contents($citiesUrl); // Get city data
    $citiesData = json_decode($citiesResponse, true);
    
    if (isset($citiesData['geonames']) && count($citiesData['geonames']) > 0) {
        //Collect cities data
        foreach(array_slice($citiesData['geonames'], 0, 195) as $city) {
            $city['type'] = 'City';
            $city['countryCode'] = $city['countryCode'] ?? 'unknown'; 
            $cityMarkers[] = $city;
        }
    }

    /*GET AIRPORTS*/
    $airportUrl = "http://api.geonames.org/searchJSON?formatted=true&q=airport&maxRows=195&type=airport&lang=en&username=flightltd&style=full&country=";
    $airportResponse = file_get_contents($airportUrl); // Get airport data
    $airportData = json_decode($airportResponse, true);
    
    if (isset($airportData['geonames']) && count($airportData['geonames']) > 0) {
        // Collect airport data
        foreach(array_slice($airportData['geonames'], 0, 195) as $airport) {
            $airport['type'] = 'Airport';
            $airport['countryCode'] = $airport['countryCode'] ?? 'unknown'; 
            $airportMarkers[] = $airport;
        }
    }

    // Return filtered data for the selected countries
    if ($country) {
        $filteredCities = array_filter($cityMarkers, function($city) use ($country) {
            return $city['countryCode'] == $country;
        });

        $filteredAirports = array_filter($airportMarkers, function($airport) use ($country) {
            return $airport['countryCode'] == $country;
        });
    } else {
        // Return all cities and airports if no country is selected
        $filteredCities = $cityMarkers;
        $filteredAirports = $airportMarkers;
    }

    // Response
    $output['data'] = [
        "cities" => array_values($filteredCities),
        "airport" => array_values($filteredAirports)
    ];
	
	header('Content-Type: application/json; charset=UTF-8'); 
	echo json_encode($output);
?>