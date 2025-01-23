<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, User-Agent");
    header('Content-Type: application/json; charset=UTF-8');

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);
    
    //Input validation
    $lat= $_GET['userLat'] ?? null;
    $lng = $_GET['userLng'] ?? null;

    if (empty($lat) || empty($lng)) {
        http_response_code(400);
        echo json_encode(["status" => ["code" => 400, "description" => "No coordinates given."]]);
        exit;
    }

    $url = "https://api.geonames.org/countryCodeJSON?lat=$lat&lng=$lng&username=flightltd&style=full";
    
    /*cURL request */
	$ch = curl_init(); 
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url); 
	$result=curl_exec($ch);  

    // Get HTTP response code
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($result === false || $httpCode !== 200) {
        // Log the cURL error for better debugging
        error_log("cURL error: " . curl_error($ch));
    
        http_response_code(500); // Internal Server Error
        echo json_encode([
            "status" => [
                "code" => 500,
                "description" => "Failed to retrieve data from GeoNames API. HTTP Code: $httpCode"
            ]
        ]);
        exit;
    }

    $decode = json_decode($result,true);
    

    //Validate response
    if (!$decode || !array_key_exists('countryCode', $decode)) {
        http_response_code(400);
        echo json_encode([
            "status" => [
                "code" => 400,
                "name" => "error",
                "description" => "Country not found or invalid response."
            ]
        ]);
        exit;
    }

    $output['status']['code'] = "200"; 
	$output['status']['name'] = "ok"; 
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = [
        "countryCode" => $decode['countryCode'],
        "countryName" => isset($decode['countryName']) ? $decode['countryName'] : null
    ];
	
	echo json_encode($output);
?>