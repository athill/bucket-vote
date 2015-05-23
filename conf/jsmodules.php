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
		'jquery' => [
			'js'=>['http://code.jquery.com/jquery-2.1.4.min.js']
		],
		'bootstrap'=>[
			'js'=>['https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js'],
			'css'=>['https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css']
		],
		'fontawesome'=>[
			'css'=>['//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css']
		],
		'jquery-ui'=>[
			'js'=>['http://code.jquery.com/ui/1.11.4/jquery-ui.min.js'],
			'css'=>['http://code.jquery.com/ui/1.11.4/themes/ui-darkness/jquery-ui.css']
		]
	]
];