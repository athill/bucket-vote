<?php
require_once('conf/setup.php');
$local=[];

$page = new \Athill\Utils\Page($local);

//// vars
$host = $_SERVER['HTTP_HOST'];
$demohost = 'localhost:8000';
// $demohost = 'bucketvote.andyhill.us';
$github = 'https://github.com/athill/bucket-vote';
$isDemo = $host == $demohost;

//// demo alert
if ($isDemo) {
	$h->div('<strong>In demo mode. Data is only saved for the current browser session.</strong>
		To persist data, download from '.$h->rtn('a', [$github]).'',
		['class'=>'alert alert-danger', 'role'=>'alert', 'id'=>'demo-alert']);
}


//// Help panel
$h->sb();
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
$body = $h->eb();
togglablePanel([
	'atts'=>['id'=>'help'],
	'title'=>'Help',
	'body'=>$body
]);

//// Setup panel
$h->sb();
$h->oform('', 'get', ['id'=>'conf-form', 'class'=>'container']);
////// row
$h->odiv(['class'=>'row']);
$h->odiv(['class'=>'form-group']);
//// label
$h->odiv(['class'=>'col-md-2']);
$h->label('bucketlimit', 'Bucket Limit: ');
$h->cdiv();
//// field
$h->odiv(['class'=>'col-md-5']);
$h->number('bucketlimit', 10, ['class'=>'form-control']);
$h->cdiv();
$h->div('&nbsp;', ['class'=>'col-md-1']);
$h->cdiv('/.form-group');
$h->cdiv('/.row');
$h->cform();
$h->p('Separate individual buckets and items with semi-colons.');
//// Add buckets
renderAddForm('buckets');
//// Add items
renderAddForm('items');
$body = $h->eb();

togglablePanel([
	'atts'=>['id'=>'setup'],
	'title'=>'Setup',
	'body'=>$body
]);

//// buckets
$h->ofieldset('Buckets');
$h->div('', ['id'=>'buckets']);
$h->cfieldset();

//// items
$h->ofieldset('Items');
$h->div('', ['id'=>'items']);
$h->cfieldset();

//// toolbar
$h->osection(['id'=>'toolbar']);
$h->button('Sort items by vote', ['class'=>'btn btn-warning', 'id'=>'sort-by-vote']);
if (!$isDemo) {
	$h->a('./spreadsheet.php', 'Download', 
		['class'=>'btn btn-warning', 
		'target'=>'_blank'
	]);
}
$h->csection('/#toolbar');

$page->end();

//// helpers
function togglablePanel($opts=[]) {
	global $h;
	$defaults = [
		'atts'=>[],
		'title'=>'',
		'body'=>''
	];
	$opts = $h->extend($defaults, $opts);
	$atts = $opts['atts'];
	$atts['class'] = 'panel panel-default';

	$h->odiv($atts);
	$title = $h->rtn('h3', [$opts['title'], ['class'=>'panel-title']]);
	$h->div($title, ['class'=>'panel-heading toggler']);
	$h->odiv(['class'=>'toggle panel-body']);
	$h->tnl($opts['body']);
	$h->cdiv('/.panel-body');
	$h->cdiv('/.panel');
}


function renderAddForm($type) {
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
	$h->submit('s', 'Add', ['class'=>'btn btn-primary btn-sm']);
	$h->cdiv();
	$h->cdiv('/.form-group');
	$h->cdiv('/.row');
	$h->cform('/.'.$id);
}