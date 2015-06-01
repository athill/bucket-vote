<?php
require_once('conf/setup.php');

$request = $_GET;
$datafile = $site['fileroot'].'/data/appdata.json';
$return = [];
// echo 'in here';
// print_r($request);

if (isset($request['action'])) {
	switch($request['action']) {
		case 'add-to-items':
			if (isset($request['items'])) {
				$data = getData();
				$data['items'] = array_merge($data['items'], $request['items']);
				putData($data);
			}
			break;			
		case 'delete-from-items':
			if (isset($request['item'])) {
				$data = getData();
				$item = $request['item'];
				//// remove from items array
				$data['items'] = deleteFromArray($data['items'], $item);
				//// remove from buckets
				foreach ($data['buckets'] as $bucket => $items) {
					$data['buckets'][$bucket] = deleteFromArray($data['buckets'][$bucket], $item);
				}
				putData($data);	
			}
			break;
		case 'add-to-buckets':
			if (isset($request['buckets'])) {
				$data = getData();
				$buckets = $request['buckets'];
				foreach ($buckets as $bucket) {
					$data['buckets'][$bucket] = [];
				}
				putData($data);				
			}
			break;
		case 'delete-from-buckets':
			if (isset($request['bucket'])) {
				$bucket = $request['bucket'];
				$data = getData();
				unset($data['buckets'][$bucket]);
				putData($data);
			}
			break;
		case 'add-item-to-bucket':
			if (isset($request['bucket']) && isset($request['item'])) {
				$data = getData();
				$bucket = $request['bucket'];
				if (!isset($data['buckets'][$bucket])) {
					$data['buckets'][$bucket] = [];
				}
				$data['buckets'][$bucket][] = $request['item'];
				putData($data);				
			}
			break;
		case 'delete-item-from-bucket':
			if (isset($request['bucket']) && isset($request['item'])) {
				$data = getData();
				$bucket = $request['bucket'];
				$item = $request['item'];
				$data['buckets'][$bucket] = deleteFromArray($data['buckets'][$bucket], $item);
				putData($data);
			}
			break;	
		case 'delete-items-from-buckets':
			if (isset($request['removes'])) {
				$data = getData();
				foreach ($request['removes'] as $bucket => $items) {
					foreach ($items as $item) {
						$data['buckets'][$bucket] = deleteFromArray($data['buckets'][$bucket], $item);
					}
				}
				putData($data);
			}
			break;
		case 'update-bucketlimit':
			if (isset($request['bucketlimit'])) {
				$data = getData();
				$data['conf']['bucketlimit'] = $request['bucketlimit'];
				putData($data);	
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

function getData() {
	global $datafile;
	$data = [
		'conf'=>['bucketlimit'=>10],
		'buckets'=>[],
		'items'=>[]
	];
	if (file_exists($datafile)) {
		$data = json_decode(file_get_contents($datafile), true);
	} 
	return $data;
}

function putData($data) {
	global $datafile;
	file_put_contents($datafile, json_encode($data));
}


