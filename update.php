<?php
require_once('conf/setup.php');

$request = $_GET;
$dataroot = $site['fileroot'].'/data';
$return = [];
// echo 'in here';

if (isset($request['action'])) {
	switch($request['action']) {
		case 'add-to-bucket':
			if (isset($request['bucket']) && isset($request['item'])) {
				$mappings = getData('mappings');
				$bucket = $request['bucket'];
				if (!isset($mappings[$bucket])) {
					$mappings[$bucket] = [];
				}
				$mappings[$bucket][] = $request['item'];
				putData('mappings', $mappings);				
			}
			break;
		case 'add-to-items':
			if (isset($request['item'])) {
				$items = getData('items');
				$items[] = $request['item'];
				putData('items', $items);
			}
			break;
		case 'delete-from-bucket':
			if (isset($request['bucket']) && isset($request['item'])) {
				$mappings = getData('mappings');
				$bucket = $request['bucket'];
				$item = $request['item'];
				$mappings[$bucket] = deleteFromArray($mappings[$bucket], $item);
				putData('mappings', $mappings);				
			}
			break;
		case 'delete-from-items':
			if (isset($request['item'])) {
				$items = getData('items');
				$item = $request['item'];
				$items = deleteFromArray($items, $item);
				putData('items', $items);
				$mappings = getData('mappings');
				foreach ($mappings as $bucket => $items) {
					$mappings[$bucket] = deleteFromArray($mappings[$bucket], $item);
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


