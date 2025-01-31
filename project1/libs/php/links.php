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
    $API_KEY = $_SERVER['NewsDataIo'];
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

    $url = "https://newsdata.io/api/1/latest?apikey=${API_KEY}&country=${country}&language=en";
    
    /*cURL request */
	$ch = curl_init(); 
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);
    $headers = [
        'User-Agent: Gazetteer',
    ];
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers); //add header for the request to be approved 
	$result=curl_exec($ch); 
	curl_close($ch);

	$decode = json_decode($result,true); 

	$output['status']['code'] = "200"; 
	$output['status']['name'] = "ok"; 
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = [];
    
    //Check if articles are available
    if (isset($decode['results']) && count($decode['results']) > 0) {
        $result = array_slice($decode['results'], 0, 4);

        foreach ($result as $article) {
        //Add the first article to the output
            $output['data'][] = [
                'title' => $article['title'] ?? 'No title available',
                'link' => $article['link'] ?? 'No link available',
                'image' => $article['image_url'] ?? './libs/no-image.png',
                'source' => isset($article['source_id']) ? ucwords(str_replace('-', ' ', $article['source_id'])) : 'No source available'
            ];
        }
    } else {
            $output['status']['code'] = 404;
            $output['status']['name'] = "error";
            $output['status']['description'] = "No articles found for the given country.";
            $output['data'] = [];
            exit;
    }
    
	header('Content-Type: application/json; charset=UTF-8'); 
	echo json_encode($output);

?>