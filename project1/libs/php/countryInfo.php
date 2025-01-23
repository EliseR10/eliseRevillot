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

    $url = "https://restcountries.com/v3.1/alpha/${country}";

    /*cURL request */
	$ch = curl_init(); 
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url); 
	$result=curl_exec($ch); 
	curl_close($ch);

	$decode = json_decode($result,true); 

    // Validate API response
    if (!$decode || !isset($decode[0])) {
        http_response_code(404);
        echo json_encode([
            "status" => [
                "code" => 404,
                "name" => "error",
                "description" => "Country not found or invalid response."
            ]
        ]);
        exit;
    }

    $countryData = $decode[0]; //use the first result returned

    // Format the data received
    $countryName = $countryData['name']['common'] ?? 'Unknown';
    $capital = $countryData['capital'][0] ?? 'Unknown';
    $region = $countryData['region'] ?? 'Unknown';
    $subregion = $countryData['subregion'] ?? 'N/A';
    $area = $countryData['area'] ?? 'N/A';
    $population = $countryData['population'] ?? 'N/A';

    // Convert the language to a readable string
    $languages = $countryData['languages'] ?? [];
    $languageList = !empty($languages) ? implode(', ', $languages) : 'N/A';

	$output['status']['code'] = "200"; 
	$output['status']['name'] = "ok"; 
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = [
        "countryName" => $countryName,
        "capital" => $capital,
        "region" => $region,
        "subregion" => $subregion,
        "area" => $area,
        "population" => $population,
        "language" => $languageList
    ];
	
	header('Content-Type: application/json; charset=UTF-8'); 
	echo json_encode($output);
?>