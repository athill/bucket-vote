<?php
$bower = '/bower_components';
//// TODO - create dist folder. preprocessing goes to dist folder, /js, /css get copied to /dist/...
$js = '/dist/js';
$css = '/dist/css';

return [
	//// TODO: 	- Fill in anything not in sequence, so only i.e., jquery, need to be in list
	////		- Convert string to array if passed into js or css
	'sequence'=>['jquery', 'fontawesome', 'bootstrap', 'superfish', 'treemenu', 'metisMenu'],
	'modules'=>[
		'jquery' => array(
			'root'=>$bower.'/jquery/dist',
			'js'=>array('/jquery.min.js')
		),
		'bootstrap'=>array(
			'js'=>array($bower.'/bootstrap/dist/js/bootstrap.min.js'),
			'css'=>array('/css/bootstrap.css')
		),
		'superfish'=>array(
			'js'=>[$bower.'/superfish/dist/js/superfish.min.js'],
			'css'=>[$bower.'/superfish/dist/css/superfish.css'],
		),
		'treemenu'=>array(
			'root'=>$bower.'/jquery.treeview',
			'js'=>['/jquery.treeview.js', '/demo/jquery.cookie.js'],
			'css'=>['/jquery.treeview.css']
		),
		'fontawesome'=>[
			'css'=>[$bower.'/fontawesome/css/font-awesome.min.css']
		],
		'metisMenu'=>[
			'js'=>[$bower.'/metisMenu/dist/metisMenu.js'],
			'css'=>[$bower.'/metisMenu/dist/metisMenu.min.css', '/css/metisMenuStyles.css']
		]
	]
];