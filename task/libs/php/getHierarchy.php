<?php
	header("Access-Control-Allow-Origin: *"); // Allow all origins
	header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allow specific methods
	header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow specific headers

	//These lines turn on error reporting and are useful during development.This should be removed in a production environment to avoid exposing sensitive information.
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

    //Captures the start time of the script to calculate how long the script takes to execute.
	$executionStartTime = microtime(true);

	//This line of code constructs a URL dynamically to make an API request to GeoNames. 
	
	$url = 'http://api.geonames.org/hierarchyJSON?formatted=true&geonameId=' . $_REQUEST['geonameidHierarchy'] . '&username=flightltd&style=full';


	/*cURL request */
	$ch = curl_init(); //initialize a new cURL session
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); //Disables SSL certificate verification.Normally, cURL verifies the authenticity of SSL certificates for secure HTTPS requests.
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); //Ensures the cURL execution result is returned as a string instead of being directly output to the browser or script.
	curl_setopt($ch, CURLOPT_URL,$url); //Specifies the URL to which the HTTP request will be sent.
	$result=curl_exec($ch); //Executes the prepared cURL request and stores the result in the $result variable.
	curl_close($ch); //Closes the cURL session.

	
	$decode = json_decode($result,true); //Decodes the JSON response into a PHP data structure (array or object).

	$output['status']['code'] = "200"; //Sets the HTTP status code in the response.
	$output['status']['name'] = "ok"; //Provides a human-readable name for the status code.
	$output['status']['description'] = "success"; //Adds a description of the operation's outcome.
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms"; //Calculates and logs the time taken to process the request.
	$output['data'] = $decode['geonames'] ?? []; //Stores the actual data (e.g., from the API response) in the data key of the $output array.
	
	
	header('Content-Type: application/json; charset=UTF-8'); //Informs the client that the response is in JSON format.
	echo json_encode($output); //Converts the $output array into a JSON string and sends it to the client.

?>