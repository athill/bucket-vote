<?php
require('../conf/setup.php');

$local = [];

$page = new \Athill\Utils\Page($local);

$defs = [
	'login'=>[
		'label'=>'Login'
	],
	'password'=>[
		'fieldtype'=>'password',
		'label'=>'Password'
	],
];

$layout = ['login', 'password', ];


// $fh = new \Athill\Utils\FieldHandler($defs);
// $fh->renderLabel('login');
// $fh->renderField('login');

$form = new FormHorizontal($defs, $layout);
$form->render(['leftcolwidth'=>3]);

Class FormHorizontal {
	private $defs;
	private $layout;
	private $fh;

	function __construct($defs, $layout) {
		$this->defs = $defs;
		$this->layout = $layout;
		$this->fh = new \Athill\Utils\Uft\FieldHandler($defs);
	}

	public function render($options=[]) {
		global $h;
		$defaults = [
			'leftcolwidth'=>2,
		];
		$options = $h->extend($defaults, $options);
		$leftcolwidth = $options['leftcolwidth'];
		if (!is_numeric($leftcolwidth) || $leftcolwidth > 10) {
			throw new Exception('Invalid "leftcolwidth" value. Numeric and less than 11');
		}
		$rightcolwidth = 12 - $leftcolwidth;
		if ($leftcolwidth + $rightcolwidth !== 12) {
			throw new Exception('bad addition');
		}
		$h->oform('', 'get', [ 'class'=>'form-horizontal' ]);
		foreach ($this->layout as $field) {
			$h->odiv([ 'class'=>'form-group' ]);
			$this->fh->renderLabel($field, ['class'=>'col-sm-'.$leftcolwidth.' control-label']);
			$h->odiv(['class'=>'col-sm-'.$rightcolwidth]);
			$this->fh->renderField($field);
			$h->cdiv();	//// field
			$h->cdiv(); //// form-group
		}
		$h->cform('/.form-horizontal');
	}

}

$page->end();