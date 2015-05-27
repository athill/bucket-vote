<?php
require_once('conf/setup.php');
$local=[];

$page = new \Athill\Utils\Page($local);
//// content

$h->div('', ['id'=>'buckets']);


$h->div('', ['id'=>'items']);

addForm('items');

$page->end();

//// helpers
function addForm($type) {
	global $h;
	$h->ofieldset('Add '.ucfirst($type).' (Separate values by semi-colons)');
	$h->oform('', 'get', ['id'=>'add-'.$type.'-form', 'class'=>'form-inline add-form']);
	$h->odiv(['class'=>'form-group']);
	$h->label('add-'.$type, 'Name: ');
	$h->intext('add-'.$type, '', ['class'=>'form-control add-field']);
	$h->cdiv();
	$h->submit('s', 'Add', ['class'=>'btn btn-primary']);
	$h->cform();
	$h->cfieldset();	
}