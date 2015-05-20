<?php 
require('../../../conf/setup.php');
$local = [];

$page = new \Athill\Utils\Page($local);

$site['utils']['menu']->ls();

$page->end();
