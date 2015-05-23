$(function() {
	var $committee = $('#committee'),
		$prospects = $('#prospects'),
		$nameField = $('#add-prospect'),
		mappings = {};

	$.getJSON('/data/mappings.json', function(data) {
		mappings = data;
	});

	$.getJSON('/data/committee.json', function(data) {
		data.forEach(function(member) {
			$memberprospects = $('<div class="member-prospects"></div>');
			$memberprospects.droppable({
			    drop: function (e, ui) {
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
				    		if ($(this).find('.name').text() === prospect) {
				    			alert(prospect + ' is already in the list for '+member);
				    			add = false;
				    			return false;
				    		}
				    	});			    		
			    	}
			    	if (add) {
			    		var data = {
			    			action: 'add-to-member-bucket',
			    			member: member,
			    			prospect: prospect
			    		};
			    		var success = function(data){
					    	console.log('success');
				    		//// clone object
					    	$clone = $draggable.clone();
					    	$clone.removeAttr('id');
					    	$clone.css({'cursor': 'auto'});
					    	$clone.find('.count').remove();
					    	//// change click handler for delete button
					    	$remove = $clone.find('.delete-button');
					    	$remove.off('click', removeProspectFromProspects);
					    	$remove.click(removeProspectFromMember);
					    	//// add clone to prospects
					        $droppable.append($clone);
					        //// increment parent count
					        $count = $parent.find('header .count');
					        increment($count);
					        //// increment prospect count
					        $count = $draggable.find('.count');
					        increment($count);
					    };
					    updateData(data, success);		    		

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
			$count = createCountDom();
			$prospect.append($count);
			$remove = createRemoveDom(removeProspectFromProspects);
			$prospect.append($remove);
			$prospects.append($prospect);
		});
		
	});

	$.getJSON('/data/mappings.json', function(data) {
		for (var member in data) {

		}
	});

	$('#add-prospect-form').submit(function(e) {
		e.preventDefault();
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
			var data = {
				action: 'add-to-prospects',
				prospect: name
			};
			var success = function(data) {
				$prospect = createProspectDom(name);
				$count = createCountDom();
				$prospect.append($count);
				$remove = createRemoveDom(removeProspectFromProspects);
				$prospect.append($remove);
				$prospects.append($prospect);
				$nameField.val('');				
			}
			updateData(data, success);
		}
	});

	function updateData(data, success) {
		$.ajax({
		    type: "GET",
		    url: "/update.php",
		    // The key needs to match your method's input parameter (case-sensitive).
		    data: data,
		    contentType: "application/json; charset=utf-8",
		    dataType: "json",
		    success: success,
		    failure: function(errMsg) {
		        alert(errMsg);
		    }
		});		
	}

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

	function createProspectDom(prospectName) {
		
		$prospect = $('<div id="'+getId(prospectName)+'" class="prospect">'+
			'<span class="name">'+prospectName+'</span>'+
			'</div>');
		$prospect.draggable({
		    helper:"clone"
		});
		return $prospect;
	}

	function createCountDom(count) {
		var count = count || 0;
		return $('<span class="count">'+count+'</span>');
	}

	function createRemoveDom(callback) {
    	$remove = $('<i class="fa fa-times-circle delete-button"></i>');
    	$remove.click(callback);		
    	return $remove;
	}

	function removeProspectFromProspects(e) {
		var $parent = $(this).parent();
		var name = $parent.find('.name').text();
		var data = {
			action: 'delete-from-prospects',
			prospect: name
		}
		var success = function(data) {
			$parent.remove();
			$committee.find('.member-prospects').each(function(i) {
				$(this).find('.prospect').each(function(j) {
					if ($(this).find('.name').text() === name) {
						// console.log($(this));
						removeProspectFromMemberDom($(this));
					}
				});
			});
		}
		updateData(data, success);
	}

	function removeProspectFromMember(e) {
		console.log($(this));
		removeProspectFromMemberDom($(this).parent());
	}

	function removeProspectFromMemberDom($prospect) {
		var $member = $prospect.closest('.member');
		var name = $prospect.find('.name').text();
		var id = getId(name);
		var $original = $('#'+id);
		if ($original.length > 0) {
			decrement($original.find('.count'));	
		}
		decrement($member.find('header .count'));
		$prospect.remove();
		console.log('removing '+name);			
	}



});

function getId(name) {
	return name.toLowerCase().replace(/ /, '-');
}