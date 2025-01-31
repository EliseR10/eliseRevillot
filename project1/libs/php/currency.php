<?php
    header("Access-Control-Allow-Origin: *"); // Allow all origins
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allow specific methods
    header("Access-Control-Allow-Headers: Content-Type, Authorization, User-Agent"); // Allow specific headers

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
    $API_KEY = $_SERVER['OpenExchangeRate'];
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

    //Use country code to get currency code from Rest Countries API
    $restCountriesUrl = "https://restcountries.com/v3.1/alpha/$country";
    /*cURL request*/
    $ch = curl_init($restCountriesUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $restResponse = curl_exec($ch);
    curl_close($ch);

    $countryData = json_decode($restResponse, true);

    if (!$countryData || !isset($countryData[0]['currencies'])) {
        http_response_code(404);
        echo json_encode(["status" => ["code" => 404, "description" => "Invalid country code or no currency found."]]);
        exit;
    }

    $currencyCode = array_key_first($countryData[0]['currencies']);
    $currencyDetails = $countryData[0]['currencies'][$currencyCode];

    
    //Get exchange rate with the currency code from OpenExchangeRate API
    $exchangeRatesUrl = "https://openexchangerates.org/api/latest.json?app_id=$API_KEY";
    /*cURL request*/
    $ch = curl_init($exchangeRatesUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $exchangeResponse = curl_exec($ch);
    curl_close($ch);

    $exchangeData = json_decode($exchangeResponse, true);
    
    if (!$exchangeData || !isset($exchangeData['rates'][$currencyCode])) {
        http_response_code(500);
        echo json_encode(["status" => ["code" => 500, "description" => "Unable to fetch exchange rates."]]);
        exit;
    }

    //Response
	$output['status']['code'] = "200"; 
	$output['status']['name'] = "ok"; 
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = [
        "currencyCode" => $currencyCode ?? 'N/A',
        "currencyName" => $currencyDetails['name'] ?? 'N/A',
        "currencySymbol" => $currencyDetails['symbol'] ?? null,
        "exchangeRate" => $exchangeData['rates'][$currencyCode] ?? 'N/A'
    ];
	
	header('Content-Type: application/json; charset=UTF-8'); 
	echo json_encode($output);

?>