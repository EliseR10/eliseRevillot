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

    // Limit of markers
    $maxMarkers = 50;
    $cityMarkers = [];
    $airportMarkers = [];

    /*GET CITIES*/
    $citiesUrl = "http://api.geonames.org/searchJSON?formatted=true&q=${country}&maxRows=10&lang=en&username=flightltd&style=full";
    
    /*cURL request*/
    $ch = curl_init($citiesUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $citiesResponse = curl_exec($ch);
    curl_close($ch);

    $citiesData = json_decode($citiesResponse, true);
    
    if (isset($citiesData['geonames']) && count($citiesData['geonames']) > 0) {
        //Collect cities data, but limit to $maxMarkers - 25
        foreach(array_slice($citiesData['geonames'], 0, 25) as $city) {
            $city['type'] = 'City';
            $city['countryCode'] = $city['countryCode'] ?? 'unknown'; 
            $cityMarkers[] = $city;
        }
    }

    /*GET AIRPORTS*/
    $airportUrl = "http://api.geonames.org/searchJSON?formatted=true&q=${country}&maxRows=10&type=airport&lang=en&username=flightltd&style=full";
    
    /*cURL request*/
    $ch = curl_init($airportUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $airportResponse = curl_exec($ch);
    curl_close($ch);

    $airportData = json_decode($airportResponse, true);
    
    if (isset($airportData['geonames']) && count($airportData['geonames']) > 0) {
        // Collect airport data, but limit to $maxMarkers - 25
        foreach(array_slice($airportData['geonames'], 0, 25) as $airport) {
            $airport['type'] = 'Airport';
            $airport['countryCode'] = $airport['countryCode'] ?? 'unknown'; 
            $airportMarkers[] = $airport;
        }
    }

    //Combine cities and airport
    $combinedMarkers = array_merge($cityMarkers, $airportMarkers);

    //Shuffle the combined markers to spread them
    shuffle($combinedMarkers);

    //Limit the number of markers to 50
    $combinedMarkers = array_slice($combinedMarkers, 0, $maxMarkers);

    //Response
	$output['data'] = [
        "markers" => $combinedMarkers
    ];
	
	header('Content-Type: application/json; charset=UTF-8'); 
	echo json_encode($output);
?>