<?php
require_once('conf/setup.php');


$_SESSION['flash']['info'][] = 'test';
$local = [
	'layout'=>['rightsidebar'=>[]]
];

$page = new \Athill\Utils\Page($local);
//// content
$h->p('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sit amet tellus ultricies, malesuada ex non, porta odio. Nunc elementum bibendum vestibulum. Cras commodo tincidunt libero at suscipit. Vestibulum suscipit justo in pellentesque blandit. Vivamus hendrerit est lobortis eros aliquet bibendum. Ut sodales diam nibh, et tempor magna posuere ac. In tristique efficitur ornare. Phasellus pretium, sapien eu placerat vehicula, felis ex placerat sapien, vel venenatis felis felis non leo. Vivamus lorem lacus, consequat id euismod interdum, mollis a augue. ');

$h->a('/', 'link');

// $h->onav(['id'=>'mobile-menu', 'class'=>'accordion-menu']);
// $site['utils']['menu']->renderMenu([
// 	'depth'=>2,
// ]);
// $h->cnav('#/mobile-menu');
// $h->script("\$(function () {
//     \$('#mobile-menu').metisMenu({  
//     	 doubleTapToGo: true
//     });
// });");

// $t = '\Classes\Templates\DefaultTemplate';
// $test = new $t();



$page->end();