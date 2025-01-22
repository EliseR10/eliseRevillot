<?php
    header("Access-Control-Allow-Origin: *"); // Allow all origins
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allow specific methods
    header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow specific headers

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$url = 'https://api.openweathermap.org/data/2.5/weather?lat=$latitude&lon=$longitude&appid=YOUR_API_KEY' . $_REQUEST['country'] . '&username=flightltd&style=full';

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
	$output['data'] = $decode['geonames'] ?? []; 
	
	
	header('Content-Type: application/json; charset=UTF-8'); 
	echo json_encode($output);

    /*No more than one call in 10 minutes for each location*/

    /*only api endpoint to use for free api.openweathermap.org*/

    /*Query by city and country code:https://api.openweathermap.org/data/2.5/weather?q=Tirana,AL&appid=YOUR_API_KEY*/

    /*Query by coordinate: https://api.openweathermap.org/data/2.5/weather?lat=41.3275&lon=19.8189&appid=YOUR_API_KEY*/
    /*Find by country code*/

?>