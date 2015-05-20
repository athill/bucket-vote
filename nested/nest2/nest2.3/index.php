<?php 
require('../../../conf/setup.php');
$local = [
	'layout'=>[
		'leftsidebar'=> [['type'=>'menu', 'start'=>'/nested/']],
	],
	'jsModules'=>['treemenu'=>true]
];

$page = new \Athill\Utils\Page($local);

$page->end();
