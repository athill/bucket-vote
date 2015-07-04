<?php
require_once('conf/setup.php');
$datafile = $site['fileroot'].'/data/appdata.json';
$data = json_decode(file_get_contents($datafile), true);

$items = $data['items'];
sort($items);

$headers = array_merge([''], $items);

$buckets = array_keys($data['buckets']);
sort($buckets);

$tdata = [];
$totals = [];
foreach ($buckets as $bucket) {
	$row = [$bucket];
	foreach ($items as $item) {
		$cell = '';
		if (!in_array($item, $totals)) {
			$totals[$item] = 0;
		}
		if (in_array($item, $data['buckets'][$bucket])) {
			$cell = 'X';
			$totals[$item]++;
		}
		$row[] = $cell;
	}
	$tdata[] = $row;
}

$row = ['Totals:'];
foreach ($items as $item) {
	$row[] = "${totals[$item]}";
}
$tdata[] = $row;

$filename = 'bucket-vote-results.xls';
header('Content-type: application/ms-excel');
header('Content-Disposition: attachment; filename='.$filename);		
$h->simpleTable([
	'atts'=>'border="1"',
	'headers'=>$headers,
	'data'=>$tdata
]);