<?php
    header("Access-Control-Allow-Origin: *"); // Allow all origins
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allow specific methods
    header("Access-Control-Allow-Headers: Content-Type, Authorization, User-Agent"); // Allow specific headers

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);
    
    //Input validation
    $lat = isset($_GET['lat']) ? $_GET['lat'] : null;
    $lng = isset($_GET['lng']) ? $_GET['lng'] : null;
    $username = 'flightltd'; // Your Geonames username

    if (!$lat && !$lng) {
        http_response_code(400);
        echo json_encode(["status" => ["code" => 400, "description" => "No coordinates given."]]);
        exit;
    }
            
    $url = "https://api.geonames.org/countryCodeJSON?lat=$lat&lng=$lng&username=$username";
    
   /*cURL request */
	$ch = curl_init(); 
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url); 
	$result=curl_exec($ch); 
	curl_close($ch);

    $decode = json_decode($result,true); 

    // Handle cURL errors or invalid API responses
    if ($result === false || $httpCode !== 200) {
        http_response_code(500); // Internal Server Error
        echo json_encode([
            "status" => [
                "code" => 500,
                "description" => "Failed to retrieve data from Geonames API."
            ]
        ]);
        exit;
    }

    // Validate API response
    if (!$decode || !isset($decode[0])) {
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
	
	header('Content-Type: application/json; charset=UTF-8'); 
	echo json_encode($output);
?>