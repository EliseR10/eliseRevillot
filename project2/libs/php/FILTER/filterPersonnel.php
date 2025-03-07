<?php
    header("Access-Control-Allow-Origin: *"); // Allow all origins
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); // Allow specific methods
    header("Access-Control-Allow-Headers: Content-Type, Authorization, User-Agent"); // Allow specific headers
	// example use from browser
	// http://localhost/companydirectory/libs/php/getDepartmentByID.php?id=<id>

	// remove next two lines for production	

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("../config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];
		
		mysqli_close($conn);

		echo json_encode($output);
		
		exit;

	}	

	$departmentID = isset($_REQUEST['departmentID']) ? $_REQUEST['departmentID'] : null;
	$locationID = isset($_REQUEST['locationID']) ? $_REQUEST['locationID'] : null;

	// SQL statement accepts parameters and so is prepared to avoid SQL injection.
	// $_REQUEST used for development / debugging. Remember to change to $_POST for production
	
	if ($departmentID) {
		$query = $conn->prepare('
        	SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name AS departmentName, d.id AS departmentID, l.name AS location 
        	FROM personnel p 
        	LEFT JOIN department d ON d.id = p.departmentID 
        	LEFT JOIN location l ON l.id = d.locationID 
        	WHERE d.id = ? 
        	ORDER BY p.lastName, p.firstName, d.name, l.name
    	');
		$query->bind_param("i", $departmentID);
	} else if ($locationID) {
		$query = $conn->prepare('
        	SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name AS departmentName, d.id AS departmentID, l.name AS location 
        	FROM personnel p 
        	LEFT JOIN department d ON d.id = p.departmentID 
        	LEFT JOIN location l ON l.id = d.locationID 
        	WHERE l.id = ? 
        	ORDER BY p.lastName, p.firstName, d.name, l.name
    	');
		$query->bind_param("i", $locationID);
	} else {
		$query = $conn->prepare('
        	SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name AS departmentName, d.id AS departmentID, l.name AS location 
        	FROM personnel p 
        	LEFT JOIN department d ON d.id = p.departmentID 
        	LEFT JOIN location l ON l.id = d.locationID 
        	ORDER BY p.lastName, p.firstName, d.name, l.name
    	');
	}

	$query->execute();
	
	if (false === $query) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		echo json_encode($output); 
	
		mysqli_close($conn);
		exit;

	}
    
    $result = $query->get_result();
   	$data = [];

	while ($row = mysqli_fetch_assoc($result)) {

		array_push($data, $row);

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;

	echo json_encode($output); 

	mysqli_close($conn);

?>