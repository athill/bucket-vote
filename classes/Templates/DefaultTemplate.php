<?php namespace Classes\Templates;

class DefaultTemplate extends \Athill\Utils\Templates\DefaultTemplate {
	protected $jsModules = array('jquery', 'bootstrap', 'fontawesome', 'jquery-ui');
	protected $css = ['/css/default.css'];
	protected $js = ['/js/site.js'];



	protected function heading() {
		global $h, $site;
		$h->oheader(['id'=>'header']);
		$h->odiv(['class'=>'banner']);
		$h->odiv(['class'=>'row']);
		//// content
		$h->odiv(['id'=>'banner-content', 'class'=>'col-xs-10 col-md-12']);
		$h->h1($site['sitename']);
		$h->cdiv('#banner-content');
		$h->cdiv('/.row');
		$h->cdiv('./banner');
		// $h->odiv(['class'=>'top-nav']);
		// //// top menu
		// $this->menu([
		// 	'navatts'=>['class'=>'top-menu clearfix hidden-xs hidden-sm']
		// ]);
		// //// breadcrumbs
		// $this->breadcrumbs([ 
		// 	'navatts'=>['class'=>'breadcrumbs'] 
		// ]);		
		// $h->cdiv('/.top-nav');
		// $h->cheader('/#header');
		// //// mobile menu
		// $this->menu([
		// 	'navatts'=>['id'=>'mobile-menu', 'class'=>'accordion-menu hidden-md hidden-lg'],
		// 	'depth'=>2
		// ]);

	}	

}