$(function() {
	$committee = $('#committee');
	$prospects = $('#prospects');
	$.getJSON('/data/committee.json', function(data) {
		data.forEach(function(member) {
			$memberprospects = $('<div class="member-prospects"></div>');
			$memberprospects.droppable({
			    drop: function (e, ui) {
			    	console.log('drop');
			    	var $droppable = $(this),
			    		$draggable = $(ui.draggable),
			    		$parent = $(this).parent(),
			    		$children = $(this).children(),
			    		add = true;
			    	var prospect = $draggable.find('.name').text();
			    	var member = $parent.find('header .name').text();
			    	var len = $children.length;
			    	//// check length
			    	if (len == 10) {
			    		alert(member+' already has 10 prospects');
			    		add = false;
			    	} else {
			    		//// check duplicates
				    	$children.each(function(i) {
				    		if ($(this).html() === prospect) {
				    			alert(prospect + ' is already in the list for '+member);
				    			add = false;
				    			return false;
				    		}
				    	});			    		
			    	}
			    	if (add) {
			    		//// clone object
				    	$clone = $draggable.clone();
				    	$clone.removeAttr('id');
				    	$clone.css({'cursor': 'auto'});
				    	$clone.find('.count').remove();
				    	//// add delete button
				    	$remove = $('<i class="fa fa-times-circle delete-button"></i>');
				    	$remove.click(function(e) {
				    		var $parent = $(this).parent();
				    		var $member = $(this).closest('.member');
				    		var name = $parent.find('.name').text();
				    		var id = getId(name);
				    		var $original = $('#'+id);
				    		decrement($original.find('.count'));
				    		decrement($member.find('header .count'));
				    		$parent.remove();
				    		console.log('removing '+name);
				    	});
				    	$clone.append($remove);
				    	//// add clone to prospects
				        $clone.appendTo($(this));
				        //// increment parent count
				        $count = $parent.find('header .count');
				        increment($count);
				        //// increment prospect count
				        $count = $draggable.find('.count');
				        increment($count);
			    	}

			        // console.log($draggable.html(), $(this).find('h4').html());
			    }
			});
			$member = createMemberDom(member);
			$member.append($memberprospects);			
			$committee.append($member);
		});
	});

	$.getJSON('/data/prospects.json', function(data) {
		data.forEach(function(prospect) {
			$prospect = createProspectDom(prospect);
			$prospects.append($prospect);
		});
		
	});

	$('#add-prospect-form').submit(function(e) {
		console.log('here');
		e.preventDefault();
		var $nameField = $('#add-prospect');
		var name = $nameField.val().trim();
		var add = true;
		if (name === '') {
			alert('Please supply a name');
			add = false;
		} else {
			$prospects.children().each(function(i) {
				var currentname = $(this).find('.name').text().trim();
				if (name === currentname) {
					alert(name + ' is already a prospect');
					add = false;
					return false;
				}
			});
		}
		if (add) {
			$prospect = createProspectDom(name);
			$prospects.append($prospect);
		}
	});

	function increment($elem) {
		$elem.html(parseInt($elem.html()) + 1);		
	}

	function decrement($elem) {
		$elem.html(parseInt($elem.html()) - 1);		
	}

	function createMemberDom(memberName) {
		return $('<div class="member">'+
				'<header>'+
				'<span class="name">'+memberName+'</span>'+
				'<span class="count">0</span>'+
				'</header>'+
				'</div>');
	}

	function createProspectDom(prospect, count) {
		var count = count || 0;
		$prospect = $('<div id="'+getId(prospect)+'" class="prospect">'+
			'<span class="name">'+prospect+'</span>'+
			'<span class="count">'+count+'</span>'+
			'</div>');
		$prospect.draggable({
		    helper:"clone"
		});
		return $prospect;
	}

});

function getId(name) {
	return name.toLowerCase().replace(/ /, '-');
}