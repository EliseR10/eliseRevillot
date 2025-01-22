<?php
    header("Access-Control-Allow-Origin: *"); // Allow all origins
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allow specific methods
    header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow specific headers

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

    // Load environment variables
    function loadEnv($filePath) {
        if (!file_exists($filePath)) {
            throw new Exception("Environment file not found: $filePath");
        }
        $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos(trim($line), '#') === 0 || strpos(trim($line), '=') === false) {
                continue; // Skip comments and malformed lines
            }
            list($name, $value) = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value);

            $_SERVER[$name] = $value;
            $_ENV[$name] = $value;
        }
    }

    loadEnv(__DIR__ . '/../../.env');

    // Access API key
    $API_KEY = $_SERVER['OpenWeather_API_Key'];
    
    $latitude = $_GET['latitude'] ?? null;
    $longitude = $_GET['longitude'] ?? null;

    //Check that you have the valid necessary data for API
    if (!$latitude && !$longitude) {
        http_response_code(400);
        echo json_encode([
            "status" => [
                "code" => "400",
                "name" => "bad_request",
                "description" => "Latitude and Longitude required."
            ]
        ]);
        exit();
    }

	$url = "https://api.openweathermap.org/data/2.5/weather?lat=$latitude&lon=$longitude&appid=$API_KEY";

    /*cURL request */
	$ch = curl_init(); 
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url); 
	$result=curl_exec($ch); 
	curl_close($ch);

	$decode = json_decode($result,true); 

	$output['status']['code'] = "200"; 
	$output['status']['name'] = "ok"; 
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = [
        "location" => $decode['name'] ?? 'Unknown',
        "temperature" => $decode['main']['temp'] ?? 'Unknown',
        "description" => $decode['weather'][0]['description'] ?? 'Unknown',
        "wind_speed" => $decode['wind']['speed'] ?? 'N/A'
    ];
	
	header('Content-Type: application/json; charset=UTF-8'); 
	echo json_encode($output);

    /*No more than one call in 10 minutes for each location*/

    /*only api endpoint to use for free api.openweathermap.org*/

    /*Query by city and country code:https://api.openweathermap.org/data/2.5/weather?q=Tirana,AL&appid=YOUR_API_KEY*/

    /*Query by coordinate: https://api.openweathermap.org/data/2.5/weather?lat=41.3275&lon=19.8189&appid=YOUR_API_KEY*/
    /*Find by country code*/

?>