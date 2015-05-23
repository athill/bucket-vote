<?php
require_once('conf/setup.php');

$request = $_GET;
$dataroot = $site['fileroot'].'/data';
$return = [];
// echo 'in here';

if (isset($request['action'])) {
	switch($request['action']) {
		case 'add-to-member-bucket':
			if (isset($request['member']) && isset($request['prospect'])) {
				$mappings = getData('mappings');
				$member = $request['member'];
				if (!isset($mappings[$member])) {
					$mappings[$member] = [];
				}
				$mappings[$member][] = $request['prospect'];
				putData('mappings', $mappings);				
			}
			break;
		case 'add-to-prospects':
			if (isset($request['prospect'])) {
				$prospects = getData('prospects');
				$prospects[] = $request['prospect'];
				putData('prospects', $prospects);
			}
			break;
		case 'delete-from-member-bucket':
			if (isset($request['member']) && isset($request['prospect'])) {
				$mappings = getData('mappings');
				putData('mappings', $mappings);				
			}
			break;
		case 'delete-from-prospects':
			if (isset($request['prospect'])) {
				$prospects = getData('prospects');
				$prospect = $request['prospect'];
				$prospects = deleteFromArray($prospects, $prospect);
				putData('prospects', $prospects);
				$mappings = getData('mappings');
				foreach ($mappings as $member => $prospects) {
					$mappings[$member] = deleteFromArray($mappings[$member], $prospect);
				}
				putData('mappings', $mappings);	
			}
			break;			
	}
}
header('Content-Type: application/json');
echo json_encode($return);

//// helpers
function deleteFromArray($array, $value) {
	$array = array_diff($array, [$value]);
	$array = array_values($array);
	return $array;
}

function getData($type) {
	global $dataroot;
	$data = [];
	$location = $dataroot.'/'.$type.'.json';
	if (file_exists($location)) {
		$data = json_decode(file_get_contents($location), true);
	}
	return $data;
}

function putData($type, $data) {
	global $dataroot;
	$location = $dataroot.'/'.$type.'.json';
	file_put_contents($location, json_encode($data));
}


