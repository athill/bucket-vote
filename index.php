<?php
require_once('conf/setup.php');
$local=[];

$page = new \Athill\Utils\Page($local);
//// content

$host = $_SERVER['HTTP_HOST'];
$demohost = 'localhost:8000';
// $demohost = 'bucketvote.andyhill.us';
$github = 'https://github.com/athill/bucket-vote';

if ($host == $demohost) {
	$h->div('<strong>In demo mode. Data is only saved for the current browser session.</strong>
		To persist data, download from '.$h->rtn('a', [$github]).'',
		['class'=>'alert alert-danger', 'role'=>'alert', 'id'=>'demo-alert']);
}


//// Help
//$h->i('', ['class'=>'fa fa-question-circle fa-2x pull-right', 'id'=>'help-button']);
$h->sb();
$h->odiv(['class'=>'panel panel-default', 'id'=>'help']);

$header = $h->rtn('h3', ['Help', ['class'=>'panel-title']]);
$h->div($header, ['class'=>'panel-heading']);
$h->odiv(['class'=>'toggle panel-body']);
$h->p('Bucket vote came up because we had a committee that needed to nominate another committee. 
	Say the present committee has 10 members, the new committee will have 7, and there are 
	12 candidates. You would then have 10 buckets, 12 items, and a "Bucket Limit" of 7. As 
	you drop items (candidates) into buckets (voters), the number of items in a`
	bucket and the number of buckets an item is in are updated.');
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
addForm2('buckets');
//// Add items
addForm2('items');
$h->cdiv('/.toggle');
$h->cdiv('/.panel');

//// buckets
$h->ofieldset('Buckets');
$h->div('', ['id'=>'buckets']);
$h->cfieldset();

$h->ofieldset('Items');
$h->div('', ['id'=>'items']);
$h->cfieldset();

$page->end();


function gridForm($options) {
	$defaults = [
		'fields'=>[],
		'rows'=>[],

	];
}

function addForm2($type) {
	global $h;
	$id = 'add-'.$type.'-form';
	$h->oform(['id'=>$id, 'class'=>'container add-form']);
	////// row
	$h->odiv(['class'=>'row']);
	$h->odiv(['class'=>'form-group']);
	//// label
	$h->odiv(['class'=>'col-md-2']);
	$h->label('add-'.$type, 'Add '.ucfirst($type).': ');
	$h->cdiv();
	//// field
	$h->odiv(['class'=>'col-md-5']);
	$h->intext('add-'.$type, '', ['class'=>'form-control add-field', 'size'=>'50']);
	$h->cdiv();	
	//// submit button
	$h->odiv(['class'=>'col-md-1']);
	$h->submit('s', 'Add', ['class'=>'btn btn-primary']);
	$h->cdiv();
	$h->cdiv('/.form-group');
	$h->cdiv('/.row');
	$h->cform('/.'.$id);
}

//// helpers
function addForm($type) {
	global $h;
	$h->oform(['id'=>'add-'.$type.'-form', 'class'=>'form-inline add-form']);
	//// fields
	$h->odiv(['class'=>'form-group row']);

	$h->label('add-'.$type, 'Add '.ucfirst($type).': ');
	$h->intext('add-'.$type, '', ['class'=>'form-control add-field', 'size'=>'50']);
	$h->cdiv();
	//// buttons
	$h->submit('s', 'Add', ['class'=>'btn btn-primary']);
	$h->cform();
}


// function addForm2($type) {
// 	$atts = [
// 		'id'=>'add-'.$type.'-form', 
// 		'class'=>'form add-form'
// 	];


// 	$fields = [
// 		'add-'.$type => [
// 			'label' => 'Add '.ucfirst($type).': ',
// 			'atts' => ['class'=>'form-control add-field', 'size'=>'50']
// 		]
// 	];


// 	$buttons =[
// 		[
// 			'name'=>'s',
// 			'fieldtype' => 'button',
// 			'label' => 'Add',
// 			'atts' => ['type'=>'submit', 'class'=>'btn btn-primary']
// 		]
// 	];



// 	$options = [
// 		'atts'=>$atts,
// 		'fields'=>$fields,
// 		'buttons'=>$buttons

// 	];

// 	dictionaryForm($options);
// }






// function dictionaryForm($options) {
// 	global $h;
// 	$defaults = [
// 		'atts' = [],
// 		'fields'=>[],
// 		'buttons'=>[]
// 	];
// 	$options = $h->extend($defaults, $options);
// 	$h->oform($options['atts']);
// 	foreach ($options['fields'] as $id => $opts) {
// 		# code...
// 	}
// 	foreach ($options['buttons'] as $button) {
// 		# code...
// 	}

// 	$h->cform();
// }



