<?php 
require('../conf/setup.php');
$local = [
	'layout'=>[
		'leftsidebar'=> [['type'=>'content', 'content'=>'left side bar']],
	],
];

$page = new \Athill\Utils\Page($local);

$page->end();
