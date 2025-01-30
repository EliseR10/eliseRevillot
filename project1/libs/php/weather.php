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
    $units = 'metric';

    //Check that you have the valid necessary data for API
    if (empty($latitude) || empty($longitude)) {
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

    /*Precise units to get the Celsius otherwise Kelvin is the default*/
	$url = "https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=${units}&appid=${API_KEY}";

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
	$output['data'] = [];

    if (isset($decode['list']) && !empty($decode['list'])) {
        $forecastData = $decode['list']; // The forecast data
        $dailyForecasts = []; // To store the forecasts for 3 days
    
        // Loop through forecast data and group by date and time
        foreach ($forecastData as $forecast) {
            $date = date("Y-m-d", strtotime($forecast['dt_txt'])); // Extract the date
            $temp = $forecast['main']['temp'];
            $description = $forecast['weather'][0]['description'];
            $iconCode = $forecast['weather'][0]['icon'];
    
            // Initialize the daily forecast if not already set
            if (!isset($dailyForecasts[$date])) {
                $dailyForecasts[$date] = [
                    'min_temp' => $temp,
                    'max_temp' => $temp,
                    'description' => $description,
                    'icon' => "https://openweathermap.org/img/wn/{$iconCode}@2x.png"
                ];
            } else {
                // Update min and max temp
                $dailyForecasts[$date]['min_temp'] = min($dailyForecasts[$date]['min_temp'], $temp);
                $dailyForecasts[$date]['max_temp'] = max($dailyForecasts[$date]['max_temp'], $temp);
            }
        }
    
        // Limit to the next 3 days
        $limitedForecasts = array_slice($dailyForecasts, 0, 3, true); //true to preserve keys
    
        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['status']['description'] = "success";
        $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
        $output['data'] = $limitedForecasts;
    } else {
        $output['status']['code'] = 404;
        $output['status']['name'] = "error";
        $output['status']['description'] = "No weather information found.";
        $output['data'] = [];
    }

	header('Content-Type: application/json; charset=UTF-8'); 
	echo json_encode($output);
?>