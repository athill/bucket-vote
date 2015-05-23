<?php
require_once('conf/setup.php');
$local=[];

$page = new \Athill\Utils\Page($local);
//// content
$committee = ['Linda Coggin','Evelyn Foster','Alejandra Haddad','Julie Hammel','Gerrit Heitink','Andy Hill','Don Root','Nancy Truelove','Stephanie Worden'];
$utils = $site['utils']['utils'];
$location = $site['fileroot'].'/data/committee.json';


// file_put_contents($location, json_encode($committee));
$committee = json_decode(file_get_contents($location), true);
$h->div('', ['id'=>'committee']);


// $utils->writeJson($location, $committee);
$prospects = ['Ali Haddad','Bob Hammel','Gerrit Heitink','Michelle Heitink','Andy Hill','Alexander Like','Lance Like','Virginia McCartney','Lou Malcolmb','John Swanson','Stephanie Worden'];
$location = $site['fileroot'].'/data/prospects.json';


// file_put_contents($location, json_encode($prospects));
$prospects = json_decode(file_get_contents($location), true);
$h->div('', ['id'=>'prospects']);
$h->ofieldset('Add a Prospect');
$h->oform('', 'get', ['id'=>'add-prospect-form', 'class'=>'form-inline']);
$h->odiv(['class'=>'form-group']);
$h->label('add-prospect', 'Name: ');
$h->intext('add-prospect', '', ['class'=>'form-control']);
$h->cdiv();
$h->submit('s', 'Add', ['class'=>'btn btn-primary']);

$h->cform();
$h->cfieldset();

$page->end();