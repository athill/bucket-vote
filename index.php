<?php
require_once('conf/setup.php');
$local=[];

$page = new \Athill\Utils\Page($local);
//// content

$host = $_SERVER['HTTP_HOST'];
$demohost = 'localhost:8000';
$demohost = 'bucketvote.andyhill.us';
$github = 'https://github.com/athill/bucket-vote';

if ($host == $demohost) {
	$h->div('<strong>In demo mode. Data is only saved for the current browser session.</strong>
		To persist data, download from '.$h->rtn('a', [$github]).'',
		['class'=>'alert alert-danger', 'role'=>'alert', 'id'=>'demo-alert']);
}


//// Help
$h->i('', ['class'=>'fa fa-question-circle fa-2x pull-right', 'id'=>'help-button']);
$h->sb();
$h->odiv(['class'=>'panel panel-default', 'id'=>'help']);
$h->div($h->rtn('h3', ['Help', ['class'=>'panel-title']]), ['class'=>'panel-heading']);
$h->odiv(['class'=>'panel-body']);
$items = [
	'Click on "Setup" to toggle setup display',
	'Add buckets',
	'Add items',
	'Drag and drop items into buckets'
];
$h->ol($items);

$h->button('Got it!', ['class'=>'pull-right btn', 'id'=>'close-help-button']);
$h->cdiv('/.panel-body');
$h->cdiv('/.panel');
$helppanel = $h->eb();
$h->div($helppanel);




//// Administration
$h->odiv(['class'=>'panel panel-default', 'id'=>'setup']);
// $h->ofieldset('Setup <i class="fa fa-caret-square-o-down pull-right"></i>', ['id'=>'setup']);
$h->div($h->rtn('h3', ['Setup', ['class'=>'panel-title']]), ['class'=>'panel-heading']);
$h->odiv(['class'=>'toggle panel-body']);
//// Configuration
$h->oform('', 'get', ['id'=>'conf-form', 'class'=>'form-inline']);
$h->odiv(['class'=>'form-group']);
$h->label('bucketlimit', 'Bucket Limit: ');
$h->number('bucketlimit', '', ['class'=>'form-control add-field']);
$h->cdiv();
$h->cform();
//// Add buckets
addForm('buckets');
//// Add items
addForm('items');
$h->cdiv('/.toggle');
$h->odiv('/.panel');

//// buckets
$h->ofieldset('Buckets');
$h->div('', ['id'=>'buckets']);
$h->cfieldset();

$h->ofieldset('Items');
$h->div('', ['id'=>'items']);
$h->cfieldset();


$page->end();

//// helpers
function addForm($type) {
	global $h;
	// $h->ofieldset('Add '.ucfirst($type).' (Separate values by semi-colons)');
	$h->oform('', 'get', ['id'=>'add-'.$type.'-form', 'class'=>'form-inline add-form']);
	$h->odiv(['class'=>'form-group']);
	$h->label('add-'.$type, 'Add '.ucfirst($type).': ');
	$h->intext('add-'.$type, '', ['class'=>'form-control add-field', 'size'=>'50']);
	$h->cdiv();
	$h->submit('s', 'Add', ['class'=>'btn btn-primary']);
	$h->cform();
	// $h->cfieldset();	
}